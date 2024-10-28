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
  var { machineid, userid } = req.body;
  var increment = 0;
  var new_availability = "Occupied";
  var new_sets_left = 5;

  // try to get machine and facility snapshots

  const machine_ref = doc(db, "machines", machineid);
  const machine_snap = (await getDoc(machine_ref)).data();

  const facility_ref = doc(db, "facilities", machine_snap.facility);
  const facility_snap = (await getDoc(facility_ref)).data();

  // info about machine and facility
  const machine_type = machine_snap.machine_type;
  const machine_availability = machine_snap.availability;
  const sets_left = machine_snap.sets_left;
  const allowWorkin = machine_snap.workin;
  const new_queue = machine_snap.queue;
  const same_type_occupied = facility_snap.occupied_machine_count[machine_type];
  const num_active_users = facility_snap.num_active_users;

  // how to update fields
  if (userid == null && machine_availability === "Unoccupied") {
    new_availability = "Unoccupied";
    new_sets_left = 0;
  } else if (userid == null && machine_availability === "Occupied") {
    new_availability = "Unoccupied";
    increment = -1;
    new_sets_left = 0;
  } else {
    if (machine_availability === "Occupied" && !allowWorkin) {
      // If work-in is not allowed, prevent new user from occupying
      return res
        .status(403)
        .send({ message: "Work-in is not allowed on this machine." });
    }
    increment = 1;
  }

  // update facility
  await updateDoc(facility_ref, {
    occupied_machine_count: {
      [machine_type]: same_type_occupied + increment,
    },
    num_active_users: num_active_users + increment,
  });

  // update machine
  await updateDoc(machine_ref, {
    userid: userid,
    availability: new_availability,
    sets_left: new_sets_left,
    queue: new_queue,
  });

  // return updated machine
  var machine_snap2 = (await getDoc(machine_ref)).data();
  res.status(200).send(machine_snap2);
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