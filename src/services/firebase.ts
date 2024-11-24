import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "crypto-news-hub-dev.firebaseapp.com",
  projectId: "crypto-news-hub-dev",
  storageBucket: "crypto-news-hub-dev.appspot.com",
  messagingSenderId: "581326886241",
  appId: "1:581326886241:web:c441b7f3e0b1046f35f524"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);