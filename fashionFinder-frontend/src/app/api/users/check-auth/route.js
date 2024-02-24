import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    try {
      // Verify token
      jwt.verify(token, 'capstoneproj');

      // Token is valid
      return res.status(200).json({ isValid: true });
    } catch (error) {
      // Token is invalid or expired
      return res.status(401).json({ isValid: false });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
