const express = require('express')
const app = express()
const bodyParser = require('body-parser')
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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000, () => {
    console.log('listening on port 3000')
})

app.get('/:token', async (req, res) => {
    const { token } = req.params
    const sync = await Syncs.findOne({ token })

    res.send(sync)
})

app.delete('/:token/:deviceName/closedTabs', async (req, res) => {
    const { token, deviceName } = req.params
    const sync = await Syncs.findOne({ token })

    const device = sync.devices.find(x => x.name === deviceName)
    device.closedTabs = []

    await sync.save()
    res.send('OK')
})

app.delete('/:token/:deviceName', async (req, res) => {
    const { token, deviceName } = req.params
    const { tabIds } = req.body
    const sync = await Syncs.findOne({ token })

    const device = sync.devices.find(x => x.name === deviceName)
    device.closedTabs = [...device.closedTabs, ...tabIds]

    await sync.save()
    res.send('OK')
})

app.delete('/:token', async (req, res) => {
    const { token } = req.params
    const { name } = req.body
    const sync = await Syncs.findOne({ token })

    sync.devices = sync.devices.filter(x => x.name !== name)

    sync.save()
    res.send('OK')
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