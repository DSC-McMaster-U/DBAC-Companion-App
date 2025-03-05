import { db } from '../firebase.js'

export const getUsers = async (req, res) => {
    const usersSnap = await db.collection('users').get();

    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
}

export const getUser = async (req, res) => {
    const { studentnum } = req.params

    const usersCollectionRef = db.collection('users');
    const userRef = usersCollectionRef.doc(String(studentnum));
    const userSnap = await userRef.get();

    // check if student exists
    if (!studentnum || !userSnap.exists()) {
        return res.sendStatus(404)
    }

    // return student doc
    res.status(200).send(userSnap.data())
}

export const addUser = async (req, res) => {
    const { name, studentnum, macid, fulltime_status } = req.body
    const usersRef = db.collection('users');

    await usersRef.doc(studentnum).set({
        name: name, 
        studentnum: studentnum, 
        macid: macid,
        fulltime_status: fulltime_status
    });

    // return all user documents
    const usersSnap = await db.collection("users").get();
    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
}

// updates full time status
export const updateStatus = async (req, res) => {
    const { studentnum, newStatus } = req.body
    const userRef = db.collection('users').doc(studentnum);

    const res2 = await userRef.update({ fulltime_status: newStatus });
    
    res.status(200).send((await db.doc(userRef).get()).data())
}

export const deleteUser = async (req, res) => {
    const { studentnum } = req.body
    const userRef = db.collection('users').doc(studentnum);
    const res2 = await userRef.delete();

    // return all user documents
    const usersSnap = await db.collection("users").get();
    res.status(200).send(usersSnap.docs.map(doc => doc.data()))
}