const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const queries = require("../queries");

require("dotenv").config();

const express = require("express"); 
const router = express.Router();

const pool = require("../db");

const secretKey = process.env.secretKey; // получение значения secretKey из файла .env

//extended: true означает, что req.body может содержать любые значения, extended: false - только строки.
//urlencoded({ extended: true })); //обрабатывает данные формы и добавляет их в объект req.body
const urlencodedParser = express.urlencoded({ extended: true }); //создадим отдельный экземпляр urlencodedParser для обработки данных из формы внутри функции getLogin

// Аутентификация пользователя
//не забудьте использовать async/await при выполнении асинхронных операций, таких как запрос к базе данных
const getLogin = async (req, res) => {

  // применим парсер для обработки данных из формы

  console.log("getlogin запуск");

  urlencodedParser(req, res, async () => {
    //const { username, password } = req.body;
    let username = req.body.username;


    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",    [username]  );
      console.log('user: ',username);
      const user = result.rows[0];

      let firstName = user.first_name;
      let lastName =  user.last_name;
      let password = req.body.password;
      if (!user) {
        console.warn(`Неудачная попытка входа для пользователя: ${username}`);
        return res
          .status(401)
          .json({ message: "Пользователь не найден или неверный пароль" });
      }
      

      const passwordMatch = (password == user.password);
        if (!passwordMatch) {
            console.warn(`Неверный пароль для пользователя: ${username}`);
            return res.status(401).json({ message: "Пользователь не найден или неверный пароль" });
        }

        // Если успешная аутентификация
        // Генерация JWT токена и добавление его срока действия через  параметр expiresIn равному 2 часа
        const token = jwt.sign({ userId: user.id }, secretKey, {
            expiresIn: "2h",
        });

        // Сохраняем токен в cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "None",
            //secure: true,
        });
        // Сохраняем токен в cookie
        res.cookie("lastName", encodeURIComponent(lastName), {
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });
        console.log("lastName",decodeURIComponent(lastName));

        // Сохраняем токен в cookie
        res.cookie("firstName", encodeURIComponent(firstName), {
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "None",
            //secure: true,
        });
        console.log('firstName',decodeURIComponent(firstName));


        // Сохраняем в cookie также имя пользователя на 2 часа
        res.cookie("username", username, {
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        // Сохраняем в cookie также id на 2 часа
        res.cookie("user_id", user.id, {
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        // Сохраняем в cookie также role_id на 2 часа
        res.cookie("role_id", user.role_id, {
            maxAge: 2 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });
        console.log("user.id = ",user.id);

        // Отправляем JSON-ответ вместо перенаправления
        // После успешной аутентификации
        return res.status(200).json({
            message: "Авторизация успешна",
            user: {
                id: user.id,
                username: username,
                firstName: firstName,
                lastName: lastName,
                role_id: user.role_id,
            },
        });
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
  });
};


// Функция для добавления пользователя
const getRegister = async (req, res) => {
  try {
      const { firstName, lastName,username,password,phone_number ,email,} = req.body;

      // Вызов процедуры register_user
      await pool.query(queries.register_user, [ firstName, lastName,username,password,phone_number ,email,]);

      res.status(201).json({ message: "User registered successfully" });

      // Перенаправление на авторизацию страницу
      res.get("/");
  } catch (error) {
      console.error("Error while registering user:", error);
      res.status(500).json({ message: "Error while registering user", error: error.message });
  }


};

const path = require('path');
const {decode} = require("jsonwebtoken"); // Импортируем модуль path

const getRedirectHome = async (req, res) => {
  // Проверяем наличие cookie с токеном и именем пользователя
  if (req.cookies && req.cookies.token && req.cookies.username) {
      const user = req.cookies.username; // Извлекаем имя пользователя из cookie
      
      // Определяем абсолютный путь к файлу home.html
      const homePath = path.join(__dirname, '..', 'public', 'home.html');
       
       res.sendFile(homePath, (err) => {
        if (err) {
           console.error('Ошибка при отправке файла home.html:', err);
          return res.status(500).send('Ошибка сервера');
         }
          // Можно добавить логирование об успешной отправке файла:
           // console.log(`Файл ${homePath} успешно отправлен`);
        });
  } else {
      res.send("Пожалуйста, войдите в систему, чтобы просмотреть эту страницу!");
  }
};

// экспортируем модуль как объект, в котором будет несколько функций
module.exports = {
  getLogin,
  getRegister,
  getRedirectHome,

};
