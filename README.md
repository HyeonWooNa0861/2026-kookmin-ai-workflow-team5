# AWS Charting

미국 주식 초보자를 위한 발표용 로컬 위험 정보 대시보드입니다. 기본값은 mock data이며, API 키를 넣으면 서버 Route Handler가 Alpha Vantage 주가 API와 Google News RSS를 주기적으로 조회합니다.

## 주요 기능

- S&P 500 지수 봉차트, 이동평균선, 시장 공통 위험 뉴스
- 미국 종목 카드와 비체계적 위험 요약
- `/stocks/[symbol]` 종목 상세 라우트
- 종목별 봉차트와 3일 이동평균선
- Alpha Vantage 기반 미국 주식 일봉 OHLC 조회
- Google News RSS 기반 뉴스 조회
- SML, PER, RSI 지표 설명
- mock data 기반 LLM-like 데모 추천
- 클릭 가능한 뉴스 링크

## API 설정

```bash
cp .env.example .env.local
```

`.env.local`에 필요한 값을 채웁니다.

```env
ALPHA_VANTAGE_API_KEY=
```

Alpha Vantage 키가 없거나 조회에 실패하면 기존 mock data가 표시됩니다. Google News RSS는 별도 API 키가 필요 없습니다. 브라우저는 `/api/market`, `/api/stocks/[symbol]`을 5분 간격으로 다시 조회합니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 검증 명령

```bash
npm run lint
npm run build
curl http://localhost:3000/api/market
curl http://localhost:3000/api/stocks/AAPL
```

## 주의

이 프로젝트는 교육과 발표를 위한 데모입니다. 추천 문구는 실제 투자 조언이 아니며, mock data와 규칙 기반 로직으로 생성됩니다.
