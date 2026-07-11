import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRE = "1d";
const REFRESH_TOKEN_EXPIRE = "7d";

// Generate Access Token
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRE,
        }
    );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRE,
        }
    );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
};