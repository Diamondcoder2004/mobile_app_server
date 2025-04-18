const { Router } = require("express");
const controller = require("../controllers/viewController");


// создаем объект маршрутизатор
const router = Router();

router.get("/monthly-report",controller.monthly_report);
router.get("/morning-report",controller.morning_report);
router.get("/afternoon-report",controller.afternoon_report);
router.get("/night-report",controller.night_report);

module.exports = router;