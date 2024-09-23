const express = require('express');
const app = express();

const authMiddleware = require('./midlleware/mAuth');
const { checkUserAccess, checkAdminAccess } = require('./midlleware/roles');

const { filmsRouter } = require('./routes/films');
const { authRouter } = require('./routes/auth');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.post('/api/auth/register', authRouter);
app.post('/api/auth/login', authRouter);

app.use(authMiddleware);

app.get('/api/films/readall', checkUserAccess, filmsRouter);
app.get('/api/films/read/:id', checkUserAccess, filmsRouter);

app.post('/api/films/create', checkAdminAccess, filmsRouter);
app.put('/api/films/update', checkAdminAccess, filmsRouter);
app.delete('/api/films/delete/:id', checkAdminAccess, filmsRouter);

app.listen(3001, () => {
  console.log('Example app listening on port 3000!');
});
