const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.c');

router.post('/account',PaymentController.getAccountById);
router.post('/transaction',PaymentController.createTransaction);
router.post('/create-payment-account',PaymentController.createNewAccount);

module.exports = router;