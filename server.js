require("dotenv").config(); // библиотека dotenv загружает переменные среды из файла .env
const port = process.env.port;
const cookieParser = require("cookie-parser");
const queryRouter = require('./routes/queryRouter');
const procRouter  = require('./routes/procedureRouter');
const functionRoutes = require("./routes/functionRouter");
const userRouter = require("./routes/userRouter");
const viewRouter = require("./routes/viewRouter");
const path = require("path");
const publicPath = path.join(__dirname, "public");  
const express = require('express');
// Импортируем express-handlebars
const exphbs = require('express-handlebars'); 

const app = express();
app.use(cookieParser()); // Теперь можно устанавливать и извлекать файлы cookie, используя объекты res и req соответственно.
app.use(express.json());
app.use(express.static(publicPath));
app.get("/", (req, res) => {
    //res.send("Hello"); //метод get получает параметры: 1) url, 2) функцию collback с параметрами запрос и ответ

    res.sendFile(path.join(publicPath, "login.html")); // Отправляем файл index.html при запросе на корневой URL
  });

  app.get("/user/register", (req, res) => {
    //res.send("Hello"); //метод get получает параметры: 1) url, 2) функцию collback с параметрами запрос и ответ
    res.sendFile(path.join(publicPath, "register.html")); // Отправляем файл index.html при запросе на корневой URL
  });  
//Связываем queryRouter c /api/query 
//дАлее методы взываются так как указано в queryRouter
//Добавляются соответствующие /
app.use('/api/query', queryRouter);
app.use('/api/proc',procRouter);
//работа с пользовательскими функциями БД
app.use("/api/function", functionRoutes);
app.use("/api/view",viewRouter);
app.use("/user",userRouter);

app.listen(port, () => console.log(`Сервер запущен! ${port}`));