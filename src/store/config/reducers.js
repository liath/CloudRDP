const initialState = {
  analytics: false,
  region: 'us-west-2',
  ssmPrefix: '/cloudrdp',
};

function config(state = initialState, action) {
  switch (action.type) {
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.analytics,
      };
    case 'SET_REGION':
      return {
        ...state,
        region: action.region,
      };
    case 'SET_SSM_PREFIX':
      return {
        ...state,
        ssmPrefix: action.ssmPrefix,
      };
    default:
      return state;
  }
}

export default config;
