var jwt = require("jsonwebtoken");
const User = require('../models/user.model');

const expireTime = process?.env?.EXPIRE_TIME ? process?.env?.EXPIRE_TIME : "1d";
const tokenSecret = process?.env?.SECRET ? process?.env?.JWT_SECRET : "jwt_test_secret";

module.exports = {
    authenticateToken: async (req, res, next) => {
        const authHeader = req.header('x-auth-token');
        const token = authHeader;
        console.log(token);

        if (token == null || token == undefined) return res.status(401).send({ success: false, message: "Unauthorized access" });

        jwt.verify(token, tokenSecret, async (err, result) => {
            console.log("err: ", err, " decrypted data: ", result);
            if (err) return res.status(403).send({ success: false, message: "Something wrong or token expired" });
            // User Info
            let userData = await User.findOne({ _id: result.id });
            if (!userData || !Object.keys(userData).length) {
                return res.status(200).send({ success: false, message: 'User not found' });
            }
            console.log("userData ", userData)
            req.userInfo = userData;
            next();
        });
    }

}