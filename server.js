const express = require("express");
const session = require('express-session');
const flash = require('express-flash');
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const port = 506; // Define your port

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    database: "bjirgaming",
    user: "root",
    password: "",
})

db.connect((err) => {
    if (err) throw err;
    console.log("database connected");
});

// Function to retrieve the maximum ID from the table
const getMaxId = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT MAX(id) AS maxId FROM data_diri", (err, result) => {
            if (err) {
                reject(err);
            } else {
                const maxId = result[0].maxId || 0;
                resolve(maxId);
            }
        });
    });
};

// Function to insert new data with the next available ID
const insertDataWithNextId = async (data) => {
    try {
        const maxId = await getMaxId();
        const nextId = maxId + 1;

        // Check if the data already exists
        const checkSql = `SELECT id FROM data_diri WHERE Nama = ? AND Kelas = ?`;
        db.query(checkSql, [data.Nama, data.Kelas], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                console.log(`Data with Nama: ${data.Nama} and Kelas: ${data.Kelas} already exists.`);
                // You cannot use req here, so you can send a flash message directly
                // Redirect to a page where you display the flash message or handle it in the client-side
                return; 
            } else {
                const insertSql = `INSERT INTO data_diri (id, Nama, Kelas) VALUES (?, ?, ?)`;
                db.query(insertSql, [nextId, data.Nama, data.Kelas], (err, result) => {
                    if (err) throw err;
                    console.log(`Inserted record with ID ${nextId}`);
                });
            }
        });
    } catch (err) {
        console.error("Error:", err);
    }
};

// Route to handle data insertion
app.post("/tambahkan", (req, res) => {
    insertDataWithNextId(req.body); // Insert data with the next available ID
    res.redirect("/");
});

// Route to delete data
app.post("/hapus", (req, res) => {
    const idToDelete = req.body.id; // delete ID
    const deleteSql = "DELETE FROM data_diri WHERE id = ?";
    db.query(deleteSql, [idToDelete], (err, result) => {
        if (err) throw err;
        res.redirect("/");
    });
});

// Route to retrieve data
app.get("/", (req, res) => {
    const sql = "SELECT * FROM data_diri";
    db.query(sql, (err, result) => {
        const users = JSON.parse(JSON.stringify(result));
        res.render("index", { users: users, title: "DAFTAR MURID" });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
