import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            throw new apiError(401, "No refresh token provided");
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new apiError(401, "Invalid refresh token");
        }

        const newAccessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        cosole.log(newAccessToken);
        res.json({ accessToken: newAccessToken });
        return newAccessToken;
    } catch (error) {
        next(error);
    }
};