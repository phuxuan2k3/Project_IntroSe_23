const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/api.c');
const registerUser = require('../middlewares/register');

//Handle login here
//Car
router.get('/car/all', ApiController.getAllCar);
router.get('/car/type', ApiController.getAllType);
router.get('/car/brand', ApiController.getAllBrand);
router.get('/car/car_page', ApiController.getCarPage);
router.get('/car/no_remain_car', ApiController.getNumberOfRemainingCar);
router.get('/car/most_car', ApiController.getMostCar);

//AutoPart
router.get('/ap/all', ApiController.getAllAp);
router.get('/ap/supplier', ApiController.getAllSupplier);
router.get('/ap/detail', ApiController.getAp);
router.get('/ap/ap_page', ApiController.getApPage);
router.get('/ap/no_remain_ap', ApiController.getNumberOfRemainingAutoPart);
router.get('/ap/most_ap', ApiController.getMostAp);

//Fixed car
router.get('/car/fixed/all', ApiController.getAllFixedCar);
router.get('/car/fixed/find', ApiController.getFixedCarByCusId);

//User
router.get('/user/:id', ApiController.getUserById);
router.post('/user/register', registerUser);

module.exports = router;