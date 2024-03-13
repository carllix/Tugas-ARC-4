const express = require("express");
const fs = require("fs").promises; // Using promises version of fs
const app = express();
const port = 2000;

app.use(express.json());

let movieList = [];

app.get("/movies", (req, res) => {
    res.send(movieList);
});

app.get("/movies/:id", (req, res) => {
    const imdbID = req.params.id;
    const movie = movieList.find(movie => movie.imdbID === imdbID);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send("Film tidak ditemukan");
    }
});

app.post("/movies", (req, res) => {
    const newMovie = req.body;
    movieList.push(newMovie);
    res.status(201).json(newMovie);
});

app.delete("/movies/:id", (req, res) => {
    const imdbID = req.params.id;
    const index = movieList.findIndex(movie => movie.imdbID === imdbID);
    if (index !== -1) {
        const deletedMovie = movieList.splice(index, 1)[0];
        res.json(deletedMovie);
    } else {
        res.status(404).send("Film tidak ditemukan");
    }
});

app.put("/movies/:id", (req, res) => {
    const imdbID = req.params.id;
    const updatedMovie = req.body;
    const index = movieList.findIndex(movie => movie.imdbID === imdbID);
    if (index !== -1) {
        movieList[index] = { ...movieList[index], ...updatedMovie };
        res.json(movieList[index]);
    } else {
        res.status(404).send("Film tidak ditemukan");
    }
});

app.listen(port, async () => {
    console.log(`Server berjalan di port ${port}`);
    try {
        const jsonString = await fs.readFile("movies.json", "utf8");
        movieList = JSON.parse(jsonString);
    } catch (error) {
        console.error("Error reading movies.json:", error);
    }
});

process.on('SIGINT', async () => {
    try {
        await fs.writeFile("./movies.json", JSON.stringify(movieList, null, 2));
        console.log("Data film disimpan");
    } catch (error) {
        console.error("Error writing movies.json:", error);
    } finally {
        process.exit();
    }
});
