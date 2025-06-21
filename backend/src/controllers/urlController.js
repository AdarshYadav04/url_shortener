import urlModel from "../models/urlModel.js";
import generateShortId from "../utils/generateShortId.js";
import { getLocationFromIP } from "../utils/geoLocation.js";

const shortenUrl=async(req,res)=>{

    try {
        const {originalUrl}=req.body
        const existingUrl = await urlModel.findOne({ originalUrl, user: req.user.id });
        if (existingUrl) {
          return res.status(200).json({
            shortUrl: `${req.protocol}://${req.get('host')}/api/url/${existingUrl.shortId}`,
            message: 'Short URL already exists for this user'
          });
        }
        
        const shortId = generateShortId();
        
        const url = new urlModel({ originalUrl, shortId,user: req.user.id });
        await url.save();
        res.status(201).json({ shortUrl: `${req.protocol}://${req.get('host')}/api/url/${shortId}` });
        
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong' });
    }
    
}

const redirectUrl=async(req,res)=>{
    try {
    const { shortId } = req.params;
    const url = await urlModel.findOne({ shortId });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    const rawIp =req.headers['cg-connection-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
    const ip =rawIp?.split(',')[0]?.trim()
    const location = getLocationFromIP(ip);
    

    url.clicks.push({ ip, location });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
     
  }

}

const getDashboardData=async(req,res)=>{

  try {
    const urls = await urlModel.find({ user: req.user.id });
    const totalLinks = urls.length;
    const totalClicks = urls.reduce((sum, u) => sum + u.clicks.length, 0);
    const averageClicks = totalLinks ? (totalClicks / totalLinks).toFixed(2) : 0;
    const allLinks = urls.map(u => ({
      originalUrl: u.originalUrl,
      shortId: u.shortId,
      clickCount: u.clicks.length,
      locations: [...new Set(u.clicks.map(c => c.location))],
      createdAt: u.createdAt
    }));

    res.json({ totalLinks, totalClicks, averageClicks, links: allLinks });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
    
  }

}

export {shortenUrl,redirectUrl,getDashboardData}

