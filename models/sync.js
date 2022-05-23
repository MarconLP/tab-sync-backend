const mongoose = require('mongoose')

const syncSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    devices: [
        {
            name: { type: String },
            chromeSession: { type: Object },
            closedTabs: { type: [Number] }
        }
    ]
})

module.exports = mongoose.model('Sync', syncSchema)
