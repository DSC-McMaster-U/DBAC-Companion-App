const express = require('express');
// const cors = require('cors');
const pool = require('./db')
const port = `1337`

const app = express();
// Middleware to enable CORS
// app.use(cors());
app.use(express.json());

// Route
app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM user')
        res.status(200).send( data.rows )
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
});

app.post('/', async (req, res) => {
    const { name, location } = req.body
    try {
        await pool.query('INSERT INTO user (first_name, last_name, mac_id, student_num, is_fulltime) VALUE ($1, $2, $3, $4, $5)', [first_name, last_name, mac_id, student_num, is_fulltime])
        res.status(200).send({message: "Successfully added user" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE user( id SERIAL PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), mac_id VARCHAR(50), student_num CHAR(9), is_fulltime BOOLEAN')
        res.status(200).send({message: "Successfully created table" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


// Start the server
// const PORT = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
