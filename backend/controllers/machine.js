import { db, getUserById, updateDocument } from "../firebase.js";

export const getMachines = async (req, res) => {
  try {
    const machinesSnap = await db.collection('machines').get();
    const machines = machinesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).send({
      success: true,
      machines: machines
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch machines" });
  }
};

/**
 * {
 *    machineId: The id of the machine to retrieve
 * }
 * 
 * @param {object} req The request object containing the request information
 * @param {object} res The response object that will be used to send a response to the client
 * @returns The response object
 */
export const getMachineInfo = async (req, res) => {
  try {
    const { machineId } = req.body;

    if(!machineId)
      return res.status(400).json({
        success: false,
        msg: "Machine Id parameter is required."
      });

    const machineRef = db.collection('machines').doc(String(machineId));
    const machineSnap = await machineRef.get();

    // check if machine exists
    if (!machineSnap.exists) {
      return res.status(404).json({
        success: false,
        msg: "Machine with the given Id is not found."
      });
    }

    const machineData = machineSnap.data();
    const userIdList = machineData.userIds;

    for(var i=0; i < userIdList.length; i++) {
      const uid = userIdList[i];
      const userData = await getUserById(uid);
      userIdList[i] = userData !== undefined ? userData.displayName : '';
    }

    delete machineData.userIds;
    machineData.activeUsers = userIdList;

    return res.status(200).json({
      success: true,
      machine: machineData
    });
  } catch (error) {
    console.error('Error in getMachineInfo:', error);
    return res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * {
 *  machineId: The id of the machine the users wants to use,
 *  userId: The id of the user
 * }
 * 
 * @param {*} req The request object containing the request information
 * @param {object} res The response object that will be used to send a response to the client
 * @returns The response object
 */
export async function useMachine(req, res) {
  try {
    const { machineId, userId } = req.body;

    if(!machineId || !userId)
      return res.status(400).json({
        success: false,
        msg: "A required field is missing."
      });

    const machineSnap = await db.collection('machines').doc(String(machineId)).get();
    const userData = await getUserById(userId);

    if(!machineSnap.exists)
      return res.status(400).json({
        success: false,
        msg: 'No machine found with the provided id.'
      });

    if(!userData)
      return res.status(400).json({
        success: false,
        msg: 'User with the given ID cannot be verified.'
      });

    const machineData = machineSnap.data();

    if(machineData.availability !== "Free" && !machineData.workin) // Check if the user can use/join this machine.
      return res.status(200).json({
        success: false,
        msg: "Machine is currently occupied."
      });

    // Reset machine data
    machineData.sets_left = 0;
    machineData.workin = false;

    // Update machine data with new ID
    machineData.availability = "Occupied";
    machineData.userIds.push(userId);

    await updateDocument('machines', String(machineId), machineData);

    delete machineData.userIds;
    machineData.ativeUsers = [userData.displayName];

    return res.status(200).json({
      success: true,
      machine: machineData
    });
  } catch (error) {
    console.error('Error in useMachine:', error);
    return res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * {
 *  machineId: The id of the machine the user wants to leave,
 *  userId: The id of the user leaving the machine
 * }
 * 
 * @param {*} req The request object containing the request information
 * @param {object} res The response object that will be used to send a response to the client
 * @returns The response object 
 */
export async function leaveMachine(req, res) {
  try {
    const { machineId, userId } = req.body;

    if(!machineId || !userId)
      return res.status(400).json({
        success: false,
        msg: "A required field is missing."
      });

    const machineSnap = await db.collection('machines').doc(String(machineId)).get();
    const userData = await getUserById(userId);

    if(!machineSnap.exists)
      return res.status(404).json({
        success: false,
        msg: 'No machine found with the provided id.'
      });

    if(!userData)
      return res.status(400).json({
        success: false,
        msg: 'User with the given ID cannot be verified.'
      });

    const machineData = machineSnap.data();
    const userIds = machineData.userIds;
    const userIndex = userIds.indexOf(userId);

    if(userIndex <= -1)
      return res.status(400).json({
          success: false,
          msg: `User is not using this machine.`
      });

    // Update machine data
    userIds.splice(userIndex, 1);
    machineData.userIds = userIds;

    if(userIds.length == 0) { // This is the last user using the machine?
      machineData.availability = "Free";
      machineData.sets_left = 0;
      machineData.workin = false;
    }

    // Update doc in database
    await updateDocument('machines', String(machineId), machineData);

    // Get remaining user data
    for(var i=0; i < userIds.length; i++) {
      const uid = userIds[i];
      const userData = await getUserById(uid);
      userIds[i] = userData !== undefined ? userData.displayName : '';
    }

    delete machineData.userIds;
    machineData.ativeUsers = userIds;

    return res.status(200).json({
      success: true,
      machine: machineData
    });
  } catch (error) {
    console.error('Error in leaveMachine:', error);
    return res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * {
 *  machineId: The id of the machine the user wants to edit,
 *  userId: The id of the user trying to edit the machine,
 *  setsLeft: The number of sets left to set,
 *  workin: The workin status of the machine
 * }
 * 
 * @param {*} req The request object containing the request information
 * @param {object} res The response object that will be used to send a response to the client
 * @returns The response object 
 */
export async function editMachineUsageParams(req, res) {
  try {
    const { machineId, userId, setsLeft, workin } = req.body;

    if(!machineId || !userId || !setsLeft || workin === undefined)
      return res.status(400).json({
        success: false,
        msg: 'Missing required request parameters.'
      });

    if(setsLeft < 0 || setsLeft > 10) // Sets left can only be in the range [0, 10] (ie 0 <= setsLeft <= 10)
      return res.status(400).json({
        success: false,
        msg: "The amounts of sets left can only fall in the range [0, 10]."
      });
    
    const machineSnap = await db.collection('machines').doc(String(machineId)).get();
    const userData = await getUserById(userId);

    if(!machineSnap.exists) // Invalid machine?
      return res.status(400).json({
        success: false,
        msg: 'No machine found with the provided id.'
      });

    if(!userData) // Invalid user?
      return res.status(400).json({
        success: false,
        msg: 'User with the given ID cannot be verified.'
      });

    const machineData = machineSnap.data();

    const userIndex = machineData.userIds.indexOf(userId);

    if(userIndex != 0) // Only the first user to use the machine can update the machine
      return res.status(400).json({
        success: false,
        msg: 'This user does not have permissions to edit this machine.'
      });

    machineData.sets_left = setsLeft;
    machineData.workin = workin;

    await updateDocument('machines', String(machineId), machineData);

    return res.status(200).json({
      success: true,
      machine: machineData
    });
  } catch (error) {
    console.error('Error in getMachineInfo:', error);
    return res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}