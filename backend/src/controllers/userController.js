import CryptoJS from "crypto-js";
import { sanitizeError } from "../utils/sanitizeLog.js";

export const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const {name, email } = req.user;
  

  res.json({name,email,});
};

export const updateUserPassword = async(req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old password and new password are required' });
  }
  try{

    const user = req.user;
    const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== oldPassword) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    user.password = CryptoJS.AES.encrypt(newPassword, process.env.PASSWORD_SECRET_KEY).toString();
    await user.save();
    res.status(200).json({ success: true,message: 'Password updated successfully' });

  } catch (error) {
    // Sanitize error to prevent password leakage in logs
    console.error('Password update error:', sanitizeError(error));
    res.status(500).json({ success: false, message: 'Error in updating password' });
  }
  
};