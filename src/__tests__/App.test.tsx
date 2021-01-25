import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

global.window.require = ((name: string) => {
  if (name === 'electron')
    return {
      ipcRenderer: {
        sendSync: () => ({}),
      },
    };

  throw new Error(`need mock for ${name}`);
}) as NodeRequire;
global.console.error = () => {};
global.console.log = () => {};

const app = import('../App');

describe('App', () => {
  it('should render', () => {
    const store = mockStore({ config: {} });

    return app.then(({ default: App }) =>
      expect(
        render(
          <Provider store={store}>
            <App />
          </Provider>
        )
      ).toBeTruthy()
    );
  });
});
