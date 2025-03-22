import admin from "firebase-admin";
import { db, getUserById, getUsersIdsToUserNamesArray, updateDocument } from "../firebase.js";
import { io } from "../server.js";

const { firestore } = admin;

// Keep track and emit changes in dropins list
const dropinsSnap = db.collection('facilities').where(
    firestore.FieldPath.documentId(), 
    'in',
    ['badminton', 'basketball', 'volleyball', 'soccer', 'tabletennis']
).onSnapshot((docs) => {
    (async () => {
        try {
            const dropins = {};
            for(const doc of docs.docs) {
                var dropin = doc.data();
                dropin.active_users_list = await getUsersIdsToUserNamesArray(dropin.active_users_list);
        
                dropins[doc.id] = dropin;
            }
    
            // Emit dropins
            io.emit('dropins_changed', { dropins: dropins });
        } catch (error) {
            console.log(`Handling dropins change failed: ${error}`);
        }
    })();
});

/**
 * 
 * @param {object} req The request object containing the request information
 * @param {object} res The response object that will be used to send a response to the client 
 * @returns The response object
 */
export async function getDropins(req, res) {
    try {
        const dropinsSnap = await db.collection('facilities').where(
            firestore.FieldPath.documentId(), 
            'in',
            ['badminton', 'basketball', 'volleyball', 'soccer', 'tabletennis']
        ).get();

        const dropins = dropinsSnap.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
        }, {});

        for(const dropinName in dropins) {
            const dropin = dropins[dropinName];
            dropin.active_users_list = await getUsersIdsToUserNamesArray(dropin.active_users_list);
        }

        return res.status(200).json({
            success: true,
            dropins: dropins
        });
    } catch(error) {
        console.error('Error in dropins:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }

}

/**
 * {
 *  dropin: The name of the dropin the user is leaving
 *  uid: The id of the user
 * }
 * 
 * @param {object} req The request object containing the request information
 * @param {object} res The response object that will be used to send a response to the client
 * @returns The response object
 */
export async function joinDropin(req, res) {
    try {
        const dropinName = req.body.dropin;
        const userId = req.body.uid;

        if(!dropinName || !userId)
            return res.status(400).json({
                success: false,
                msg: "Missing required parameters dropin and/or uid!"
            });

        const facilitiesCollection = db.collection('facilities');
        const dropinDocRef = facilitiesCollection.doc(dropinName);
        const dropinDoc = await dropinDocRef.get();

        if(!dropinDoc.exists) 
            return res.status(400).json({
                success: false,
                msg: `No ${dropinName} dropin exists! Please try again!`
            });

        const dropinData = dropinDoc.data();

        if(dropinData.num_active_users >= dropinData.capacity)
            return res.status(200).json({
                success: false,
                msg: `The ${dropinName} dropin is currently at capacity. Please try to join later!`
            });

        const userData = await getUserById(userId);

        if(userData === undefined)
            return res.status(400).json({
                success: false,
                msg: "Unable to verify user!"
            });

        const dropinActiveUsers = dropinData.active_users_list;
        const userIndex = dropinActiveUsers.indexOf(userData.uid);

        // ensuring the student is not already in the drop-in
        if(userIndex <= -1) {
            // add the user to the drop-in
            dropinActiveUsers.push(userData.uid);
        } else {
            return res.status(200).json({
                success: false,
                msg: "Student already in dropin!"
            });
        }

        dropinData.num_active_users += 1;
        dropinData.active_users_list = dropinActiveUsers;
        
        await updateDocument('facilities', dropinName, dropinData);

        dropinData.active_users_list = await getUsersIdsToUserNamesArray(dropinData.active_users_list);

        // Emit changes to dropin
        io.emit(`dropin_${dropinName}_updated`, dropinData);

        return res.status(200).json({
            success: true,
            dropin: dropinData
        });
    } catch(error) {
        console.log(`Error in joinDropin: ${String(error)}`);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * {
 *  dropin: The name of the dropin the user is leaving
 *  uid: The id of the user
 * }
 * 
 * @param {object} req The request object containing the request information
 * @param {object} res The response object that will be used to send a response to the client
 * @returns The response object
 */
export async function leaveDropin(req, res) {
    try {
        const dropinName = req.body.dropin;
        const userId = req.body.uid;

        if(!dropinName || !userId)
            return res.status(400).json({
                success: false,
                msg: "Missing required parameters dropin and/or uid!"
            });

        const facilitiesCollection = db.collection('facilities');
        const dropinDocRef = facilitiesCollection.doc(dropinName);
        const dropinDoc = await dropinDocRef.get();

        if(!dropinDoc.exists) 
            return res.status(400).json({
                success: false,
                msg: `No ${dropinName} dropin exists! Please try again!`
            });

        const dropinData = dropinDoc.data();
        const userData = await getUserById(userId);

        if(userData === undefined)
            return res.status(400).json({
                success: false,
                msg: "Unable to verify user!"
            });

        const dropinActiveUsers = dropinData.active_users_list;
        const userIndex = dropinActiveUsers.indexOf(userData.uid);

        if(userIndex <= -1)
            return res.status(400).json({
                success: false,
                msg: `User not found in the ${dropinName} dropin!`
            });

        dropinActiveUsers.splice(userIndex, 1);

        dropinData.num_active_users -= 1;
        dropinData.active_users_list = dropinActiveUsers;
        
        await updateDocument('facilities', dropinName, dropinData);

        dropinData.active_users_list = await getUsersIdsToUserNamesArray(dropinData.active_users_list);

        // Emit changes to dropin
        io.emit(`dropin_${dropinName}_updated`, dropinData);

        return res.status(200).json({
            success: true,
            dropin: dropinData
        });
    } catch(error) {
        console.log(`Error in leaveDropin: ${String(error)}`);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}