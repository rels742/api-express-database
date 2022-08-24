const express = require("express");
const router = express.Router();
const db = require("../../db");

router.get("/", async (req, res) => {
  //   console.log(req.query);
  let sqlQuery = "SELECT * FROM books ";
  const params = [];

  if (req.query.type && req.query.topic) {
    sqlQuery += "WHERE type = $1 AND topic = $2";
    params.push(req.query.type);
    params.push(req.query.topic);
  } else if (req.query.type) {
    sqlQuery += "WHERE type = $1";
    params.push(req.query.type);
  } else if (req.query.topic) {
    sqlQuery += "WHERE topic = $1";
    params.push(req.query.topic);
  }
  // if statement that firstly checks if the query if asking for both type and topic, if not checks if its just type and if not where its just topic
  // for safe queries its saved in dollars and a params array is set up to pass the request into there

  console.log(`/books: ${sqlQuery}`);

  const qResult = await db.query(sqlQuery, params);
  // where something is await the function needs to be async for it to work

  //   console.log(qResult);
  res.json({
    books: qResult.rows,
  });
});

router.post("/", async (req, res) => {
  //API request: Create a book
  //SQL query: INSERT INTO...

  const sqlQuery = `INSERT INTO books (title, type, author, topic, publicationDate, pages)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;`;

  const qResult = await db.query(sqlQuery, [
    req.body.title,
    req.body.type,
    req.body.author,
    req.body.topic,
    req.body.publicationDate,
    req.body.pages,
  ]);

  // console.log("HERE ARE THE RESULTS", qResult);

  res.json({
    books: qResult.rows,
  });
});

module.exports = router;

// router.get("/", async (req, res) => {
//   //   console.log(req.query);
//   let sqlQuery = "SELECT * FROM books";
//   const params = [];

//   if (req.query.topic) {
//     sqlQuery += "WHERE topic = $1";
//     params.push(req.query.topic);
//   }

//   const qResult = await db.query(sqlQuery, params);

//   console.log(qResult);
//   res.json({
//     books: qResult.rows,
//   });
// });
