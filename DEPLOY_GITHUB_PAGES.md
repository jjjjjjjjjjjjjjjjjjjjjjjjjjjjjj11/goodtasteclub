# GitHub Pages 5분 배포 가이드

아래 순서대로 하면 `Taste Orbit` 프로토타입을 공개 URL로 바로 테스트할 수 있습니다.

## 0) 준비물

- GitHub 저장소 1개
- 기본 브랜치가 `main`
- 이 저장소에 포함된 워크플로우 파일: `.github/workflows/deploy-pages.yml`

---

## 1) 코드 push

```bash
git add .
git commit -m "Enable GitHub Pages deployment"
git push origin main
```

---

## 2) GitHub Pages 활성화

1. GitHub 저장소로 이동
2. **Settings → Pages**
3. **Build and deployment**에서 Source를 `GitHub Actions`로 선택

> 이미 `Deploy static site to GitHub Pages` 워크플로우가 있으므로, 이후 `main` push마다 자동 배포됩니다.

---

## 3) 배포 상태 확인

1. 저장소의 **Actions** 탭 이동
2. `Deploy static site to GitHub Pages` 실행 확인
3. 모든 job이 초록색(성공)인지 확인

성공 시 배포 URL 형식:

- 프로젝트 저장소: `https://<username>.github.io/<repo>/`
- 유저/오가니제이션 페이지 저장소(`<username>.github.io`): `https://<username>.github.io/`

---

## 4) 실제 기기 테스트(권장 순서)

1. iPhone Safari
2. Android Chrome
3. Desktop Chrome

점검 항목:

- 랜덤 플로팅 노드가 정상적으로 렌더링되는지
- hover/탭 시 말풍선 및 클릭 반응이 자연스러운지
- 콘텐츠 박스 연쇄 탐색(무한 루프)이 끊기지 않는지
- 저사양 기기에서 프레임 드랍이 심하지 않은지

---

## 5) 자주 발생하는 이슈

### Q1. 배포는 성공인데 흰 화면이 보입니다.

- 브라우저 강력 새로고침(Ctrl/Cmd + Shift + R)
- DevTools Console 에러 확인
- 파일 경로가 상대 경로인지 확인(`./styles.css`, `./main.js` 형태 권장)

### Q2. 액션이 실패합니다.

- Settings → Pages에서 Source가 `GitHub Actions`인지 재확인
- 저장소 Actions 권한 제한 여부 확인
- 워크플로우 파일 경로가 정확한지 확인: `.github/workflows/deploy-pages.yml`

### Q3. 이미지 로딩이 느립니다.

- 외부 이미지 CDN 응답 지연일 수 있음
- 데모 단계에서는 이미지 개수 축소 또는 로컬 최적화 이미지로 교체 권장

---

## 6) 운영 팁

- 머지 전에 PR Preview가 필요하면 Vercel/Netlify 병행 추천
- GitHub Pages는 빠른 공개 검증에 적합, API/보안 설정이 필요한 단계에선 별도 백엔드 호스팅 추가
