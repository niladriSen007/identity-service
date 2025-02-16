import argon2 from 'argon2';

import { Document, model, Schema, Types } from 'mongoose';
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

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

UserSchema.pre<IUser>('save', async function (next) {
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

export const User = model<IUser>('User', UserSchema);