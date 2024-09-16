const express = require('express');
const app = express();

const { filmsRouter } = require('./routes/films');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.post('/api/films/create', filmsRouter);
app.get('/api/films/readall', filmsRouter);
app.get('/api/films/read/:id', filmsRouter);
app.put('/api/films/update', filmsRouter);
app.delete('/api/films/delete/:id', filmsRouter);

app.listen(3001, () => {
  console.log('Example app listening on port 3000!');
});
