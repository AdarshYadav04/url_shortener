import axios from 'axios';

export const getLocationFromIP = async (ip) => {
  try {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { region, country_name } = res.data;

    const parts = [region, country_name].filter(Boolean); // remove null/undefined
    return parts.join(', ') || 'Unknown';
  } catch (err) {
    console.error('IP lookup error:', err.message);
    return 'Unknown';
  }
};
