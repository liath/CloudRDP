import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';

import config from './config/reducers';

export default function configureStore(initialState = {}) {
  const middlewares = [ReduxThunk /* , routerMiddleware() */];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = composeWithDevTools(middlewareEnhancer);

  const rootReducer = combineReducers({
    config,
  });

  const store = createStore(rootReducer, initialState, enhancers);

  return store;
}
