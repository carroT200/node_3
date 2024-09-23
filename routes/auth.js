const fs = require('fs');
const path = require('path');

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersList = require('../users.json');

const { writeUser } = require('../helpers');

const authRouter = express.Router();

authRouter.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    super: false,
  };

  const usersPath = path.join(__dirname, '../users.json');
  fs.readFile(usersPath, 'utf8', (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Ошибка чтения файла пользователей' });
    }

    let usersList = [];
    try {
      usersList = JSON.parse(data);
    } catch (parseError) {
      return res
        .status(500)
        .json({ message: 'Ошибка парсинга файла пользователей' });
    }

    usersList.push(newUser);

    fs.writeFile(
      usersPath,
      JSON.stringify(usersList, null, 2),
      (writeError) => {
        if (writeError) {
          return res
            .status(500)
            .json({ message: 'Ошибка при сохранении пользователя' });
        }

        return res
          .status(201)
          .json({ message: 'User registered', user: newUser });
      }
    );
  });
});

authRouter.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = usersList.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ message: 'invalid data' });
  }

  const isPasportValid = await bcrypt.compare(password, user.password);

  if (!isPasportValid) {
    return res.status(401).json({ message: 'invalid data' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    'your_jwt_secret',
    { expiresIn: '5m' }
  );

  res.json({ token });
});

module.exports = {
  authRouter,
};
