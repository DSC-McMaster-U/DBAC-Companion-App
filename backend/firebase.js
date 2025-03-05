import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json")
});

const db = admin.firestore();
const auth = admin.auth();

// Function to add a document with a custom ID
const addDocumentWithId = async (collectionName, docId, documentData) => {
  try {
    const collectionRef = db.collection(collectionName);
    await collectionRef.doc(docId).set(documentData);
    console.log("Document written with ID: ", docId);
    return docId; // Return the custom document ID
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error; // Re-throw the error for further handling
  }
};

const updateDocument = async (collectionName, docId, data) => {
  const docRef =  db.collection(collectionName).doc(docId);
  await  docRef.update(data);
};

const getAllDocuments = async (collectionName) => {
  const collectionRef = db.collection(collectionName);
  const querySnapshot = await collectionRef.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { db, auth, addDocumentWithId, getAllDocuments, updateDocument };