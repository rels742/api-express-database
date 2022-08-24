const { request } = require("express");
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

router.get("/:id", async (req, res) => {
  //API request: Get a book by ID
  //SQL query: SELECT... WHERE

  let sqlQuery = "SELECT * FROM books ";

  //book id var
  const bookId = Number(req.params.id);
  const params = [];
  // console.log("HI", req.params.id);

  if (bookId) {
    sqlQuery += "WHERE id = $1";
    params.push(bookId);
  }

  const qResult = await db.query(sqlQuery, params);

  // console.log("RESULTS", qResult);

  res.json({
    books: qResult.rows,
  });
});

router.put("/:id", async (req, res) => {
  //API request: Update a book (by Id)
  // SQL query:
  //UPDATE books SET type ='Non-Fiction'
  // WHERE id = 2
  // RETURNING *;

  const sqlQuery = `UPDATE books SET title = $1, type = $2, author = $3, topic = $4, publicationDate = $5, pages = $6
   WHERE id = $7
   RETURNING *;`;

  const bookId = Number(req.params.id);
  const sqlParams = [
    req.body.title,
    req.body.type,
    req.body.author,
    req.body.topic,
    req.body.publicationDate,
    req.body.pages,
    bookId,
  ];
  //put the params in variable rather than having it all laid out in the qResukt varaiable, so then after the comma was able to replace the array with the variable name as its all stored in there

  const qResult = await db.query(sqlQuery, sqlParams);

  // console.log("QUERY", sqlQuery);
  // console.log("PARAMS", sqlParams);
  // console.log("RESULTS", qResult.rows);

  if (qResult.rowCount === 1) {
    res.json(qResult.rows[0]);
  } else {
    res.sendStatus(404);
  }

  // if statement that checks the row counts to see if something came back which would be one value, if nothing came back that means that id does not exist and so send back a 404 status code
});

module.exports = router;
