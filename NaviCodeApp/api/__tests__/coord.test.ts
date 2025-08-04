import { getCoordType, getCoordStatic, getCoordDynamic } from '../coord';
import { BASE_URL } from '../client';

describe('coord api', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function mockFetch(response: unknown) {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => response,
    });
  }

  it('코드 타입을 반환한다', async () => {
    mockFetch({ type: '1' });

    await expect(getCoordType('3232')).resolves.toBe('1');
  });

  it('코드 타입 요청을 올바르게 보낸다', async () => {
    mockFetch({ type: '2' });

    await getCoordType('3333');

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/coord_type?navicode=3333`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  it('정적 좌표를 가져온다', async () => {
    mockFetch({ latitude: 1, longitude: 2, name: 'test' });

    await expect(getCoordStatic('3333')).resolves.toEqual({
      latitude: 1,
      longitude: 2,
      name: 'test',
    });
  });

  it('동적 좌표를 가져온다', async () => {
    mockFetch([{ latitude: 1, longitude: 2, name: 'a' }]);

    await expect(getCoordDynamic('3232', '1', '2')).resolves.toEqual([
      { latitude: 1, longitude: 2, name: 'a' },
    ]);
  });
});