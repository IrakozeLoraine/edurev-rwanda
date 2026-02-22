import { combineReducers } from "redux";

const placeholderReducer = (state = {}) => state;

export const rootReducer = combineReducers({
  app: placeholderReducer,
});