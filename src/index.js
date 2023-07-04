import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import { combineReducers, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { authReducer } from './redux/reducers/authReducer';
import { helperReducer } from './redux/reducers/helperReducer';

const rootReducer = combineReducers({
  profile: authReducer,
  helpers: helperReducer
});

export const store = createStore(rootReducer, compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
