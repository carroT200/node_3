const express = require('express');
const { v4: uuidv4 } = require('uuid');

const filmsRouter = express.Router();

const { readFilms, writeFilms } = require('../helpers');

filmsRouter.get('/api/films/readall', (req, res) => {
  readFilms((err, films) => {
    if (err) {
      res.status(500).send('Не смог прочитать фильмы');
      return;
    }
    const sortedFilms = films.sort(
      (a, b) => parseFloat(a.position) - parseFloat(b.position)
    );

    res.send(sortedFilms);
  });
});

filmsRouter.put('/api/films/update', (req, res) => {
  readFilms((err, films) => {
    if (err) {
      res.status(500).send('Не смог прочитать фильмы');
      return;
    }

    const updatedFilm = req.body;
    const filmIndex = films.findIndex((f) => f.id == updatedFilm.id);

    films[filmIndex] = { ...films[filmIndex], ...updatedFilm };

    if (updatedFilm.position) {
      films.forEach((film) => {
        if (
          film.position >= updatedFilm.position &&
          film.id !== updatedFilm.id
        ) {
          film.position += 1;
        }
      });
    }

    writeFilms(films, (err) => {
      if (err) {
        res.status(500).send('Не смог записать фильм');
        return;
      }
      res.status(201).send('updated');
    });
  });
});

filmsRouter.post('/api/films/create', (req, res) => {
  readFilms((err, films) => {
    if (err) {
      res.status(500).send('Не смог прочитать фильмы');
      return;
    }

    const { body } = req;

    const newId = uuidv4();
    const newFilm = {
      id: newId,
      title: body.title,
      rating: body.rating,
      year: body.year,
      budget: body.budget,
      gross: body.gross,
      poster: body.poster,
      position: body.position,
    };

    films.forEach((film) => {
      if (film.position >= newFilm.position) {
        film.position += 1;
      }
    });

    films.push(newFilm);

    writeFilms(films, (err) => {
      if (err) {
        res.status(500).send('Не смог записать фильм');
        return;
      }
      res.status(201).send(newFilm);
    });
  });
});

filmsRouter.get('/api/films/read/:id', (req, res) => {
  const {
    params: { id },
  } = req;

  readFilms((err, films) => {
    if (err) {
      res.status(500).send('Не смог прочитать фильмы');
      return;
    }

    const film = films.find((f) => f.id == id);

    res.status(201).send(film);
  });
});

filmsRouter.delete('/api/films/delete/:id', (req, res) => {
  const {
    params: { id },
  } = req;

  readFilms((err, films) => {
    if (err) {
      res.status(500).send('Не смог прочитать фильмы из файла');
      return;
    }

    const film = films.findIndex((f) => f.id == id);
    films.splice(film, 1);

    films.forEach((film) => {
      if (film.position > films[film]?.position) {
        film.position -= 1;
      }
    });

    writeFilms(films, (err) => {
      if (err) {
        res.status(500).send('Не смог записать фильм');
        return;
      }
      res.status(201).send(`item with id ${id} was deleted`);
    });
  });
});

module.exports = {
  filmsRouter,
};
