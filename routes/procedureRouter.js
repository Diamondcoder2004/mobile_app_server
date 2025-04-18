const { Router } = require("express");
const controller = require("../controllers/procedureController");


// создаем объект маршрутизатор
const router = Router();


router.post('/book-computer', controller.bookComputer);
router.post('/purchase-product', controller.purchaseProduct)
router.post('/top-up-balance', controller.topUpBalance)
router.post('/create-computer', controller.createComputer)



module.exports = router;