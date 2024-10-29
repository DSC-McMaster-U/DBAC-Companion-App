// ROUTE FOR CRUD OPERATIONS FOR USERS

import express from "express";
import pool from "../db.js";
import bodyParser from "body-parser";

// Router

const router = express.Router();

// Router Middlewares

router.use(bodyParser.urlencoded({ extended: true }));

// post (add new user)

router.post("/signup", async (req, res) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const macID = req.body.macID;
    const studentNumber = req.body.studentNumber;
    const isFullTime = req.body.isFullTime;

    const result = await pool.query(
      "SELECT * FROM user_info WHERE mac_id = $1 and student_number = $2",
      [macID, studentNumber]
    );
    if (result.rowCount === 0) {
      await pool.query(
        "INSERT INTO user_info (first_name, last_name, mac_id, student_number, is_fulltime) VALUES ($1, $2, $3, $4, $5)",
        [firstName, lastName, macID, studentNumber, isFullTime]
      );
      res.status(200).json({ success: "Signup successful" });
      console.log("Signup succesful");
    } else {
      res.status(500).json({
        error:
          "An account with this MacID and Student Number has already been created. Try logging in with those credentials.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// get (get specific user info)

router.get("/users/:studentNumber", async (req, res) => {
  try {
    const studentNumber = req.params.studentNumber;

    const result = await pool.query(
      "SELECT * FROM user_info WHERE student_number = $1",
      [studentNumber]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// patch (update specific user)

router.patch("/update/:studentNumber", async (req, res) => {
  try {
    const user = req.params.studentNumber;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const isFullTime = req.body.isFullTime;

    const result = await pool.query(
      "UPDATE user_info SET first_name = $1, last_name = $2, is_fulltime = $3 WHERE user = $4",
      [firstName, lastName, isFullTime, user]
    );
    res.status(200).json({ success: "Information updated." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// delete (delete specific user)

router.delete("/delete/:studentNumber", async (req, res) => {
  try {
    const user = req.params.studentNumber;

    const result = await pool.query(
      "DELETE FROM user_info WHERE student_number = $1",
      [user]
    );
    res.status(200).json({ success: "Account deleted." });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
