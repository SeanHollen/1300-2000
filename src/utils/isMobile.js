const isMobile = () => {
  const userAgent = navigator.userAgent;
  const mobileKeywords = [
    'Mobi',
    'Android',
    'iPhone',
    'iPad',
    'iPod',
    'Windows Phone',
  ];

  for (const keyword of mobileKeywords) {
    if (userAgent.includes(keyword)) {
      return true;
    }
  }

  return false;
};

export default isMobile;
