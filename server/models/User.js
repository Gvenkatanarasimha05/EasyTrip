import mongoose from '../config/database.js';

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password_hash: { type: String, required: true },
  refresh_token: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema, 'users');

export class User {
  static async create({ fullName, email, passwordHash }) {
    const user = await UserModel.create({
      full_name: fullName,
      email: email.toLowerCase(),
      password_hash: passwordHash
    });
    const obj = user.toObject();
    return { id: obj._id.toString(), ...obj };
  }

  static async findByEmail(email) {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!user) return null;
    return { id: user._id?.toString?.() || String(user._id), ...user };
  }

  static async findById(id) {
    const user = await UserModel.findById(id)
      .select('id _id full_name email created_at')
      .lean();
    if (!user) return null;
    return { id: user._id.toString(), ...user };
  }

  static async updateRefreshToken(userId, refreshToken) {
    await UserModel.updateOne({ _id: userId }, { $set: { refresh_token: refreshToken } });
  }

  // ----------------------
  // New methods for profile
  // ----------------------

  static async updateProfile(userId, updates) {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).lean();
    return user ? { id: user._id.toString(), ...user } : null;
  }

  static async updatePassword(userId, passwordHash) {
    await UserModel.updateOne({ _id: userId }, { $set: { password_hash: passwordHash } });
  }
}
