import { db } from "../firebase.js";

export const getMachines = async (req, res) => {
  try {
    const machinesSnap = await db.collection('machines').get();
    const machines = machinesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).send(machines);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch machines" });
  }
};

export const getMachineInfo = async (req, res) => {
  const { machineid } = req.params;

  const machineRef = db.collection('machines').doc(machineid);
  const machineSnap = await machineRef.get();

  // check if machine exists
  if (!machineid || !machineSnap.exists) {
    return res.sendStatus(404);
  }

  res.status(200).send(machineSnap.data());
};

export const updateMachineUser = async (req, res) => {
  const { machineid, userid, workin } = req.body; // Add 'workin' here

  try {
    const machine_ref = db.collection("machines").doc(machineid);
    const machine_snap = (await machine_ref.get()).data();
    const facility_ref = db.collection("facilities").doc(machine_snap.facility);
    const facility_snap = (await facility_ref.get()).data();

    // If 'workin' is provided, update it in the machine document
    if (workin !== undefined) {
      await machine_ref.update({
        workin: workin,
      });
    }

    const { increment, new_availability } = determineAvailabilityAndIncrement(
      machine_snap,
      userid
    );

    const updatedFacility = await updateFacilityData(
      facility_ref,
      facility_snap,
      machine_snap,
      increment
    );

    await updateMachineData(
      machine_ref,
      new_availability,
      3,
      updatedFacility.new_queue,
      userid
    );

    const updated_machine = (await machine_ref.get()).data();
    res.status(200).send(updated_machine);
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred while updating the machine." });
  }
};

const determineAvailabilityAndIncrement = (machine_snap, userid) => {
  const { availability, workin } = machine_snap;
  let increment = 0;
  let new_availability = "Occupied"; // Default to "Occupied" when user is present

  // Handle cases where there is no user ID
  if (userid == null) {
    if (availability === "Free") {
      new_availability = "Free";
    } else if (availability === "Occupied") {
      new_availability = "Free";
      increment = -1; // Decrease sets left since machine becomes Free
    }
  } else {
    // When there is a user ID, handle occupancy and work-in rules
    if (availability === "Occupied" && !workin) {
      return { increment: 0, new_availability: "Occupied" };
    }
    increment = 1; // User occupies the machine, increment sets left
  }

  return { increment, new_availability };
};

// Helper function to update facility data
const updateFacilityData = async (
  facility_ref,
  facility_snap,
  machine_snap,
  increment
) => {
  const { machine_type } = machine_snap;
  const updated_occupied_count =
    facility_snap.occupied_machine_count[machine_type] + increment;
  const updated_num_users = facility_snap.num_active_users + increment;

  await facility_ref.update({
    occupied_machine_count: {
      [machine_type]: updated_occupied_count,
    },
    num_active_users: updated_num_users,
  });

  return {
    updated_occupied_count,
    updated_num_users,
    new_queue: machine_snap.queue,
  };
};

// Helper function to update machine data
const updateMachineData = async (
  machine_ref,
  new_availability,
  new_sets_left,
  new_queue,
  new_userid
) => {
  await machine_ref.update({
    userid: new_userid,
    availability: new_availability,
    sets_left: new_sets_left,
    queue: new_queue,
  });
};

export const updateSetsLeft = async (req, res) => {
  const { machineid, sets_left } = req.body;

  const machineRef = db.collection("machines").doc(machineid);

  await machineRef.update({
    sets_left: sets_left,
  });

  var machineSnap = await machineRef.get();

  res.status(200).send(machineSnap.data());
};

export const updateWorkIn = async (req, res) => {
  const { machineid, workin } = req.body;

  const machineRef = db.collection("machines").doc(machineid);

  await machineRef.update({
    workin: workin,
  });

  var machineSnap = await machineRef.get();

  res.status(200).send(machineSnap.data());
};

export const updateQueue = async (req, res) => {
  const { machineid, queue } = req.body;

  const machineRef = db.collection("machines").doc(machineid);

  machineRef.update({
    queue: queue,
  });

  var machineSnap = await machineRef.get();

  res.status(200).send(machineSnap.data());
};


