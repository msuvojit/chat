import Firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyBJHZTJs7JgRbXXazigiskcVW20ksb75qI",
  authDomain: "opdlift.firebaseapp.com",
  databaseURL: "https://opdlift.firebaseio.com",
  projectId: "opdlift",
  storageBucket: "opdlift.appspot.com",
  messagingSenderId: "860602596617",
  appId: "1:860602596617:web:1eaf710ed5bcc57d9067d8",
  measurementId: "G-691DZXRHRN"
};
// Initialize Firebase
var firebase = Firebase.initializeApp(firebaseConfig);
firebase.analytics();
export default firebase;
