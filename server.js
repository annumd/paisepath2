const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // change if needed
  password: "1Annmerin",       // add your MySQL password
  database: "paisepath_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL Database!");
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

// ---------- FETCH SAVINGS GROUPS ----------
app.get("/groups", (req, res) => {
  db.query("SELECT * FROM savings_groups", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// ---------- FETCH CONTRIBUTIONS ----------
app.get("/contributions/:user_id", (req, res) => {
  db.query("SELECT * FROM contributions WHERE user_id = ?", [req.params.user_id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.post("/contributions", (req, res) => {
  const { month, amount, user_id } = req.body;
  db.query("INSERT INTO contributions (month, amount, user_id) VALUES (?, ?, ?)", [month, amount, user_id], err => {
    if (err) throw err;
    res.json({ message: "Contribution added!" });
  });
});

// ---------- EMERGENCY FUND ----------
app.get("/emergency", (req, res) => {
  db.query("SELECT * FROM emergency_funds", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.post("/emergency", (req, res) => {
  const { user_name, amount, reason } = req.body;
  db.query(
    "INSERT INTO emergency_funds (user_name, amount, reason) VALUES (?, ?, ?)",
    [user_name, amount, reason],
    err => {
      if (err) throw err;
      res.json({ message: "Request submitted!" });
    }
  );
});

// ---------- ANNOUNCEMENTS ----------
app.get("/announcements", (req, res) => {
  db.query("SELECT * FROM announcements ORDER BY date_posted DESC", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// ---------- TRANSACTIONS ----------
app.get("/transactions", (req, res) => {
  db.query("SELECT * FROM transactions ORDER BY transaction_date DESC", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// ---------- GAMIFICATION ----------
app.get("/gamification", (req, res) => {
  db.query("SELECT * FROM gamification ORDER BY rank_position ASC", (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
