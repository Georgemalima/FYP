const mongoose = require('mongoose')

//database connection
const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    }).then( con => {
        console.log(`Database connected with host: ${con.connection.host}`)
    })
}

module.exports = connectDatabase
