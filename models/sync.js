const mongoose = require('mongoose')
const Schema = mongoose.Schema

const syncSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    devices: [
        {
            name: { type: String },
            chromeSession: { type: Object }
        }
    ]
})

module.exports = mongoose.model('Sync', syncSchema)
