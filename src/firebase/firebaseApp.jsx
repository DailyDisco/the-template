// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDeMEQcA7ORCgw-xw_nB75BkESLIR34VYs',
  authDomain: 'daily-disco.firebaseapp.com',
  projectId: 'daily-disco',
  storageBucket: 'daily-disco.appspot.com',
  messagingSenderId: '1037561376446',
  appId: '1:1037561376446:web:f6966ea5d538884c4c38ef',
  measurementId: 'G-5XC8KL8QSF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// eslint-disable-next-line import/prefer-default-export
export const initFirebase = () => {
  return app;
};

export const storage = getStorage(app);
