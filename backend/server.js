const app = require('./app');
const connectDatabase = require('./config/database');



const dotenv = require('dotenv');

// Handle uncaughtException
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to uncaughtException');
    process.exit(1);
})


//setting environment variables
dotenv.config({ path:'backend/config/config.env' });



//connect to database
connectDatabase();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// Handle UnHandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled Promise rejection');
    server.close(() => {
        process.exit(1);
    })
} )