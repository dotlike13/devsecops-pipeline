import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, '사용자 이름은 필수입니다.'],
    unique: true,
    trim: true,
    minlength: [3, '사용자 이름은 최소 3자 이상이어야 합니다.'],
    maxlength: [20, '사용자 이름은 최대 20자까지 가능합니다.']
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      '유효한 이메일 주소를 입력해주세요.'
    ]
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다.'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 비밀번호 해싱 미들웨어
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 비밀번호 비교 메서드
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// JWT 토큰 생성 메서드
UserSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { id: this._id, username: this.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

export default mongoose.model<IUser>('User', UserSchema);
