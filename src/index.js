import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// 1. creating the redux store // importing the redux store
import { createStore, applyMiddleware } from "redux"; //<-- this is a function that is called beneath
// 4. importing the rootReducer already created
import rootReducer from "./store/reducers/rootReducer";
// 5. import the provider Component which can suround the <App/> and pass the store to the application so the application has access to the store
import { Provider } from "react-redux"; // read-redux it's the glue layer that combines react with redux
// a. adding a middleware to make async calls
import thunk from "redux-thunk";

// b. store enhancer applyMiddleware(thunk) we could add many different Middlewares inside here and we can also have many store enhancers here. And this enhance store funcionality
const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
