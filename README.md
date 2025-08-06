# 📱 NaviCode App - 숫자 코드 기반 위치 검색 앱 (React Native)

NaviCode는 주소나 장소명을 입력하지 않아도,  
**숫자 코드만 입력해서 장소를 검색하고, 길찾기까지 연결할 수 있는 모바일 앱**입니다.  
초성검색·음성검색처럼 **검색 방법을 다양화하는 부가 서비스**로써,  
숫자 기반 검색 방식을 제안합니다.

---

## 🎯 주요 기능

- 🔢 **숫자 코드 입력으로 위치 검색**
  - 정적 코드: 하나의 고정된 위치 반환
  - 동적 코드: GPS 기준으로 가까운 장소 여러 개 추천
- 📍 **현재 위치 정보 기반 동작 분기**
- 🗺 **외부 지도 앱(네이버, 카카오, 티맵 등) 연동 길찾기**
- ✨ **간단하고 직관적인 UI**
- ❌ 잘못된 코드 입력 시 오류 안내

---

## 📱 앱 화면 구성

| 화면 | 기능 |
|------|------|
| 홈 화면 | 숫자 코드 입력 UI, 위치 권한 요청 |
| 결과 화면 (정적) | 단일 장소 정보 표시 + 길찾기 버튼 |
| 결과 화면 (동적) | 장소 리스트 거리순 표시 + 각 장소에 길찾기 버튼 |
| 오류 화면 | 코드가 없거나, 위치 권한 거부 시 안내 표시 |

---

## 🛠 사용 기술

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (개발 및 테스트 간편화)
- [TypeScript](https://www.typescriptlang.org/) (정적 타입 이용)
- [`axios`](https://www.npmjs.com/package/axios) – 백엔드 API 호출
- [`expo-location`](https://docs.expo.dev/versions/latest/sdk/location/) – GPS 정보 접근
- [`react-navigation`](https://reactnavigation.org/) – 화면 간 이동

---

## 🚀 앱 실행 방법

### ✅ 1. 프로젝트 클론 및 의존성 설치

```bash

npx create-expo-app NaviCodeApp
cd NaviCodeApp
npm install
```

### ✅ 2. Expo 실행

```bash
npx expo start
```

### ✅ 3. Test 실행 및 코드 스타일 정리

```bash
npm test
npm run format
```

- Android: Expo Go 앱 설치 후 QR코드 스캔
- iOS: 동일하게 Expo Go 앱에서 실행
