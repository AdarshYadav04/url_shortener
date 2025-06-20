import axios from 'axios';

export const getLocationFromIP = async (ip) => {
  try {
    // Skip internal/localhost/private IPs
    if (
      ip === '127.0.0.1' ||
      ip === '::1' ||
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('::ffff:127.') ||
      ip.startsWith('::ffff:10.') ||
      ip === 'Unknown'
    ) {
      return 'Unknown';
    }

    // Normalize IPv6-mapped IPv4 (e.g., ::ffff:103.118.167.168)
    const normalizedIP = ip.replace('::ffff:', '');

    const res = await axios.get(`https://ipapi.co/${normalizedIP}/json/`);
    const { region, country_name } = res.data;

    const parts = [region, country_name].filter(Boolean);
    return parts.join(', ') || 'Unknown';
  } catch (err) {
    console.error('IP lookup error:', err.message);
    return 'Unknown';
  }
};
