import { addDocumentWithId } from './firebase.js';

const addNewUser = async () => {
    const userData = {
        availability: "Free",
        facility: "pulse",
        machine_type: "preacher_curl_machine",
        sets_left: "0",
        userid: "NA",
        workin: "NA"
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

addNewUser();