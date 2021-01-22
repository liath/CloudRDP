export const setAnalytics = (analytics) => {
  console.log(`[store/config] set analytics to: ${analytics}`);

  return {
    type: 'SET_ANALYTICS',
    analytics,
  };
};

export const setRegion = (region) => {
  console.log(`[store/config] set region to: ${region}`);

  return {
    type: 'SET_REGION',
    region,
  };
};

export const setSSMPrefix = (ssmPrefix) => {
  console.log(`[store/config] set ssmPrefix to: ${ssmPrefix}`);

  return {
    type: 'SET_SSM_PREFIX',
    ssmPrefix,
  };
};
