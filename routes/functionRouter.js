const { Router } = require("express");
const controller = require("../controllers/functionController");
// создаем объект маршрутизатор
const router = Router();

router.get('/users', controller.getAllUsers);
router.get('/sales-report', controller.getSalesReport);
router.get('/get-balance',controller.getBalance);
router.get('/available-zones',controller.available_zones);
router.get("/available-pc",controller.available_pc);


module.exports = router;