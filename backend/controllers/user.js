import { db } from '../firebase.js'
import { doc, deleteDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

export const getUsers = async (req, res) => {
    const usersSnap = await getDocs(collection(db, "users"));

    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
}

export const getUser = async (req, res) => {
    const { studentnum } = req.params

    const userRef = doc(db, "users", String(studentnum));
    const userSnap = await getDoc(userRef);

    // check if student exists
    if (!studentnum || !userSnap.exists()) {
        return res.sendStatus(404)
    }

    // return student doc
    res.status(200).send(userSnap.data())
}

export const addUser = async (req, res) => {
    const { name, studentnum, macid, fulltime_status } = req.body
    const usersRef = collection(db, "users")

    await setDoc(doc(usersRef, studentnum), {
        name: name, 
        studentnum: studentnum, 
        macid: macid,
        fulltime_status: fulltime_status});

    // return all user documents
    const usersSnap = await getDocs(collection(db, "users"));
    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
}

// updates full time status
export const updateStatus = async (req, res) => {
    const { studentnum, newStatus } = req.body
    const userRef = await doc(db, "users", studentnum)

    const res2 = await updateDoc(userRef, { fulltime_status: newStatus })
    
    res.status(200).send((await getDoc(userRef)).data())
}

export const deleteUser = async (req, res) => {
    const { studentnum } = req.body
    const userRef = doc(db, "users", studentnum)
    const res2 = await deleteDoc(userRef)

    // return all user documents
    const usersSnap = await getDocs(collection(db, "users"));
    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
}