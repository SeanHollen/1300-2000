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

  return mobileKeywords.some((keyword) => userAgent.includes(keyword));
};

export default isMobile;
