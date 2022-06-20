const jwt = require('jsonwebtoken');
const User = require('../models/userModel')


exports.protect = async (req, res, next) => {
    try {
        let token;
        const { authorization } = req.headers;
        
        if(authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];

        } else {
            res.status(401).json({
                status: 'Authentication failed!',
                error: e.message
            })
        };

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
        
    } catch (error) {
        res.status(401).json({
            status: 'Authentication failed!',
            error
        })
    }
}