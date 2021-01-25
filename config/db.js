const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongoURI')

async function connectDB () {

try {
    await  mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex:true,
        useFindAndModify:false
    })
    console.log('mongodb connected')
} catch (error) {
console.error(error.message)
process.exit(1)
    
}
}


module.exports = connectDB