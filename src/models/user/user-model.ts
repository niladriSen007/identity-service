import argon2 from 'argon2';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await argon2.hash(this.password);
      next();
    }
    catch (error) {
      next(error);
    }
  }
  next();
});


UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    return await argon2.verify(this.password, password);
  }
  catch (error) {
    return false;
  }
};

UserSchema.index({ username: 1, email: 1 });

export const User = model('User', UserSchema);