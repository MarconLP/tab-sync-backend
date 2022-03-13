const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Syncs = require('./models/sync')

dotenv.config()
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('connected to database'))

app.use(cors({ origin: '*' }))
app.use(express.urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('listening on port 3000')
})

app.get('/:token', async (req, res) => {
    const { token } = req.params
    const sync = await Syncs.findOne({ token })

    res.send(sync)
})

app.post('/:token', async (req, res) => {
    const { token } = req.params
    const { device } = req.body
    const sync = await Syncs.findOne({ token })

    if (sync.devices.find(x => x.name === JSON.parse(device).name)) {
        const currentDevice = sync.devices.find(x => x.name === JSON.parse(device).name)
        currentDevice.chromeSession = JSON.parse(device).chromeSession
    } else {
        sync.devices = [...sync.devices, JSON.parse(device)]
    }

    sync.save()
    res.send('OK')
})