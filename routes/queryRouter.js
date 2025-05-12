const { Router } = require("express");
const controller = require("../controllers/queryController");

// создаем объект маршрутизатор
const router = Router();

router.get("/products",controller.getProducts)
router.get("/reservation-history",controller.getReservationHistory)


router.get('/purchase-history', controller.getPurchaseHistory);

router.post('/add-product', controller.addProduct);

router.post('/reservation-cancel', controller.cancelReservation);


module.exports = router;