import { UAParser } from 'ua-parser-js';

const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    userAgent,
    browser: result.browser.name
      ? `${result.browser.name} ${result.browser.version || ''}`.trim()
      : 'Unknown browser',
    os: result.os.name ? `${result.os.name} ${result.os.version || ''}`.trim() : 'Unknown OS',
    device: result.device.type || 'desktop', // mobile/tablet/desktop fallback
  };
};

export default getDeviceInfo;
