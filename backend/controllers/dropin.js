import { db, getUserById, updateDocument } from "../firebase.js";

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
        if(req.method !== 'POST')
            return res.status(400);

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
            return res.status(200).json({
                success: false,
                msg: `No ${dropinName} dropin exists! Please try again!`
            });

        const dropinData = dropinDoc.data();
        const userData = await getUserById(userId);

        if(userData === undefined)
            return res.status(200).json({
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
            return res.status(400).json({
                success: false,
                msg: "Student already in dropin!"
            });
        }
        
        await updateDocument('facilities', dropinName, {
            num_active_users: dropinData.num_active_users+1,
            active_users_list: dropinActiveUsers
        });

        return res.status(200).json({
            success: true
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
        if(req.method !== 'POST')
            return res.status(400);

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
            return res.status(200).json({
                success: false,
                msg: `No ${dropinName} dropin exists! Please try again!`
            });

        const dropinData = dropinDoc.data();
        const userData = await getUserById(userId);

        if(userData === undefined)
            return res.status(200).json({
                success: false,
                msg: "Unable to verify user!"
            });

        const dropinActiveUsers = dropinData.active_users_list;
        const userIndex = dropinActiveUsers.indexOf(userData.uid);

        if(userIndex <= -1)
            return res.status(200).json({
                success: false,
                msg: `User not found in the ${dropinName} dropin!`
            });

        dropinActiveUsers.splice(userIndex, 1);
        
        await updateDocument('facilities', dropinName, {
            num_active_users: dropinData.num_active_users-1,
            active_users_list: dropinActiveUsers
        });

        return res.status(200).json({
            success: true
        });
    } catch(error) {
        console.log(`Error in leaveDropin: ${String(error)}`);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}