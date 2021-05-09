require('dotenv').config()
const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
    const accessToken = req.headers.authorization.slice(7);
    if (!accessToken) {
        return res.status(401).json({
            isError: true,
            message: 'Authorized failed',
        })
    }
    jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, result) => {
        if (err) {
            return res.status(401).json({
                isError: true,
                message: 'Authorized failed',
                err: err.toString()
            })
        }
        req.user = result;
        next();
    })

}

module.exports = checkToken;