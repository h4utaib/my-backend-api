const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// GET /users?emirates_id=...&dob=...
app.get("/users", async (req, res) => {
  const { emirates_id, dob } = req.query;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE emirates_id=$1 AND dob=$2",
      [emirates_id, dob]
    );

    if (result.rows.length > 0) {
      res.json({
        status: "success",
        data: result.rows[0]
      });
    } else {
      res.json({
        status: "error",
        message: "No matching record found"
      });
    }
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
