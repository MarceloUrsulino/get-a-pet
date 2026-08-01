const mongoose = require('mongoose')

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, { dbName: 'getapet' })
    console.log('Conectou ao mongoose.')
}

main().catch((err) => console.log(err))

module.exports = mongoose