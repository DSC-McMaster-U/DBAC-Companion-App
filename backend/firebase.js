import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, getDocs, doc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvLWO-U2B4JCBx0MIeaRQKtAPUqvCM5TQ",
  authDomain: "dbac-app.firebaseapp.com",
  projectId: "dbac-app",
  storageBucket: "dbac-app.appspot.com",
  messagingSenderId: "995867460373",
  appId: "1:995867460373:web:90cda938c9b11e1380df1c",
  measurementId: "G-QKRQCDYJBK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Function to add a document with a custom ID
const addDocumentWithId = async (collectionName, docId, documentData) => {
  try {
    await setDoc(doc(db, collectionName, docId), documentData);
    console.log("Document written with ID: ", docId);
    return docId; // Return the custom document ID
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; // Re-throw the error for further handling
  }
};

const updateDocument = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};
const getAllDocuments = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { db, addDocumentWithId, getAllDocuments, updateDocument };