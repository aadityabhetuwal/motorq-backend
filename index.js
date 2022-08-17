const express = require('express')
const bookingRouter = require('./routers/booking')
const eventRouter = require('./routers/events')
const bodyParser = require('body-parser')
const db = require('./services/connectDb')
const cookie = require('cookie-parser')

const app = express()
app.use(cookie())

app.use('/bookings', bookingRouter);
app.use('/events', eventRouter);

app.use(bodyParser.json())

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`listening locally at ${port}...`)
})