import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {

    apiKey: "AIzaSyB0PzfmXKFRKRXCiZQLdg7SwERet_-9Bi4",
  
    authDomain: "simple-chat-90579.firebaseapp.com",
  
    projectId: "simple-chat-90579",
  
    storageBucket: "simple-chat-90579.appspot.com",
  
    messagingSenderId: "171506819130",
  
    appId: "1:171506819130:web:fe36eccc5e0b364c095503"
  
  };
  


// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

