//2. create a root reducer where all reducers will be joined together
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
//3. import a function that combines reducers into one.
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer
});

export default rootReducer;
