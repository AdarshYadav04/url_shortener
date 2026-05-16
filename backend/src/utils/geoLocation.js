import axios from "axios";
export const getLocationFromIP = async (ip) => {
  
  try {
    const res = await axios.get(`https://ipapi.co/${ip}/json`);
    console.log(res)
    
    return  res.data || 'Unknown';
    
  } catch (err) {
    console.error('IP lookup failed:', err.message);
    return 'Unknown';
  }
};
