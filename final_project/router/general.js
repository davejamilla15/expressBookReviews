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

    // check if user already exists
    if (!isValid(username)) {

      // add new user
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
   TASK 10: GET ALL BOOKS (ASYNC/AWAIT + PROMISE)
--------------------------------------------------- */
public_users.get('/', async function (req, res) {

  const getBooks = () => {
    return new Promise((resolve) => {
      resolve(books);
    });
  };

  try {
    const data = await getBooks();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }

});


/* ---------------------------------------------------
   TASK 11: GET BOOK BY ISBN
--------------------------------------------------- */
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  const getBookByISBN = () => {
    return new Promise((resolve, reject) => {

      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }

    });
  };

  try {
    const data = await getBookByISBN();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ message: error });
  }

});


/* ---------------------------------------------------
   TASK 12: GET BOOKS BY AUTHOR
--------------------------------------------------- */
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  const getBooksByAuthor = () => {
    return new Promise((resolve, reject) => {

      let result = {};
      const keys = Object.keys(books);

      keys.forEach((isbn) => {
        if (books[isbn].author === author) {
          result[isbn] = books[isbn];
        }
      });

      if (Object.keys(result).length > 0) {
        resolve(result);
      } else {
        reject("No books found for this author");
      }

    });
  };

  try {
    const data = await getBooksByAuthor();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ message: error });
  }

});


/* ---------------------------------------------------
   TASK 13: GET BOOKS BY TITLE
--------------------------------------------------- */
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  const getBooksByTitle = () => {
    return new Promise((resolve, reject) => {

      let result = {};
      const keys = Object.keys(books);

      keys.forEach((isbn) => {
        if (books[isbn].title === title) {
          result[isbn] = books[isbn];
        }
      });

      if (Object.keys(result).length > 0) {
        resolve(result);
      } else {
        reject("No books found for this title");
      }

    });
  };

  try {
    const data = await getBooksByTitle();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ message: error });
  }

});


/* ---------------------------------------------------
   GET REVIEWS BY ISBN
--------------------------------------------------- */
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });

});


module.exports.general = public_users;