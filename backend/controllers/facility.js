import {db} from '../firebase.js'
import { doc, deleteDoc, setDoc, getDoc, updateDoc, getCountFromServer } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

export const getMachineCapacityInfo = async (req, res) => {
    const { facility, machine_type } = req.body()

    const facilityRef = doc(db, "facilities", facility)
    const facility_snap = (await getDoc(facilityRef)).data()

    const num_occupied = facility_snap.occupied_machine_count[machine_type]
    const total_num_machines = facility_snap.num_machines[machine_type]

    res.status(200).send({
        num_occupied: num_occupied,
        total_num_machines: total_num_machines})
}

export const getFacilityCapacityInfo = async (req, res) => {
    const { facility } = req.body()

    const facilityRef = doc(db, "facilities", facility)
    const facility_snap = (await getDoc(facilityRef)).data()

    const num_active_users = facility_snap.num_active_users
    const capacity = facility_snap.capacity

    res.status(200).send({
        num_active_users: num_active_users,
        capacity: capacity
    })
}