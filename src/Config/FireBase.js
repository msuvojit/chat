import Firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyCVBOk70HwuqqIor4h8qCPDNkoQS_iZSOw",
  authDomain: "newopdlift.firebaseapp.com",
  databaseURL: "https://newopdlift.firebaseio.com",
  projectId: "newopdlift",
  storageBucket: "newopdlift.appspot.com",
  messagingSenderId: "287274948468",
  appId: "1:287274948468:web:dbfbe2d4a8aba2d63fbe21",
  measurementId: "G-3P9KH84QHQ",
};
// Initialize Firebase
var firebase = Firebase.initializeApp(firebaseConfig);
firebase.analytics();
export default firebase;
