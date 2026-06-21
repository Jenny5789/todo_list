# 📋 그룹형 To-Do List 웹앱

> 그룹별 할 일 관리와 메모 기능을 지원하는 로컬 저장 기반 웹 애플리케이션

![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 📌 소개

할 일을 **그룹별로 체계적으로 관리**하고, **상세한 메모를 추가**할 수 있는 웹앱입니다.  

---

## 📷 실행 화면

| 홈 화면 (빈 상태) | 전체 보기 |
|-----------|-----------|
| ![home](home.png) | ![all](all.png) |

| 예정 필터 | 완성 필터 |
|-----------|-----------|
| ![will](will.png) | ![done](done.png) |

---

## ✨ 주요 기능

- 📂 **그룹 기반 관리** — 여러 카테고리로 할 일 분류
- 💾 **자동 로컬 저장** — 브라우저 저장소를 통한 영구 데이터 보존
- 📝 **메모 기능** — 각 할 일에 상세 메모 작성 및 수정
- 🎨 **테마 커스터마이징** — 6가지 색상 테마로 그룹 구분
- 🔍 **상태 필터링** — 예정 / 진행중 / 완성 상태별 조회
- 📅 **날짜 관리** — 생성일 및 마감일 기록
- 🖱️ **인라인 편집** — 클릭으로 바로 수정 가능

---

## 🎨 색상 테마

| 테마 | 코드 | 
|------|------|
| 🔴 빨강 | `theme-red` | 
| 🟠 주황 | `theme-default` | 
| 🟡 노랑 | `theme-yellow` |
| 🟢 초록 | `theme-green` |
| 🔵 파랑 | `theme-blue` |
| 🟣 보라 | `theme-purple` |

---

## 🚀 사용 방법

### 1. 실행
```bash
# index.html을 브라우저로 열기
```

### 2. 그룹 및 할 일 추가

**새 그룹 생성**
```
1. "✍️ 새 그룹 직접 입력하기" 선택
2. 그룹명 입력
3. 색상 선택
4. 할 일 입력 후 [할 일 등록] 또는 Enter
```

**기본 목록에 추가**
```
1. "📁 그룹 미지정" 선택
2. 할 일 입력 후 [할 일 등록] 또는 Enter
```

### 3. 할 일 관리

| 작업 | 방법 |
|------|------|
| 텍스트 수정 | 할 일 텍스트 클릭 → 수정 후 Enter |
| 마감일 설정 | 마감일 클릭 → 날짜 선택 |
| 상태 변경 | [예정/진행중/완성] 드롭다운 선택 |
| 메모 추가 | [+ 📝 추가] → 입력 → [저장] |
| 메모 수정 | [수정] → 입력 → [저장] |
| 삭제 | [🗑️] 버튼 클릭 |

### 4. 필터링
```
상단 탭에서 상태 선택:
- 전체 보기
- 예정
- 진행중
- 완성
```

---

## 🗂️ 파일 구조

```
├── index.html       # HTML 구조
├── style.css        # 스타일 (6가지 색상 테마)
├── script.js        # 전체 기능 로직
├── README.md        # 프로젝트 문서
└── images/
    ├── home.png     # 홈 화면
    ├── all.png      # 전체 보기 
    ├── will.png     # 예정 필터 
    └── done.png     # 완성 필터
```

---

## 🛠️ 기술 스택

- **Language** — HTML5, CSS3, Vanilla JavaScript
- **Storage** — Browser localStorage API
- **Design** — Responsive CSS (Flexbox)

---

## 💻 브라우저 호환성

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

## 📝 라이선스

MIT License

---

## 👩‍💻 개발자
- GitHub: [@Jenny5789](https://github.com/Jenny5789)
