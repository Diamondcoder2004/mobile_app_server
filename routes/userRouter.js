const { Router } = require("express");
const controller = require("../controllers/userController"); //импортируйте контроллер

// создаем объект маршрутизатор
const router = Router();

// добавляем маршрутыs
router.post("/login", controller.getLogin);

//создание домашнего маршрута, который будет выводить имя пользователя пользователя.
// http://localhost:3001/home
router.get("/home", controller.getRedirectHome);
router.post("/register",controller.getRegister);

// экспортируем маршрутизатор на server
module.exports = router;
