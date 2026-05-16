import axios from "axios";

const PRIVATE_IP =
  /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fc00:|fe80:)/i;

function formatLocation(city, country) {
  if (city && country) return `${city}, ${country}`;
  return country || city || "Unknown";
}

async function lookupIpWho(ip) {
  const { data } = await axios.get(`https://ipwho.is/${ip}`, { timeout: 5000 });
  if (!data?.success) return null;
  return formatLocation(data.city, data.country);
}

async function lookupGeoJs(ip) {
  const { data } = await axios.get(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
    timeout: 5000,
  });
  if (!data?.country) return null;
  return formatLocation(data.city, data.country);
}

async function lookupIpApi(ip) {
  const { data } = await axios.get(`http://ip-api.com/json/${ip}`, {
    timeout: 5000,
    params: { fields: "status,country,city" },
  });
  if (data?.status !== "success") return null;
  return formatLocation(data.city, data.country);
}

const providers = [lookupIpWho, lookupGeoJs, lookupIpApi];

export const getLocationFromIP = async (ip) => {
  if (!ip || PRIVATE_IP.test(ip)) return "Local";

  for (const lookup of providers) {
    try {
      const location = await lookup(ip);
      if (location) return location;
    } catch (err) {
      console.error("IP lookup failed:", err.message);
    }
  }

  return "Unknown";
};
