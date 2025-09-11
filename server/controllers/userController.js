import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    if (!fullName) return res.status(400).json({ message: 'Full name is required' });

    const updatedUser = await User.updateProfile(req.user.id, { full_name: fullName });
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: 'Old and new passwords are required' });

    const user = await User.findById(req.user.id);
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Old password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(req.user.id, newHash);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
