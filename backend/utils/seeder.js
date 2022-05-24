const House = require('../models/house');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const house = require('../data/house');
// const { connect } = require('mongoose');

//Setting dotenv file
dotenv.config({ path: 'backend/config/config.env' })

connectDatabase();

const seedHouse = async () => {
    try {

        await House.deleteMany();
        console.log('House Deleted');

        await House.insertMany(house)
        console.log('House data seeded')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();  
     }
}

seedHouse();