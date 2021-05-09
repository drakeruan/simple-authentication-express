require('dotenv').config();
const router = require('express').Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.user.findOne({
        where: { username: username.toLowerCase() }
    })
    if (!user) {
        return res.status(401).json({
            isError: true,
            message: 'Username or password incorrect'
        })
    }
    const isMatchedPassword = await bcrypt.compareSync(password, user.hashedPassword)
    if (!isMatchedPassword) {
        return res.status(401).json({
            isError: true,
            message: 'Username or password incorrect'
        })
    }
    const accessToken = jwt.sign({
        id: user.id,
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPRIRE_TIME_TOKEN
    })
    const refreshToken = jwt.sign({
        id: user.id
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPRIRE_TIME_REFRESH
    });
    return res.status(201).json({
        isError: false,
        message:'Success',
        accessToken,
        refreshToken
    })
})

router.post('/signup', async (req, res) => {
    const { fullName, username, password } = req.body;
    const existedUsername = await db.user.findOne({
        where: {
            username: username.toLowerCase()
        }
    });
    if (existedUsername) {
        return res.status(400).json({
            isError: true,
            message: 'Username is used'
        })
    }
    const hasdPassword = await bcrypt.hashSync(password, 12);
    const newUser = await db.user.create({
        fullName,
        username: username.toLowerCase(),
        hasdPassword
    })
    const accessToken = jwt.sign({
        id: newUser.id,
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPRIRE_TIME_TOKEN
    })
    const refreshToken = jwt.sign({
        id: newUser.id
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPRIRE_TIME_REFRESH
    });
    return res.status(201).json({
        isError: false,
        message: 'Sucess',
        accessToken,
        refreshToken
    })
})

module.exports = router;