const { tryCatchMiddleware } = require('../../utils/tryCatch');
require('dotenv').config();
const ENV = process.env;

module.exports = {
    getDashboard: tryCatchMiddleware(async (req, res) => {
        res.render('guestDashboard', { title: 'DashBoard' });
    })
}