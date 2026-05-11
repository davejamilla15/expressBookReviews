const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();


/* ---------------------------------------------------
   REGISTER USER
--------------------------------------------------- */
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!isValid(username)) {

      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });

    } else {
      return res.status(404).json({
        message: "User already exists!"
      });
    }

  }

  return res.status(404).json({
    message: "Unable to register user."
  });

});


/* ---------------------------------------------------
   TASK 10 - GET ALL BOOKS (AXIOS + ASYNC)
--------------------------------------------------- */
public_users.get('/', async function (req, res) {

  try {
    // Axios call (required by assignment)
    const response = await axios.get('http://localhost:5000/books');

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }

});


/* ---------------------------------------------------
   TASK 11 - GET BOOK BY ISBN (AXIOS + ASYNC)
--------------------------------------------------- */
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const book = response.data[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }

});


/* ---------------------------------------------------
   TASK 12 - GET BOOKS BY AUTHOR (PROMISE + AXIOS STYLE)
--------------------------------------------------- */
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const data = response.data;

    let result = {};

    Object.keys(data).forEach((isbn) => {
      if (data[isbn].author === author) {
        result[isbn] = data[isbn];
      }
    });

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }

});


/* ---------------------------------------------------
   TASK 13 - GET BOOKS BY TITLE (PROMISE + AXIOS STYLE)
--------------------------------------------------- */
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const data = response.data;

    let result = {};

    Object.keys(data).forEach((isbn) => {
      if (data[isbn].title === title) {
        result[isbn] = data[isbn];
      }
    });

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }

});


/* ---------------------------------------------------
   GET REVIEWS
--------------------------------------------------- */
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });

});


module.exports.general = public_users;