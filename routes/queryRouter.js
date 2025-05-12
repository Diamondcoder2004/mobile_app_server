const { Router } = require("express");
const controller = require("../controllers/queryController");

// создаем объект маршрутизатор
const router = Router();

router.get("/products",controller.getProducts)




module.exports = router;