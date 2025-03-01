import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAS4IbvrUx3dX7dpzzYKDHMIfbP68K8xTE",
	authDomain: "ayokvbys-79113.firebaseapp.com",
	projectId: "ayokvbys-79113",
	storageBucket: "ayokvbys-79113.firebasestorage.app",
	messagingSenderId: "1081343324300",
	appId: "1:1081343324300:web:9695ca773463e3e9684ba9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

export {  db, auth, storage };
