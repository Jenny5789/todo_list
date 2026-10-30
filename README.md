# 그룹형 To-Do List

그룹별 할 일 관리와 메모 기능을 지원하는 로컬 저장 기반 웹 애플리케이션. 할 일을 그룹으로 나눠 관리하고, 각 할 일에 메모를 추가.

![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 기술 스택

| 구분 | 기술 | 용도 |
|---|---|---|
| 언어 | HTML5, CSS3, JavaScript (Vanilla) | 구조, 스타일, 기능 로직 |
| 브라우저 API | localStorage | 데이터 저장 |

## 구현 역량

관련 이론은 [파이썬 기초 역량 정리](https://github.com/Jenny5789/python/tree/main/study_archive) 참조.

| 역량 | 구현 내용 | 코드 | 이론 |
|---|---|---|---|
| 데이터 CRUD | 그룹, 할 일, 메모의 추가, 수정, 삭제<br>할 일 텍스트, 마감일, 그룹명은 클릭하면 입력창으로 바뀌는 인라인 수정 | [핵심 코드](#핵심-코드) | [줄 편집기 insert, delete, replace](https://github.com/Jenny5789/python/blob/main/study_archive/data_structures/02_line_editor.py) |
| 로컬 영속성 | 그룹과 할 일 데이터를 JSON 문자열로 변환해 localStorage에 저장하고 시작 시 로드 | [핵심 코드](#핵심-코드) | [줄 편집기 save, load](https://github.com/Jenny5789/python/blob/main/study_archive/data_structures/02_line_editor.py) |
| 데이터 구조 | 그룹별 객체에 할 일 배열과 테마를 담고, id로 find, filter 조회 | [script.js](script.js) | [자료형(list, dict)](https://github.com/Jenny5789/python/blob/main/study_archive/theory/03_data_types.md) |
| 렌더링과 필터 | 데이터 변경 시 전체 그룹을 다시 렌더링<br>상태 필터(전체, 예정, 진행중, 완성)는 클래스로 숨김 처리<br>입력 텍스트는 escapeHtml로 이스케이프 | [script.js](script.js) | [흐름 제어](https://github.com/Jenny5789/python/blob/main/study_archive/theory/07_flow_control.md) |

## 핵심 코드

### 할 일 CRUD

[script.js](script.js)

```javascript
// 추가 (라인편집기 insert)
const newTodo = {
    id: Date.now(),
    text: todoText,
    status: 'todo',
    dueDate: dateInput.value || null,
    createdDate: new Date().toISOString().split('T')[0],
    memo: ''
};
allTodos[groupName].todos.push(newTodo);

// 수정 (라인편집기 replace)
const todo = allTodos[groupName].todos.find(t => t.id === todoId);
todo.text = newText;

// 삭제 (라인편집기 delete)
allTodos[groupName].todos = allTodos[groupName].todos.filter(t => t.id !== todoId);

// 모든 변경 뒤 저장하고 다시 그림
saveAllData();
renderAllGroups();
```

- 할 일은 id, 텍스트, 상태, 마감일, 생성일, 메모를 가진 객체로 관리
- 수정과 삭제는 id로 대상을 찾아 처리
- 변경마다 저장과 전체 렌더링을 호출해 화면과 데이터를 일치시킴

### localStorage 저장과 불러오기

[script.js](script.js)

```javascript
function saveAllData() {
    const dataToSave = { todos: allTodos, groups: allGroups };
    localStorage.setItem('todoAppData', JSON.stringify(dataToSave));
}

function loadAllData() {
    const savedData = localStorage.getItem('todoAppData');
    if (savedData) {
        const data = JSON.parse(savedData);
        allTodos = data.todos || {};
        allGroups = data.groups || Object.keys(allTodos);
    }
    // (try-catch와 로그 출력은 생략)
}
```

- 그룹 객체와 그룹 순서 배열을 하나의 JSON 문자열로 저장
- 페이지 로드 시 저장된 데이터를 복원

## 주요 기능

| 기능 | 설명 |
|---|---|
| 그룹 관리 | 새 그룹 직접 입력 또는 그룹 미지정 목록 사용<br>그룹명 수정, 그룹 삭제, 6가지 색상 테마 |
| 할 일 관리 | 할 일 추가, 텍스트와 마감일 인라인 수정, 삭제<br>상태(예정, 진행중, 완성) 변경 |
| 메모 | 할 일마다 메모 추가, 수정, 삭제 |
| 상태 필터 | 전체, 예정, 진행중, 완성 탭으로 조회 |
| 자동 저장 | 변경할 때마다 브라우저에 저장 |

<img src="images/all.png" width="48%" alt="전체 보기">
<img src="images/home.png" width="48%" alt="홈 화면">

<details>
<summary>전체 화면 보기</summary>

<img src="images/will.png" width="600" alt="예정 필터">
<img src="images/done.png" width="600" alt="완성 필터">

</details>

## 파일 구조

```
todo_list/
├── index.html    # HTML 구조
├── style.css     # 스타일 (6가지 색상 테마)
├── script.js     # 전체 기능 로직
└── images/       # README 스크린샷
```

## 실행 방법

`index.html`을 브라우저로 열기.