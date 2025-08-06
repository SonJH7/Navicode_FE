import { request } from './client';
//import { dynamicMockData } from './mock'; //임시 데이터 불러오기

export interface CoordTypeResponse {
  type: '1' | '2';
}

export async function getCoordType(navicode: string) {
  const data = await request<CoordTypeResponse>('/location/coord_type', {
    body: { navicode },
  });
  return data.type;
}

export interface StaticCoord {
  latitude: number;
  longitude: number;
  name: string;
}

export async function getCoordStatic(navicode: string) {
  return request<StaticCoord>('/location/get_coord_static', {
    body: { navicode },
  });
}

export interface DynamicCoord {
  latitude: number;
  longitude: number;
  name: string;
}

export async function getCoordDynamic(navicode: string, latitude: string, longitude: string) {
  //임시 데이터 시작
  // if (typeof __DEV__ !== 'undefined' && __DEV__) {
  //   const lat = Number(latitude);
  //   const lng = Number(longitude);
  //   return [...dynamicMockData].sort(
  //     (a, b) =>
  //       getDistance(lat, lng, a.latitude, a.longitude) -
  //       getDistance(lat, lng, b.latitude, b.longitude),
  //   );
  // }
  //임시 데이터 끝 나중에 삭제
  return request<DynamicCoord[]>('/location/get_coord_dynamic', {
    body: { navicode, latitude, longitude },
  });
}

export interface AddCoordLocationRequest {
  name: string;
  latitude: string;
  longitude: string;
  type: '2';
  navicode?: string;
}

export interface AddCoordLocationResponse {
  success: 'true' | 'false';
  message: string;
  navicode?: string;
}

export async function addCoordLocation(payload: AddCoordLocationRequest) {
  return request<AddCoordLocationResponse>('/location/add_coord_location', {
    method: 'POST',
    body: payload,
  });
}
//임시 거리 계산 함수 시작
// function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
//임시 거리 계산 함수 끝
