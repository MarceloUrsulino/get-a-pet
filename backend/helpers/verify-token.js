const jwt = require('jsonwebtoken')

const getToken = require('./get-token')


//validação de token - middleware
const checkToken = (req,res, next) =>{
    console.log('Header recebido:', req.headers.authorization)

    if(!req.headers.authorization){
        return res.status(401).json({ message: 'Acesso negado.'})
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({ message: 'Acesso negado.'})
    }
    try {
        const verified = jwt.verify(token,  process.env.JWT_SECRET)
        req.user = verified
        next()

    } catch (err) {
        return res.status(400).json({ message: 'Token iválido.'})
    }
}

module.exports = checkToken