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

/**
 * Gets the information of a user given a uid from Firebase Auth
 * 
 * @param {string} uid The users id
 * @returns {Promise<object>} The object containing the data of the user
 */
async function getUserById(uid) {
  try {
    const user = await auth.getUser(uid);

    return user.toJSON();
  } catch(error) {
    return undefined;
  }
}

/**
 * 
 * @param {Array} userIds The list of userIds
 * @returns {Promise<Array>} The list of usernames and ids in the format { userId: "uId", displayName: "Username" }
 */
async function getUsersIdsToUserNamesArray(userIds) {
  const result = [];
  
  for(var i=0; i < userIds.length; i++) {
    const uId = userIds[i];
    const userData = await getUserById(uId);
    result.push(userData !== undefined ? {userId: userData.uid, displayName: userData.displayName} : {});
  }

  return result;
}

export { db, auth, addDocumentWithId, getAllDocuments, updateDocument, getUserById, getUsersIdsToUserNamesArray };