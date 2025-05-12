const { Router } = require("express");
const controller = require("../controllers/functionController");
// создаем объект маршрутизатор
const router = Router();

router.get('/users', controller.getAllUsers);
router.post('/sales-report', controller.getSalesReport);
router.get('/get-balance',controller.getBalance);
router.get('/available-zones',controller.available_zones);
//Исправлено 11 мая
router.post("/available-pc",controller.available_pc);


module.exports = router;