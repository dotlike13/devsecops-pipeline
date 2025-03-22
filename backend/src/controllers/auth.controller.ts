import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

// 회원가입
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // 사용자 이름 중복 확인
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ message: '이미 사용 중인 사용자 이름입니다.' });
      return;
    }

    // 이메일 중복 확인
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
      return;
    }

    // 새 사용자 생성
    const user = await User.create({
      username,
      email,
      password
    });

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
  }
};

// 로그인
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      res.status(401).json({ message: '사용자 이름 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: '사용자 이름 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 토큰 생성
    const token = user.generateAuthToken();

    res.status(200).json({
      message: '로그인 성공',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
};

// 현재 사용자 정보 조회
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: '사용자 정보 조회 중 오류가 발생했습니다.' });
  }
};
