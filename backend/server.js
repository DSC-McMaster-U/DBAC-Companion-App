const express = require("express");
const cors = require("cors");
const app = express();
const { db } = require("./firebase.js");

// Middleware to enable CORS
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Route to get all equipment details
app.get("/api/equipment/:category/:type/:id", async (req, res) => {
  const { category, type, id } = req.params;

  try {
    const doc = await db
      .collection("equipment")
      .doc(category)
      .collection(type)
      .doc(id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error retrieving equipment: ", error);
    // Ensure headers are only sent once
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to retrieve equipment" });
    }
  }
});

// Route to update equipment details (for both cardio and weightlifting)
app.put("/api/equipment/:category/:type/:id", async (req, res) => {
  const { category, type, id } = req.params;
  const { floor, isTaken, userId, setsLeft, duration } = req.body;

  try {
    const equipmentRef = db
      .collection("equipment")
      .doc(category)
      .collection(type)
      .doc(id);
    const doc = await equipmentRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const updateData = {};
    if (floor !== undefined) updateData.floor = floor;
    if (isTaken !== undefined) updateData.isTaken = isTaken;
    if (userId !== undefined) updateData.userId = userId;
    if (setsLeft !== undefined) updateData.setsLeft = setsLeft;
    if (duration !== undefined) updateData.duration = duration;

    await equipmentRef.update(updateData);
    res.status(200).json({ message: "Equipment updated successfully" });
  } catch (error) {
    console.error("Error updating equipment: ", error);
    res.status(500).json({ error: "Failed to update equipment" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
