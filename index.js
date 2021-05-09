require('dotenv').config()
const express = require('express')

const port = process.env.PORT || 1111

const app = express()

app.get('/', (req, res) => {
    res.send('Simple Authentication ExpressJS')
})

app.listen(port, () => console.log(`Server is running at port ${port}`))