import { db } from './firebase.js'
import { doc, deleteDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import express from 'express'
import { FieldValue } from 'firebase-admin/firestore'

const app = express()
const port = 8383
app.use(express.json())

// GET ALL USERS
app.get('/users', async (req, res) => {
    const usersSnap = await getDocs(collection(db, "users"));

    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
})

// GET USER
app.get('/users/:studentnum', async (req, res) => {
    const { studentnum } = req.params

    // get student doc
    const userRef = doc(db, "users", String(studentnum));
    const userSnap = await getDoc(userRef);

    // check if it exists
    if (!studentnum || !userSnap.exists()) {
        return res.sendStatus(404)
    }

    // return student doc
    res.status(200).send(userSnap.data())
})

// ADD USER
app.post('/adduser', async (req, res) => {
    const { name, studentnum, macid, fulltime_status } = req.body
    const usersRef = collection(db, "users")

    // add user
    await setDoc(doc(usersRef, studentnum), {
        name: name, 
        studentnum: studentnum, 
        macid: macid,
        fulltime_status: fulltime_status});

    // return all user documents
    const usersSnap = await getDocs(collection(db, "users"));
    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
})

// CHANGE FULLTIME STATUS
app.patch('/changestatus', async (req, res) => {
    const { studentnum, newStatus } = req.body
    const userRef = await doc(db, "users", studentnum)
    const res2 = await updateDoc(userRef, { fulltime_status: newStatus })
    res.status(200).send((await getDoc(userRef)).data())
})

// DELETE USER
app.delete('/users', async (req, res) => {

    // delete user
    const { studentnum } = req.body
    const userRef = doc(db, "users", studentnum)
    const res2 = await deleteDoc(userRef)

    // return all user documents
    const usersSnap = await getDocs(collection(db, "users"));
    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))