const tryCatch = require('../utils/tryCatch');
require('dotenv').config();
const ENV = process.env;
const Car = require('../models/car');
const AutoPart = require('../models/ap');
const FixedCar = require('../models/fixedCar');
const User = require('../models/user');
const Cart = require('../models/cart');
const { FixRecord } = require('../models/invoices/fixrecord');
const path = require('path');
const appDir = path.dirname((require.main.filename));
const fs = require('fs');
const jwt = require('jsonwebtoken');


module.exports = {
    //For store
    getRemainingItems: tryCatch(async (req, res) => {
        const carData = await Car.getAll();
        const apData = await AutoPart.getAll();
        res.json({ car: carData, ap: apData });
    }),
    //Car API
    getByCarId: tryCatch(async (req, res) => {
        const id = req.query.id;
        const data = await Car.getCarById(id);
        res.json(data);
    }),
    getAllCar: tryCatch(async (req, res) => {
        const data = await Car.getAll();
        res.json(data);
    }),
    getAllType: tryCatch(async (req, res) => {
        const data = await Car.getAllType();
        res.json(data)
    }),
    getAllBrand: tryCatch(async (req, res) => {
        const data = await Car.getAllBrand();
        res.json(data)
    }),
    getCarPage: tryCatch(async (req, res) => {
        const page = parseInt(req.query.page);
        const perPage = parseInt(req.query.per_page);
        let types = req.query.type;
        let brands = req.query.brand;
        let searchStr = req.query.search;
        const maxPrice = req.query.max_price;
        const offset = (page - 1) * perPage;
        if (!(brands instanceof Array) && brands != undefined) {
            brands = [brands];
        }
        if (!(types instanceof Array) && types != undefined) {
            types = [types];
        }
        const data = await Car.getCarPage(searchStr, brands, types, maxPrice, perPage, offset);
        res.json(data);
    }),
    addNewCar: tryCatch(async (req, res) => {
        const entity = req.body.entity;
        const id = await Car.insert(entity);
        res.json(id);
    }),
    deleteCar: tryCatch(async (req, res) => {
        const id = req.body.id;
        try {
            await Car.delete(id);
            res.json({ success: true, message: 'Delete successfully!' });
        } catch (error) {
            res.json({ success: false, message: error });
        };
    }),
    updateCar: tryCatch(async (req, res) => {
        const id = req.body.id;
        const entity = req.body.entity;
        try {
            await Car.update(id, entity);
            req.json({ rs: true });
        } catch (error) {
            req.json({ rs: false });
        };
    }),
    getMostCar: tryCatch(async (req, res) => {
        const data = await Car.getMostCar();
        res.json(data);
    }),
    getCarImgs: tryCatch(async (req, res) => {
        const id = req.params.id;
        //todo: make it in utils
        let curImgs = [];
        const directoryPath = path.join(appDir, `public/images/cars/${id}`, 'other');
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }

            files.forEach(file => {
                curImgs.push(file);
            });
            res.json(curImgs);
        });
    }),
    updateCarQuantity: tryCatch(async (req, res) => {
        const { id, quantity } = req.body;
        const rs = await Car.updateQuanTity(id, quantity);
        res.send('done');
    }),

    //Auto part API
    getAllAp: tryCatch(async (req, res) => {
        const data = await AutoPart.getAll();
        res.json(data);
    }),
    getApPage: tryCatch(async (req, res) => {
        const page = parseInt(req.query.page);
        const perPage = parseInt(req.query.per_page);
        const offset = (page - 1) * perPage;
        let suppliers = req.query.supplier;
        if (!(suppliers instanceof Array) && suppliers != undefined) {
            suppliers = [suppliers];
        }
        const data = await AutoPart.getApPage(suppliers, perPage, offset);
        res.json(data);
    }),
    getAllSupplier: tryCatch(async (req, res) => {
        const data = await AutoPart.getAllSupplier();
        res.json(data);
    }),
    getAp: tryCatch(async (req, res) => {
        const id = req.query.id;
        const data = await AutoPart.getAutoPartByID(id);
        res.json(data);
    }),
    addNewAutoPart: tryCatch(async (req, res) => {
        const entity = req.body.entity;
        const id = await Car.insert(entity);
        res.json(id);
    }),
    deleteAutoPart: tryCatch(async (req, res) => {
        const id = req.body.id;
        try {
            await AutoPart.delete(id);
            req.json({ rs: true });
        } catch (error) {
            req.json({ rs: false });
        };
    }),
    updateAutoPart: tryCatch(async (req, res) => {
        const id = req.body.id;
        const entity = req.body.entity;
        try {
            await AutoPart.update(id, entity);
            req.json({ rs: true });
        } catch (error) {
            req.json({ rs: false });
        };
    }),
    getMostAp: tryCatch(async (req, res) => {
        const data = await AutoPart.getMostAp();
        res.json(data);
    }),
    deleteAp: tryCatch(async (req, res) => {
        const id = req.body.id;
        try {
            await AutoPart.delete(id);
            res.json({ success: true, message: 'Delete successfully!' });
        } catch (error) {
            res.json({ success: false, message: error });
        };
    }),
    //Fixed car API
    getAllFixedCar: tryCatch(async (req, res) => {
        const data = await FixedCar.getAll();
        res.json(data);
    }),
    getFixedCarByCusId: tryCatch(async (req, res) => {
        const id = req.query.id;
        const data = await FixedCar.getFixedCarByCusId(id);
        res.json(data);
    }),
    getFixedCarByCusIdAndSearch: tryCatch(async (req, res) => {
        const id = req.query.id;
        const car_plate = req.query.car_plate == undefined ? null : req.query.car_plate;
        const data = await FixedCar.getFixedCarByCusIdAndSearch(id, car_plate);
        res.json(data);
    }),
    addNewFixedCar: tryCatch(async (req, res) => {
        const entity = req.body;
        const cusId = await FixedCar.insert(entity);
        const data = await FixRecord.insert(FixRecord.castParam(null, entity.car_plate, new Date(), 0, 'Processing', false))
        res.json(data);
    }),
    //User
    getUserById: tryCatch(async (req, res) => {
        const data = await User.getById(req.params.id);
        res.json(data);
    }),

    //Cart
    getCartByCusID: tryCatch(async (req, res) => {
        const id = req.query.id;
        const data = await Cart.getCartByCusID(id);
        res.json(data);
    }),
    getCarInCart: tryCatch(async (req, res) => {
        const { customer_ID, car_ID } = req.query;
        let data = await Cart.getCarInCart(customer_ID, car_ID);
        data = data.length <= 0 ? null : data;
        res.json(data);
    }),
    insertToCart: tryCatch(async (req, res) => {
        const entity = req.body;
        const data = await Cart.insert(entity);
        res.json(data);
    }),
    updateCarQuanTityInCart: tryCatch(async (req, res) => {
        const { customer_ID, car_ID, quantity } = req.body;
        let check = await Cart.getCarInCart(customer_ID, car_ID);
        check = check.length <= 0 ? null : check;
        if (check == null) return res.status(400).send('Update error')
        await Cart.updateCarQuanTityInCart(customer_ID, car_ID, quantity);
        return res.json(true);
    }),
    deleteCartItem: tryCatch(async (req, res) => {
        const { customer_ID, car_ID } = req.body;
        await Cart.deleteCartItem(customer_ID, car_ID);
        return res.json(true);
    }),


    //PayMent
    getAccount: tryCatch(async (req, res) => {
        let token = jwt.sign({ id: req.user.id }, ENV.SECRET_KEY);
        const data = {
            token: token
        }
        const rs = await fetch(`http://localhost:${ENV.PAYMENT_PORT}/account`, {
            method: 'post',
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            body: JSON.stringify(data)
        });
        if (rs.ok) {
            const rsToken = await rs.json();
            const verifyData = jwt.verify(rsToken,ENV.VERIFY_KEY);
            return res.json(verifyData.account)
        }
        return res.status('400').send('Account not found or err');
    }),
    deposits: tryCatch(async (req, res) => {
        
    }),
    transferMoney: tryCatch(async (req, res) => {
        const transactionData = req.body;
        let token = jwt.sign(transactionData, ENV.SECRET_KEY);
        const data = {
            token: token
        }
        const rs = await fetch(`http://localhost:${ENV.PAYMENT_PORT}/transaction`, {
            method: 'post',
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            body: JSON.stringify(data)
        });
        if (rs.ok) {
            const rsToken = await rs.json();
            const verifyData = jwt.verify(rsToken,ENV.VERIFY_KEY);
            return res.json(verifyData)
        }
        return res.status('400').send('Error');
    })


}