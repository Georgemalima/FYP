const express = require('express');
const app = require('../app');
const router = express.Router();



const { 
    getHouses, 
    getHouseById, 
    createHouse, 
    updateHouse, 
    deleteHouse 
} = require('../controllers/houseController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.route('/houses').get(getHouses);
router.route('/houses/:id').get(getHouseById);

router.route('/landlord/house/create').post(isAuthenticatedUser, authorizeRoles('Landlord'), createHouse);
router.route('/landlord/houses/:id')
            .put(isAuthenticatedUser, authorizeRoles('Landlord'), updateHouse)
            .delete(isAuthenticatedUser, authorizeRoles('Landlord'), deleteHouse);



module.exports = router;