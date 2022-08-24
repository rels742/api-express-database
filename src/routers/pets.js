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

  res.json({
    pets: qResult.rows,
  });
});

router.post("/", async (req, res) => {
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

  res.json({
    pets: qResult.rows,
  });
});

router.get("/:id", async (req, res) => {
  let sqlQuery = "SELECT * FROM pets ";

  const petId = Number(req.params.id);
  const params = [];

  if (petId) {
    sqlQuery += "WHERE id = $1";
    params.push(petId);
  }

  const qResult = await db.query(sqlQuery, params);

  if (qResult.rowCount === 1) {
    res.json(qResult.rows[0]);
  } else {
    res.sendStatus(404);
  }
});

router.put("/:id", async (req, res) => {
  const sqlQuery = `UPDATE pets SET name = $1, age = $2, type = $3, breed = $4, microchip = $5
     WHERE id = $6
     RETURNING *;`;

  const petId = Number(req.params.id);
  const sqlParams = [
    req.body.name,
    req.body.age,
    req.body.type,
    req.body.breed,
    req.body.microchip,
    petId,
  ];

  const qResult = await db.query(sqlQuery, sqlParams);

  if (qResult.rowCount === 1) {
    res.json(qResult.rows[0]);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:id", async (req, res) => {
  let sqlQuery = `DELETE FROM pets 
    WHERE id = $1
    RETURNING *;`;

  const petId = Number(req.params.id);
  const params = [];

  if (petId) {
    params.push(petId);
  }

  const qResult = await db.query(sqlQuery, params);

  if (qResult.rowCount === 1) {
    res.json(qResult.rows[0]);
  } else {
    res.sendStatus(404);
  }
  console.log("test");
});

module.exports = router;
