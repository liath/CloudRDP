const initialState = {
  analytics: false,
  region: 'us-west-2',
  ssmPrefix: '/cloudrdp',
  theme: 'default',
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
    case 'SET_THEME':
      return {
        ...state,
        theme: action.theme,
      };

    default:
      return state;
  }
}

export default config;
