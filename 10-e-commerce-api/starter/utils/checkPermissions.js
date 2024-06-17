const { UnauthenticatedError } = require("../errors/index")

// here we are checking if the user is an admin and if they are trying to access a resource meant for them
// we are passing the req.user body with the resource id
const checkPermission = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin') return true;
    if (requestUser.userId === resourceUserId.toString() ) return true;
    
    throw new UnauthenticatedError("You don't have permission to access this route")
}

module.exports = { checkPermission }