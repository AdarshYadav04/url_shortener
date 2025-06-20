export const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const {name, email } = req.user;
  

  res.json({name,email,});
};