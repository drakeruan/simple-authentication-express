require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const db = require('./models');

const port = process.env.PORT || 1111

const app = express()

db.sequelize.sync()

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Simple Authentication ExpressJS')
})

app.use('/auth', require('./routes/auth'))
app.use('/me', require('./routes/me'))


app.listen(port, () => console.log(`Server is running at port ${port}`))