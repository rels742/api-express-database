const { request } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  let sqlQuery = "SELECT * FROM pets ";
  const params = [];

  if (req.query.type) {
    sqlQuery += "WHERE type = $1";
    params.push(req.query.type);
  }

  const qResult = await db.query(sqlQuery, params);

  //   console.log(qResult);
  res.json({
    pets: qResult.rows,
  });
});

router.post("/", async (req, res) => {
  //API request: Create a book
  //SQL query: INSERT INTO...

  const sqlQuery = `INSERT INTO pets (name, age, type, breed, microchip)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`;

  const qResult = await db.query(sqlQuery, [
    req.body.name,
    req.body.age,
    req.body.type,
    req.body.breed,
    req.body.microchip,
  ]);

  //   console.log("HERE ARE THE RESULTS", qResult);

  res.json({
    pets: qResult.rows,
  });
});

module.exports = router;
