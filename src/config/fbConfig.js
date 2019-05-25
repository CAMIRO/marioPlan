import firebase from "firebase/app";
//this is the database
import "firebase/firestore";
import "firebase/auth";
//inizialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDt0NI1eGvWr5kJTTh2YzFOnlgwcah5Ub8",
  authDomain: "camiro-marioplan.firebaseapp.com",
  databaseURL: "https://camiro-marioplan.firebaseio.com",
  projectId: "camiro-marioplan",
  storageBucket: "camiro-marioplan.appspot.com",
  messagingSenderId: "958856808147",
  appId: "1:958856808147:web:ffd996cb4658d082"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
