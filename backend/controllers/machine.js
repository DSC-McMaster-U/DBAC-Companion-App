import { db } from "../firebase.js";
import {
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
  getDocFromCache,
} from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

export const getMachines = async (req, res) => {
  const machinesSnap = await getDocs(collection(db, "machines"));

  res.status(200).send(machinesSnap.docs.map((doc) => doc.data()));
};

export const getMachineInfo = async (req, res) => {
  const { machineid } = req.params;

  const machineRef = doc(db, "machines", machineid);
  const machineSnap = await getDoc(machineRef);

  // check if machine exists
  if (!machineid || !machineSnap.exists()) {
    return res.sendStatus(404);
  }

  res.status(200).send(machineSnap.data());
};

export const updateMachineUser = async (req, res) => {
  const { machineid, userid, workin } = req.body; // Add 'workin' here

  try {
    const machine_ref = doc(db, "machines", machineid);
    const machine_snap = (await getDoc(machine_ref)).data();
    const facility_ref = doc(db, "facilities", machine_snap.facility);
    const facility_snap = (await getDoc(facility_ref)).data();

    // If 'workin' is provided, update it in the machine document
    if (workin !== undefined) {
      await updateDoc(machine_ref, {
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
      5,
      updatedFacility.new_queue,
      userid
    );

    const updated_machine = (await getDoc(machine_ref)).data();
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
    if (availability === "Unoccupied") {
      new_availability = "Unoccupied";
    } else if (availability === "Occupied") {
      new_availability = "Unoccupied";
      increment = -1; // Decrease sets left since machine becomes unoccupied
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

  await updateDoc(facility_ref, {
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
  await updateDoc(machine_ref, {
    userid: new_userid,
    availability: new_availability,
    sets_left: new_sets_left,
    queue: new_queue,
  });
};

export const updateSetsLeft = async (req, res) => {
  const { machineid, sets_left } = req.body;

  const machineRef = doc(db, "machines", machineid);

  await updateDoc(machineRef, {
    sets_left: sets_left,
  });

  var machineSnap = await getDoc(machineRef);

  res.status(200).send(machineSnap.data());
};

export const updateWorkIn = async (req, res) => {
  const { machineid, workin } = req.body;

  const machineRef = doc(db, "machines", machineid);

  await updateDoc(machineRef, {
    workin: workin,
  });

  var machineSnap = await getDoc(machineRef);

  res.status(200).send(machineSnap.data());
};

export const updateQueue = async (req, res) => {
  const { machineid, queue } = req.body;

  const machineRef = doc(db, "machines", machineid);

  updateDoc(machineRef, {
    queue: queue,
  });

  var machineSnap = await getDoc(machineRef);

  res.status(200).send(machineSnap.data());
};


