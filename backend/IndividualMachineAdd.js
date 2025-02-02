import { addDocumentWithId, getAllDocuments, updateDocument } from './firebase.js';

const addNewUser = async () => {
    const userData = {
        availability: "Free",
        facility: "pulse",
        machine_type: "preacher_curl_machine",
        sets_left: "0",
        userid: "NA",
        workin: true
    };

    // Specify a custom document ID
    const customDocId = "40"; // Replace with your desired ID

    try {
        const docId = await addDocumentWithId("machines", customDocId, userData);
        console.log("New user added with ID: ", docId);
    } catch (error) {
        console.error("Failed to add user: ", error);
    }
};
const updateAllSetsLeft = async () => {
    try {
        const documents = await getAllDocuments("machines");

        const updatePromises = documents.map(doc => {
            return updateDocument("machines", doc.id, { sets_left: 0 });
        });

        await Promise.all(updatePromises);
        console.log("All documents updated successfully.");
    } catch (error) {
        console.error("Failed to update documents: ", error);
    }
};
// addNewUser();
updateAllSetsLeft();
