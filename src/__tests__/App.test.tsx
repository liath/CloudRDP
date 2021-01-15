import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

global.window.require = (package) => {
  if (package === 'electron')
    return {
      ipcRenderer: {
        sendSync: () => ({}),
      },
    };

  throw new Error(`need mock for ${package}`);
};
global.console.error = () => {};
global.console.log = () => {};

const app = import('../App');

describe('App', () => {
  it('should render', () =>
    app.then(({ default: App }) => expect(render(<App />)).toBeTruthy()));
});
