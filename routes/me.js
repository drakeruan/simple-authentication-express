require('dotenv').config();
const router = require('express').Router()
const bcrypt = require('bcryptjs');

const db = require('../models');
const checkToken = require('../middlewares/checkToken');


router.use(checkToken)

router.get('/', async (req, res) => {
    const { id } = req.user;
    const me = await db.user.findByPk(id, {
        attributes: { exclude: ['hashedPassword'] },
    });
    if (!me) {
        return res.status(404).json({
            isError: true,
            message: 'Not Found Profile',
        })
    }
    return res.status(200).json({
        isError: false,
        message: 'Success',
        data: me
    })
})

router.post('/changepassword', async (req, res) => {
    const { id } = req.user;
    const { password, newPassword } = req.body;
    const me = await db.user.findByPk(id);
    if (!me) {
        return res.status(404).json({
            isError: true,
            message: 'Not Found Profile',
        })
    }
    const isMatchedPassword = await bcrypt.compareSync(password, me.hashedPassword)
    if (!isMatchedPassword) {
        return res.status(400).json({
            isError: true,
            message: 'Password incorrect'
        })
    }
    const newHashedPassword = await bcrypt.hashSync(newPassword, 12);
    await me.update({
        hashedPassword: newHashedPassword
    });
    return res.status(201).json({
        isError: false,
        message: 'Success'
    })

})



module.exports = router;