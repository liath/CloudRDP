import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ReduxThunk from 'redux-thunk';

import config from './config/reducers';

export default function configureStore(initialState = {}) {
  const middlewares = [ReduxThunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = composeWithDevTools(middlewareEnhancer);

  const rootReducer = persistReducer(
    {
      key: 'root',
      storage,
    },
    combineReducers({
      config,
    })
  );

  const store = createStore(rootReducer, initialState, enhancers);
  const persistor = persistStore(store);
  return { store, persistor };
}
