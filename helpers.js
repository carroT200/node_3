const fs = require('fs');
const path = require('path');

function readFilms(callback) {
  fs.readFile('films.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении файла:', err);
      callback(err, null);
      return;
    }
    try {
      const films = JSON.parse(data);
      callback(null, films);
    } catch (parseError) {
      console.error('Ошибка при парсинге JSON:', parseError);
      callback(parseError, null);
    }
  });
}

function writeFilms(films, callback) {
  fs.writeFile('films.json', JSON.stringify(films, null, 2), (err) => {
    if (err) {
      console.error('Ошибка при записи файла:', err);
      callback(err);
      return;
    }
    console.log('Файл успешно записан');
    callback(null);
  });
}

const writeUser = (users, callback) => {
  const filePath = path.join(__dirname, '../users.json');
  fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Ошибка записи в файл users.json:', err);
      callback(err);
    } else {
      console.log('Пользователь успешно добавлен в файл users.json');
      callback(null);
    }
  });
};

module.exports = {
  readFilms,
  writeFilms,
  writeUser,
};
