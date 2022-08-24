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

module.exports = router;
