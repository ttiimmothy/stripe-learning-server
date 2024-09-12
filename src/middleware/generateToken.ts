import jwt from 'jsonwebtoken';
import User from '../user/user.model.extra';
const generateToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    const token = jwt.sign({userId: user._id, role: user.role}, jwtSecretKey, {expiresIn: '1h'});
    return token;
  } catch (error) {
    throw error
  }
}

export default generateToken;