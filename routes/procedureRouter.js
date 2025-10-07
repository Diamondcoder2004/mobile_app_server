const { Router } = require("express");
const controller = require("../controllers/procedureController");


// создаем объект маршрутизатор
const router = Router();


router.post('/book-computer', controller.bookComputer);
router.post('/purchase-product', controller.purchaseProduct)
router.post('/top-up-balance', controller.topUpBalance)
router.post('/top-up-admin', controller.topUpAdmin)
router.post('/create-computer', controller.createComputer)
router.post("/change-comp-status",controller.change_comp_status)


module.exports = router;