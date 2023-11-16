const CustomError = require('../errors');
const {isTokenValid} = require('../utils');


const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
  
    if (!token) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }

    try {
      const { name, userId, role } = isTokenValid({ token });
      req.user = { name, userId, role };
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
  };

// const authorizePermissions = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         throw new CustomError.UnauthorizedError('Unauthorized to access this route')
//     }
//     next();
// }

// '...role' - rest operator; roles arg comes from userRoutes.js when invoking authorizePermissions(role1, role2)
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};


module.exports = {
    authenticateUser,
    authorizePermissions,
}