import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// 사용자 등록
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 사용자 이름 중복 확인
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: '이미 사용 중인 사용자 이름입니다.' });
    }

    // 이메일 중복 확인
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
    }

    // 새 사용자 생성
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

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
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ message: '사용자 이름 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '사용자 이름 또는 비밀번호가 올바르지 않습니다.' });
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
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
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
