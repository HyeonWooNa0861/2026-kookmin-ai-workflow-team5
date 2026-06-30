# Fear & Greed Index 업데이트

`/update-fear-greed <0~100 숫자>` 형식으로 호출합니다.

인자로 받은 숫자를 기준으로 `src/lib/mockData.ts`의 `fearGreedIndex`를 아래 규칙에 따라 자동 갱신합니다.

## 임계값 → level / label 매핑

| 범위 | level | label |
|---|---|---|
| 0 – 25 | `extreme-fear` | 극도 공포 |
| 26 – 45 | `fear` | 공포 |
| 46 – 55 | `neutral` | 중립 |
| 56 – 75 | `greed` | 탐욕 |
| 76 – 100 | `extreme-greed` | 극도 탐욕 |

## 실행 순서

1. 인자 숫자를 읽어 위 표에서 `level`과 `label`을 결정합니다.
2. `src/lib/mockData.ts`에서 `fearGreedIndex` 객체를 찾아 `value`, `level`, `label`, `updatedAt`(오늘 날짜 YYYY-MM-DD), `description`을 수정합니다.
3. description은 아래 템플릿을 사용합니다:
   - extreme-fear: "시장이 극도 공포 구간입니다. 투매 국면일 수 있어 역발상 매수 기회를 검토할 수 있습니다."
   - fear: "투자자 심리가 위축된 공포 구간입니다. 저가 매수 관점을 고려해볼 수 있습니다."
   - neutral: "투자자 심리가 중립 구간에 있습니다. 시장 방향성을 추가로 확인하세요."
   - greed: "투자자 심리가 탐욕 구간에 진입했습니다. 과열 여부를 함께 확인하세요."
   - extreme-greed: "시장이 극도 탐욕 구간입니다. 조정 가능성이 높으니 리스크 관리에 유의하세요."
4. 수정 후 변경 내용을 한 줄로 요약해 보고합니다.
