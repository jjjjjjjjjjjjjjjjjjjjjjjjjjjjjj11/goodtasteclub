# Taste Orbit Prototype

새로운 쇼핑 경험(랜덤 3D 플로팅 오브젝트 + 연관 콘텐츠 무한 탐색)을 빠르게 검증하기 위한 프론트엔드 프로토타입입니다.

## 실행 방법

```bash
python3 -m http.server 4173
# 브라우저에서 http://localhost:4173
```

> 별도 빌드 도구 없이 정적 파일로 동작합니다.
> GitHub Pages로 5분 내 배포하려면 `DEPLOY_GITHUB_PAGES.md`를 참고하세요.

## 실제 웹에서 테스트하는 방법

아래 3가지 중 하나를 선택하면 됩니다.

### 방법 A) 같은 와이파이/사내망에서 모바일 테스트

1. PC에서 서버 실행
   ```bash
   python3 -m http.server 4173 --bind 0.0.0.0
   ```
2. PC의 로컬 IP 확인
   ```bash
   hostname -I
   ```
3. 모바일 브라우저에서 접속  
   `http://<PC_IP>:4173`  
   예: `http://192.168.0.23:4173`

### 방법 B) 외부 인터넷에서 바로 공유(터널링)

1. 로컬 서버 실행
   ```bash
   python3 -m http.server 4173 --bind 0.0.0.0
   ```
2. ngrok 또는 Cloudflare Tunnel 중 하나 실행
   ```bash
   # ngrok 예시
   ngrok http 4173
   ```
3. 발급된 `https://...` URL을 팀원과 공유해서 실기기 테스트

### 방법 C) 무료 정적 호스팅으로 배포(권장)

`index.html`, `styles.css`, `main.js`만 있으면 바로 배포됩니다.

1. GitHub에 코드 푸시
2. Vercel / Netlify / GitHub Pages 중 하나 연결
3. 자동 발급된 도메인에서 접속해 테스트

#### GitHub Pages 빠른 예시

1. 저장소 설정 → **Pages**
2. Source: `Deploy from branch`
3. Branch: `main` + `/ (root)` 선택
4. 몇 분 후 `https://<username>.github.io/<repo>/` 접속

### 체크리스트(실테스트 시)

- Safari(iOS), Chrome(Android), Desktop Chrome 3개 환경 확인
- 3D 이동 시 프레임 드랍(저사양 모바일) 확인
- 탭/클릭 시 콘텐츠 박스 생성 지연 시간 확인
- 외부 이미지 차단/로딩 실패 시 대체 UI 필요 여부 확인

---

## 현재 구현 범위

- 메인 스테이지에 상품/사람 이미지가 랜덤 위치(x/y/z)로 떠다님
- 호버/포커스 시 에디터 한줄평 말풍선 노출
- 클릭 시 해당 카드가 중앙으로 확대 이동
- 주변에 흰색 입체 박스(콘텐츠 카드) 다수 생성
- 콘텐츠 카드를 다시 클릭하면 해당 콘텐츠를 중심으로 새로운 박스 재생성(무한 탐색 구조)
- 콘텐츠 요약은 현재 `pseudoSummary`로 데모 처리

---

## Gemini/GPT 연동을 포함한 단계별 실행 계획

### 1) 경험 설계(UX) 확정
1. 탐색 단위 정의: `노드(상품/인물)` vs `콘텐츠 박스`.
2. 깊이 규칙 정의: 클릭할수록 깊이 증가, 이전 경로 breadcrumb 유지 여부 확정.
3. 성과지표 정의: 체류시간, 클릭 심도(depth), 저장/구매 전환율.

### 2) 데이터 모델 설계
1. `Entity` 스키마
   - id, type(product/human/content), title, image, description, tags
2. `Edge` 스키마
   - sourceId, targetId, relationType(compare/review/interview/history/styling)
3. `Context` 스키마
   - 국가/언어/가격대/관부가세/환율/플랫폼(국내몰, 직구몰)

### 3) AI 요약 파이프라인 구축
1. 입력 수집: 크롤링/제휴 API/수기 큐레이션 feed.
2. 정제: 중복 제거, 신뢰도 점수화, 원문 출처 저장.
3. LLM 호출
   - Gemini or GPT로 `요약 + 관점 태깅(가격/디자인/내구성/역사)` 생성
4. 캐싱
   - 콘텐츠별 summary를 Redis/DB에 TTL 캐시
5. 품질관리
   - 금칙어 필터, 근거 없는 과장 문구 차단, 출처 링크 표시

### 4) 백엔드 API 설계
1. `GET /api/nodes?seed=...`
   - 최초 랜덤 노드 반환
2. `GET /api/node/:id/related`
   - 연관 콘텐츠 카드 목록 반환
3. `POST /api/summarize`
   - 원문+메타데이터 받아 실시간 요약
4. `GET /api/price-check/:productId`
   - 관부가세/배송비 포함 총액 계산

### 5) 프론트엔드 고도화
1. 렌더링 최적화: DOM → WebGL(Three.js, react-three-fiber) 전환 검토
2. 물리감 강화: spring 애니메이션(framework: Framer Motion / GSAP)
3. 시각적 계층화: active, related, history 노드별 광원/블러 차등
4. 접근성: 키보드 탐색, reduced-motion 대응, 대비비율 점검

### 6) 콘텐츠 확장 로직
1. 사용자가 콘텐츠 클릭 시
   - 해당 콘텐츠를 새로운 중심 노드로 승격
   - `related` API로 다음 레벨 카드 로딩
2. 그래프 탐색 제어
   - 무한 확장하되 유사 콘텐츠 반복 노출 제한
   - novelty score(새로움 점수) 기반 재정렬

### 7) 상거래 연결(구매 전환)
1. 상품 상세 패널: 가격, 재고, 배송예상, 세금 포함 최종가
2. 구매 루트 비교: 국내몰 vs 직구몰 vs 중고마켓
3. CTA 실험: “바로 구매” vs “가격 알림” vs “큐레이터 추천 받기”

### 8) 운영/신뢰성
1. 로그/관측성: 클릭 그래프, 오류율, 요약 실패율
2. 비용 제어: LLM 토큰 사용량 모니터링 및 fallback summary
3. 법무/정책: 크롤링 정책 준수, 출처 명시, 사용자 후기 활용 동의

### 9) 출시 전략
1. Closed Beta(카테고리 1~2개: 시계/패션)
2. A/B 테스트: 랜덤 밀도, 카드 개수, 요약 길이
3. 지표 기반 반복: 2주 단위 스프린트 개선

---

## 실제 적용 시 추천 기술 스택

- Frontend: Next.js + react-three-fiber + Framer Motion
- Backend: FastAPI or NestJS
- AI: GPT/Gemini 이중화 + 캐시 계층
- Storage: Postgres(그래프 메타), Redis(요약 캐시), Object Storage(이미지)
- Observability: OpenTelemetry + Grafana
