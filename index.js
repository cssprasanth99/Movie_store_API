const express = require("express");
const connection = require("./db.js");
const Movie = require("./Models/movie.js");

const server = express();
const PORT = 3000;

server.use(express.json());

// Create a new movie
server.post("/add-movie", async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).send(movie);
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all details from db
server.get("/", async (req, res) => {
  try {
    const { q, title, rating, sortBy } = req.query;
    console.log(q, title, rating, sortBy);
    let filter = {};

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (rating) {
      filter.rating = rating;
    }

    let movies = Movie.find(filter);

    if (sortBy) {
      movies = movies.sort({ [sortBy]: 1 });
    }

    const results = await movies.exec();
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a movie by ID
server.patch("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).send();
    }
    res.send(movie);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a movie by ID
server.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).send();
    }
    res.send(movie);
  } catch (err) {
    res.status(500).send(err);
  }
});

server.listen(PORT, async () => {
  try {
    await connection;
    console.log(
      `Server is running on http://localhost:${PORT} and db is connected`
    );
  } catch (error) {
    console.log(error);
  }
});
