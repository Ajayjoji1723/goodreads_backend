const express = require("express");
const _ = require("underscore");
const Book = require("../model/Book");

const router = express.Router();

//API'S
router.get("/books", async (req, res) => {
  try {
    const ipQuery = req.query;
    let result = [];
    if (_.size(ipQuery) !== 0) {
      const { rating, min_price, max_price, title } = req.query;
      let filter = {};

      if (title) filter.title = new RegExp(title, "i"); //it will case insensitive

      if (rating) filter.rating = { $gte: parseFloat(rating) };

      if (min_price || max_price) {
        filter.price = {};
        if (min_price) filter.price.$gte = Number(min_price);
        if (max_price) filter.price.$lte = Number(max_price);
      }

      result = await Book.find(filter);
    } else {
      result = await Book.find();
    }
    console.log("result: ", result);
    res.status(200).json({ Books: result });
  } catch (error) {
    console.log("/books   : ", error);
  }
});

//GET Single book
router.get("/book/:book_id", async (req, res) => {
  let response = { success: 1, message: "Book Fecthed successfully" };
  let statusCode = 200;
  try {
    const bookId = req.params.book_id;
    if (bookId === "" || !bookId) throw new Error("Invalid BookId");

    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      throw new Error("Unable to find the book");
    }

    response.data = book;
  } catch (error) {
    console.log("/book/:book_id   : ", error);
    response.success = 0;
    response.message = error.message;
    statusCode = 400;
  }

  res.status(statusCode).json(response);
});

//Insert book API
router.post("/book", async (req, res) => {
  let response = { success: 1, message: "Book Added successfully" };
  let statusCode = 200;
  try {
    const ipData = req.body;
    if (_.size(ipData) === 0) throw new Error("Invalid Input");

    const newItem = {
      title: ipData.name,
      author: ipData.author,
      description: ipData.description,
      rating: ipData.rating,
      price: ipData.price,
    };
    const newBook = await Book.insertOne(newItem); //it will insert the data into the db
    response.data = newBook;
  } catch (error) {
    console.log("/book: ", error);
    response.success = 0;
    response.message = error.message;
    statusCode = 400;
  }
  res.status(statusCode).json(response);
});

//UPDATE BOOK API
router.put("/book/:book_id", async (req, res) => {
  let response = { success: 1, message: "Book Updated successfully" };
  let statusCode = 200;
  try {
    const bookId = req.params.book_id || "";
    if (bookId == "") throw new Error("Invalid Input");

    if (_.size(req.body) === 0) throw new Error("Invalid Input");
    const { price } = req.body;

    const updateData = { price };
    if (bookId == "") throw new Error("Invalid Input");
    const data = await Book.findByIdAndUpdate(bookId, updateData);
    response.data = data;
  } catch (error) {
    console.log("/book: ", error);
    response.success = 0;
    response.message = error.message;
    statusCode = 400;
  }
  res.status(statusCode).json(response);
});

//UPDATE BOOK API
router.delete("/book/:book_id", async (req, res) => {
  let response = { success: 1, message: "Book Deleted successfully" };
  let statusCode = 200;
  try {
    const bookId = req.params.book_id || "";
    if (bookId == "") throw new Error("Invalid Input");

    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) throw new Error("No records found on that book id");
    response.data = deletedBook;
  } catch (error) {
    console.log("/book/:book_id   : ", error);
    response.success = 0;
    response.message = error.message;
    statusCode = 400;
  }
  res.status(statusCode).json(response);
});

module.exports = router;
