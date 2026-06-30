# LLM-Wiki

## 프로젝트 목표

`aws-charting`은 미국 주식 초보자가 체계적 위험과 비체계적 위험을 구분해서 볼 수 있도록 만든 발표용 로컬 Next.js 대시보드입니다.

## 주요 요구사항

- 로컬 발표용으로 실행
- 기본값은 mock data이며, FRED 지수 데이터, Alpha Vantage 주가 API, Google News RSS를 서버 라우트에서 조회
- KIS 인증 문제를 피하기 위해 미국 주식 일봉 API는 Alpha Vantage로 변경
- 실시간 WebSocket이 아닌 1분 간격 주기적 조회 방식
- 미국 주식과 FRED `SP500` S&P 500 지수 중심
- 메인 페이지에서 지수 차트, 체계적 위험 뉴스, 종목별 요약 제공
- 종목 상세 페이지를 `/stocks/[symbol]` 별도 라우트로 제공
- 상세 페이지에서 종목 차트, SML, PER, RSI, 개별 뉴스 제공
- LLM-like 추천 UI는 실제 LLM 호출 없이 규칙 기반으로 구현
- API 조회 실패 시 mock data fallback

## Mock Data 구성

- `src/lib/mockData.ts`
- S&P 500 지수 mock 종가 선 그래프 데이터
- 체계적 위험 뉴스 3건
- Apple, Microsoft, NVIDIA, Tesla 종목 데이터
- 각 종목별 가격 OHLC 봉차트 데이터, PER, RSI, SML 지표, 개별 호재/악재 뉴스

## API 연동 구성

- `.env.local`에 Alpha Vantage API 키를 설정
- `src/app/api/market/route.ts`: 메인 페이지용 시장/종목/뉴스 데이터 조회
- `src/app/api/stocks/[symbol]/route.ts`: 종목 상세 데이터 조회
- `src/lib/fredClient.ts`: FRED CSV `SP500` 기반 S&P 500 일별 종가 조회
- `src/lib/alphaVantageClient.ts`: Alpha Vantage `TIME_SERIES_DAILY` 기반 일봉 OHLC 조회
- `src/lib/news.ts`: Google News RSS 조회와 RSS XML 파싱
- `src/lib/marketService.ts`: 실데이터와 mock fallback을 합성
- 클라이언트 컴포넌트는 1분 간격으로 API route를 다시 호출
- FRED S&P 500 종가는 서버 메모리에 30분 캐시
- Alpha Vantage 일봉 OHLC는 서버 메모리에 30분 캐시
- 캐시 만료 후 API 실패 시 마지막 성공 캐시를 재사용
- 캐시가 없고 API도 실패할 때만 mock data fallback
- 메인 페이지의 다중 종목 조회는 1.2초 간격 순차 처리

## 추천 로직 가정

- `src/lib/recommendation.ts`
- 뉴스 감성, PER의 업종 평균 대비 위치, RSI, SML 알파, 위험 점수, 변동성을 점수화
- RSI는 Alpha Vantage 일봉 데이터가 있으면 최신 봉차트 기준으로 재계산
- 점수에 따라 `관심`, `관망`, `주의` 상태를 표시
- 자연어 요약처럼 보이지만 실제 LLM API를 호출하지 않는 데모 분석

## 화면 구조

- `/`: FRED S&P 500 지수 선 그래프와 5일 이동평균선, 시장 공통 뉴스, 종목 카드 목록, `/api/market` 주기 조회
- `/stocks/[symbol]`: 선택 종목 봉차트와 3일 이동평균선, 추천 카드, SML/PER/RSI, 개별 뉴스, `/api/stocks/[symbol]` 주기 조회

## 구현한 기능

- App Router 기반 Next.js 프로젝트 구조
- 반응형 미니멀 대시보드 UI
- SVG 기반 지수 선 그래프 컴포넌트와 5일 이동평균선
- SVG 기반 종목 봉차트 컴포넌트와 3일 이동평균선
- 종목별 상세 라우팅
- 클릭 가능한 뉴스 링크와 `noopener noreferrer` 적용
- 교육용 데모 안내 문구
- API data/mock data 상태 표시
- 수동 새로고침 버튼과 1분 간격 자동 조회

## 실행 방법

```bash
npm install
npm run dev
```

API 키 설정:

```bash
cp .env.example .env.local
```

## 검증 결과

- `npm run lint` 통과
- `npm run build` 통과
- FRED CSV `SP500` 응답 `200` 확인
- 기존 `localhost:3000`의 `/api/market` 응답에서 `indexCode: FRED:SP500`, 지수 포인트 40개 확인

## 남은 개선 사항

- 발표 주제에 맞춘 종목 추가
- mock news 링크를 실제 발표 자료 링크로 교체
- 추천 점수 계산 기준을 발표용 설명 슬라이드와 맞춰 조정
