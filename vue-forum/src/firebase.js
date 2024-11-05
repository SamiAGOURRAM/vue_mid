import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/storage'; 


const firebaseConfig = {
  apiKey: "AIzaSyBufLc1UQozgL6FkhEzgmtZ52Ba9BXYKig",
  authDomain: "tp6-forum-37a15.firebaseapp.com",
  projectId: "tp6-forum-37a15",
  storageBucket: "tp6-forum-37a15.appspot.com",
  messagingSenderId: "424450261076",
  appId: "1:424450261076:web:82393593b12e285da12dc1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.functions();
const storage = firebase.storage(); // Initialize storage


export { firebase, db, auth, functions, storage };