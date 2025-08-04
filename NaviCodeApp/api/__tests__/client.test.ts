import { request, BASE_URL } from '../client';

describe('api client', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('기본적으로 GET 요청을 보낸다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ ok: true }),
    });

    await request('/test', { body: { a: 1 } });

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/test?a=1`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });
});