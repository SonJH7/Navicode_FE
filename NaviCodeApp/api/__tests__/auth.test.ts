import { loginApi, registerApi } from '../auth';

describe('loginApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('로그인이 성공하면 토큰을 반환한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        success: true,
        token: 'token123',
        message: '로그인 성공',
      }),
    });

    await expect(loginApi('user', 'pass')).resolves.toEqual({
      token: 'token123',
    });
  });

  it('로그인이 실패하면 에러를 발생시킨다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        success: false,
        token: null,
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      }),
    });

    await expect(loginApi('user', 'wrong')).rejects.toThrow(
      '아이디 또는 비밀번호가 올바르지 않습니다.',
    );
  });

  it('올바른 URL과 옵션으로 fetch를 호출한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        success: true,
        token: 'token123',
        message: '로그인 성공',
      }),
    });

    await loginApi('user', 'pass');

    expect(global.fetch).toHaveBeenCalledWith('http://222.122.81.141:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user', password: 'pass' }),
    });
  });
});

describe('registerApi', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('올바른 URL과 옵션으로 fetch를 호출한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        success: true,
        token: 'token123',
        message: '회원가입 성공',
      }),
    });

    await registerApi('newuser', 'pass');

    expect(global.fetch).toHaveBeenCalledWith('http://222.122.81.141:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'newuser', password: 'pass' }),
    });
  });
});
