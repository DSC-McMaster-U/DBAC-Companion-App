import express from "express";
import { getUsers , getUser, addUser, updateStatus, deleteUser} from "../controllers/user.js";

const router = express.Router()

router.get("/users", getUsers)
router.get("/users/:studentnum", getUser)
router.post("/adduser", addUser)
router.patch("/changestatus", updateStatus)
router.delete("/users", deleteUser)

export default router