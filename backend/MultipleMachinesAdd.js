import { addDocumentWithId } from './firebase.js';

const addNewUser = async (customDocId) => {
    const userData = {
        availability: "Free",
        facility: "pulse",
        machine_type: "lat_pulldown",
        sets_left: "0",
        userid: "NA",
        workin: "NA"
    };

    try {
        const docId = await addDocumentWithId("machines", customDocId.toString(), userData);
        console.log("New user added with ID: ", docId);
    } catch (error) {
        console.error("Failed to add user: ", error);
    }
};

const addMultipleUsers = async () => {
    for (let customDocId = 41; customDocId <= 49; customDocId++) {
        await addNewUser(customDocId);
    }
};

addMultipleUsers();