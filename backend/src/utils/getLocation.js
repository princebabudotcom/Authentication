import axios from 'axios';

export const getLocation = async (ip) => {
  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);

    return {
      country: data.country,
      state: data.regionName,
      city: data.city,
      timezone: data.timezone,
      isp: data.isp,
      lat: data.lat,
      lon: data.lon,
    };
  } catch (err) {
    return null;
  }
};
