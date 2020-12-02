import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Auth from './reducers/Auth';
import Threads from './reducers/Threads';
import Composethread from './reducers/Composethread';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({ Auth, Composethread, Threads }),
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

export default store;