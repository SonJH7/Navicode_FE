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


## 📦 내부 테스트 배포 (EAS Update)

이 앱은 **Expo EAS Update**를 활용해 빠르게 내부 테스트 배포를 진행합니다.  
조직(`Navicode`) 멤버로 초대받으면, 앱스토어에 올리지 않고도 최신 버전을 바로 실행해볼 수 있습니다.

## 📝 개발 히스토리 – 개인 계정 → 조직(Navicode) 이전

초기 개발은 **개인 계정(`huny777`)**에서 시작했으나,  
협업과 빌드/배포 권한 공유를 위해 **Navicode 조직**으로 이전했습니다.

### 📌 이전 과정
1. **Expo 웹 대시보드 접속**  
   - [https://expo.dev](https://expo.dev) 로그인  
   - 개인 계정의 `NaviCodeApp` 프로젝트 페이지로 이동
2. **프로젝트 Transfer 실행**  
   - `Settings` → `Transfer Project` 선택  
   - 대상 조직으로 **`Navicode`** 지정 후 이전 완료
3. **`app.json` 수정**
   ```json
   "owner": "Navicode"

### 1. 조직 멤버 초대 수락
- 초대 이메일을 확인 후 **Accept Invitation** 클릭
- Expo 계정에 로그인(없으면 회원가입)
- 초대 수락 후 `Navicode` 조직의 Developer 권한 획득

### 2. 앱 실행 방법
1. **Expo Go** 앱 설치  
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)  
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
2. 초대한 사람이 제공한 **QR 코드** 또는 **Update 링크** 열기
3. Expo Go에서 최신 앱 버전 자동 로드

## 📤 정식 배포 (선택)
테스트를 마친 후, `eas build`로 APK/IPA를 생성하여  
Google Play 또는 Apple App Store에 업로드하면 모든 사용자가 설치할 수 있습니다.