import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    try {
        const {token} = req.headers;

        if(!token){
            return res.json({success: false, message:"Not authorized token login again"})
        }

        const token_decode = jwt.decode(token)

        req.clerkid = token_decode.clerkid || token_decode.sub

        next();

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message})
    }
}

export default authUser;