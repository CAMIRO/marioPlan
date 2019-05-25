import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// 1. creating the redux store // importing the redux store
import { createStore } from "redux"; //<-- this is a function that is called beneath
// 4. importing the rootReducer already created
import rootReducer from "./store/reducers/rootReducer";
// 5. import the provider Component which can suround the <App/> and pass the store to the application so the application has access to the store
import { Provider } from "react-redux"; // read-redux it's the glue layer that combines react with redux

const store = createStore(rootReducer);

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
