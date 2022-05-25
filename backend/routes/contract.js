const express = require('express');
const app = require('../app');
const router = express.Router();

const { 
    getContracts, 
    getContractById, 
    createContract, 
    updateContract, 
    deleteContract 
} = require('../controllers/houseController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/contracts').get(getContracts);
router.route('/contracts/:id').get(getContractById);

router.route('/landlord/contract/create').post(isAuthenticatedUser, authorizeRoles('Landlord'), createContract);
router.route('/landlord/contract/:id')
            .put(isAuthenticatedUser, authorizeRoles('Landlord'), updateContract)
            .delete(isAuthenticatedUser, authorizeRoles('Landlord'), deleteContract);