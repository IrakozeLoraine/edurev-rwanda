import { combineReducers } from "redux";
import { authReducer } from "./authReducer";

const placeholderReducer = (state = {}) => state;

export const rootReducer = combineReducers({
  app: placeholderReducer,
  auth: authReducer,
});