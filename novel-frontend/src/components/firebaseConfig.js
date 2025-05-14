import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA0Dl8Q-oNzawQhXhIHV8m5CdN5Exd5Occ",
  authDomain: "saganovel-e075a.firebaseapp.com",
  databaseURL: "https://saganovel-e075a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "saganovel-e075a",
  storageBucket: "saganovel-e075a.firebasestorage.app",
  messagingSenderId: "149812539900",
  appId: "1:149812539900:web:cf3b3eef33b4f36faf4279"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
