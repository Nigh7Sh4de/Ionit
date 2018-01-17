import { combineReducers } from 'redux'
import persistReducer from 'redux-persist/lib/persistReducer';
import persistCombineReducers from 'redux-persist/lib/persistCombineReducers';
import createTransform from 'redux-persist/lib/createTransform';
import storage from 'redux-persist/lib/storage';

import EventReducer from './EventReducer'
import UserReducer from './UserReducer'

const eventReducerPersistConfig = {
  key: 'EventReducer',
  storage,
  // whitelist: ['data']
}

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['EventReducer']
}

export default persistCombineReducers(rootPersistConfig, {
  EventReducer: persistReducer(eventReducerPersistConfig, EventReducer),
  UserReducer
})