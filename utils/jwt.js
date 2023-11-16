const jwt = require('jsonwebtoken');
const { token } = require('morgan');


const createJWT = ({payload}) => {
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        },
    )
    return token
}

const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({payload: user});

    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        // set NODE_ENV to use property in dev mode (http)
        secure: process.env.NODE_ENV === 'production',
        // manually add signature in app.js: app.use(cookieParser(process.env.JWT_SECRET));
        signed: true,
    });
}


module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
}