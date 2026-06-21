
let allTodos = {};
let currentFilter = 'all';
let allGroups = [];

// 페이지 로드 시 초기화

document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 완료');
    
    loadAllData();
    renderAllGroups();
    applyCurrentFilter();
    setupTopFormListeners();
});

// 상단 폼 이벤트 리스너 설정

function setupTopFormListeners() {
    console.log('이벤트 리스너 설정 시작');
    
    const topTodoInput = document.getElementById('topTodoInput');
    const topTodoDate = document.getElementById('topTodoDate');
    const submitBtn = document.querySelector('.group-todo-adder-top button');
    
    // → 할 일 입력창 엔터키
    if (topTodoInput) {
        topTodoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('할 일 입력창 엔터키 감지');
                e.preventDefault();
                submitTopForm();
            }
        });
    }
    
    // → 날짜 입력창 엔터키
    if (topTodoDate) {
        topTodoDate.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('날짜 입력창 엔터키 감지');
                e.preventDefault();
                submitTopForm();
            }
        });
    }
    
    // → 버튼 클릭 (onclick도 있지만 이중 확인)
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            console.log('버튼 클릭 감지');
            e.preventDefault();
            submitTopForm();
        });
    }
    
    console.log('이벤트 리스너 설정 완료');
}

// 그룹 입력 모드 토글

function toggleGroupInputMode(value) {
    console.log('그룹 입력 모드:', value);
    
    const groupNameInput = document.getElementById('newGroupNameInput');
    const colorSelect = document.getElementById('groupColorSelect');
    
    if (!groupNameInput || !colorSelect) {
        console.error('입력 요소를 찾을 수 없습니다');
        return;
    }
    
    if (value === 'write_direct') {
        groupNameInput.disabled = false;
        colorSelect.disabled = false;
        groupNameInput.focus();
    } else {
        groupNameInput.disabled = true;
        groupNameInput.value = '';
        colorSelect.disabled = true;
    }
}

// 상단 폼 제출 (버튼 클릭 또는 엔터키)

function submitTopForm() {
    console.log('=== 할 일 등록 시작 ===');
    
    try {
        // → 필요한 요소 가져오기
        const historySelect = document.getElementById('groupHistorySelect');
        const groupNameInput = document.getElementById('newGroupNameInput');
        const colorSelect = document.getElementById('groupColorSelect');
        const todoInput = document.getElementById('topTodoInput');
        const todoDate = document.getElementById('topTodoDate');
        
        console.log('요소 확인:', {
            historySelect: !!historySelect,
            groupNameInput: !!groupNameInput,
            colorSelect: !!colorSelect,
            todoInput: !!todoInput,
            todoDate: !!todoDate
        });
        
        if (!historySelect || !todoInput) {
            throw new Error('필수 입력 요소를 찾을 수 없습니다');
        }
        
        // → 그룹명 결정
        let groupName = '';
        const selectValue = historySelect.value;
        console.log('선택된 그룹 옵션:', selectValue);
        
        if (selectValue === 'write_direct') {
            groupName = groupNameInput.value.trim();
            console.log('직접 입력 그룹명:', groupName);
            
            if (!groupName) {
                alert('그룹명을 입력해주세요!');
                groupNameInput.focus();
                return;
            }
        } else if (selectValue === 'none_assigned') {
            groupName = 'none_assigned';
            console.log('기본 그룹 선택');
        } else {
            throw new Error('알 수 없는 그룹 옵션: ' + selectValue);
        }
        
        // → 할 일 텍스트 확인
        const todoText = todoInput.value.trim();
        console.log('할 일 텍스트:', todoText);
        
        if (!todoText) {
            alert('할 일을 입력해주세요!');
            todoInput.focus();
            return;
        }
        
        // → 테마 색상
        const themeClass = colorSelect ? colorSelect.value : 'theme-default';
        console.log('선택된 테마:', themeClass);
        
        // → 그룹 생성 또는 업데이트
        if (!allTodos[groupName]) {
            console.log('새 그룹 생성:', groupName);
            allTodos[groupName] = {
                todos: [],
                theme: themeClass
            };
            allGroups.push(groupName);
        } else {
            console.log('기존 그룹 테마 업데이트:', groupName);
            allTodos[groupName].theme = themeClass;
        }
        
        // → 새 할 일 객체 생성
        const newTodo = {
            id: Date.now(),
            text: todoText,
            status: 'todo',
            dueDate: (todoDate && todoDate.value) ? todoDate.value : null,
            createdDate: new Date().toISOString().split('T')[0],
            memo: ''
        };
        
        console.log('새 할 일:', newTodo);
        
        // → 할 일 추가
        allTodos[groupName].todos.push(newTodo);
        console.log('할 일 추가 완료, 현재 그룹 할 일 수:', allTodos[groupName].todos.length);
        
        // → 저장
        saveAllData();
        console.log('데이터 저장 완료');
        
        // → 화면 업데이트
        renderAllGroups();
        applyCurrentFilter();
        console.log('화면 렌더링 완료');
        
        // → 입력 필드 초기화
        groupNameInput.value = '';
        todoInput.value = '';
        if (todoDate) todoDate.value = '';
        historySelect.value = 'write_direct';
        toggleGroupInputMode('write_direct');
        
        // → 포커스 이동
        todoInput.focus();
        
        console.log('=== 할 일 등록 완료 ===');
        
    } catch (error) {
        console.error('에러 발생:', error);
        console.error('에러 스택:', error.stack);
        alert('등록 중 오류가 발생했습니다: ' + error.message);
    }
}

// 할 일 아이템 HTML 생성

function appendTodoItem(groupName, todoData) {
    const safeText = escapeHtml(todoData.text);
    const safeMemo = escapeHtml(todoData.memo);
    
    // → 메모 섹션 HTML
    let memoContent = '';
    if (todoData.memo) {
        memoContent = `
            <span class="memo-label">📝 메모</span>
            <p class="todo-memo-text">${safeMemo}</p>
            <button class="memo-edit-btn" onclick="enableEditMemo(this, '${groupName}', ${todoData.id})">수정</button>
        `;
    } else {
        memoContent = `<button class="memo-add-btn" onclick="enableEditMemo(this, '${groupName}', ${todoData.id})">+ 📝 추가</button>`;
    }
    
    return `
        <li class="todo-item status-${todoData.status}">
            <div class="todo-header">
                <div class="todo-content">
                    <span class="todo-text" onclick="enableEditTodoText(this, '${groupName}', ${todoData.id})">${safeText}</span>
                    <div class="todo-date-info">
                        <span>생성일: ${todoData.createdDate}</span>
                        ${todoData.dueDate ? `<span>| 마감일: <span class="todo-duedate-clickable" onclick="enableEditDueDate(this, '${groupName}', ${todoData.id})">${todoData.dueDate}</span></span>` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <select class="status-select" onchange="updateStatus(this, '${groupName}', ${todoData.id})">
                        <option value="todo" ${todoData.status === 'todo' ? 'selected' : ''}>예정</option>
                        <option value="doing" ${todoData.status === 'doing' ? 'selected' : ''}>진행중</option>
                        <option value="done" ${todoData.status === 'done' ? 'selected' : ''}>완성</option>
                    </select>
                    <button class="delete-todo-btn" onclick="deleteTodo('${groupName}', ${todoData.id})">🗑️</button>
                </div>
            </div>
            <div class="todo-memo-section">
                ${memoContent}
            </div>
        </li>
    `;
}

// 모든 그룹 렌더링

function renderAllGroups() {
    console.log('그룹 렌더링 시작');
    
    const container = document.getElementById('mainContainer');
    if (!container) {
        console.error('mainContainer를 찾을 수 없습니다');
        return;
    }
    
    // → 데이터 없으면 안내 메시지
    if (Object.keys(allTodos).length === 0) {
        container.innerHTML = '<div class="empty-notice">아직 등록된 목록이 없습니다. 상단에서 할 일을 입력해보세요!</div>';
        console.log('데이터 없음');
        return;
    }
    
    let html = '';
    
    allGroups.forEach(groupName => {
        const groupData = allTodos[groupName];
        if (!groupData) return;
        
        const themeClass = groupData.theme || 'theme-default';
        const displayGroupName = groupName === 'none_assigned' ? '📁 그룹 미지정' : escapeHtml(groupName);
        
        // → 그룹 헤더
        let groupHtml = `
            <div class="todo-group ${themeClass}">
                <div class="group-header">
                    <h2 class="group-title" onclick="enableEditGroupName(this, '${groupName}')">${displayGroupName}</h2>
                    <div class="group-controls">
                        <select class="theme-select" onchange="changeGroupTheme(this, '${groupName}')">
                            <option value="theme-red" ${themeClass === 'theme-red' ? 'selected' : ''}>🔴 빨강</option>
                            <option value="theme-default" ${themeClass === 'theme-default' ? 'selected' : ''}>🟠 주황</option>
                            <option value="theme-yellow" ${themeClass === 'theme-yellow' ? 'selected' : ''}>🟡 노랑</option>
                            <option value="theme-green" ${themeClass === 'theme-green' ? 'selected' : ''}>🟢 초록</option>
                            <option value="theme-blue" ${themeClass === 'theme-blue' ? 'selected' : ''}>🔵 파랑</option>
                            <option value="theme-purple" ${themeClass === 'theme-purple' ? 'selected' : ''}>🟣 보라</option>
                        </select>
                        ${groupName !== 'none_assigned' ? `<button class="delete-group-btn" onclick="deleteGroup('${groupName}')">그룹 삭제</button>` : ''}
                    </div>
                </div>
        `;
        
        // → 할 일 목록
        const todoList = (groupData.todos || []).map(todo => appendTodoItem(groupName, todo)).join('');
        
        groupHtml += `
                <ul class="todo-list">
                    ${todoList}
                </ul>
                <div class="group-todo-adder">
                    <input type="date" class="group-todo-date" data-group="${groupName}">
                    <input type="text" class="group-todo-input" data-group="${groupName}" placeholder="이 그룹에 할 일 추가">
                    <button onclick="addTodoToGroup('${groupName}')">추가</button>
                </div>
            </div>
        `;
        
        html += groupHtml;
    });
    
    container.innerHTML = html;
    
    // → 그룹 입력창 엔터키
    document.querySelectorAll('.group-todo-input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const groupName = this.dataset.group;
                addTodoToGroup(groupName);
            }
        });
    });
    
    console.log('그룹 렌더링 완료');
}

// 그룹별 할 일 추가

function addTodoToGroup(groupName) {
    const input = document.querySelector(`.group-todo-input[data-group="${groupName}"]`);
    const dateInput = document.querySelector(`.group-todo-date[data-group="${groupName}"]`);
    
    const todoText = input.value.trim();
    if (!todoText) {
        alert('할 일을 입력하세요!');
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: todoText,
        status: 'todo',
        dueDate: dateInput.value || null,
        createdDate: new Date().toISOString().split('T')[0],
        memo: ''
    };
    
    allTodos[groupName].todos.push(newTodo);
    saveAllData();
    renderAllGroups();
    applyCurrentFilter();
    
    input.value = '';
    dateInput.value = '';
}

// 그룹명 수정

function enableEditGroupName(element, groupName) {
    if (groupName === 'none_assigned') return;
    
    const currentName = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-group-input';
    input.value = currentName;
    
    element.replaceWith(input);
    input.focus();
    input.select();
    
    function saveGroupName() {
        const newName = input.value.trim();
        if (newName && newName !== currentName) {
            allTodos[newName] = allTodos[groupName];
            delete allTodos[groupName];
            
            const index = allGroups.indexOf(groupName);
            if (index > -1) allGroups[index] = newName;
            
            saveAllData();
        }
        renderAllGroups();
        applyCurrentFilter();
    }
    
    input.addEventListener('blur', saveGroupName);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') saveGroupName();
    });
}

// 할 일 텍스트 수정

function enableEditTodoText(element, groupName, todoId) {
    const currentText = element.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-todo-input';
    input.value = currentText;
    
    element.replaceWith(input);
    input.focus();
    input.select();
    
    function saveTodoText() {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
            const todo = allTodos[groupName].todos.find(t => t.id === todoId);
            if (todo) {
                todo.text = newText;
                saveAllData();
            }
        }
        renderAllGroups();
        applyCurrentFilter();
    }
    
    input.addEventListener('blur', saveTodoText);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') saveTodoText();
    });
}

// 마감일 수정

function enableEditDueDate(element, groupName, todoId) {
    const currentDate = element.textContent;
    const input = document.createElement('input');
    input.type = 'date';
    input.className = 'edit-todo-date';
    input.value = currentDate;
    
    element.replaceWith(input);
    input.focus();
    
    function saveDueDate() {
        const newDate = input.value;
        if (newDate) {
            const todo = allTodos[groupName].todos.find(t => t.id === todoId);
            if (todo) {
                todo.dueDate = newDate;
                saveAllData();
            }
        }
        renderAllGroups();
        applyCurrentFilter();
    }
    
    input.addEventListener('blur', saveDueDate);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') saveDueDate();
    });
}

// 할 일 상태 변경

function updateStatus(selectElement, groupName, todoId) {
    const newStatus = selectElement.value;
    const todo = allTodos[groupName].todos.find(t => t.id === todoId);
    if (todo) {
        todo.status = newStatus;
        saveAllData();
        renderAllGroups();
        applyCurrentFilter();
    }
}

// 할 일 삭제

function deleteTodo(groupName, todoId) {
    if (confirm('이 할 일을 삭제하시겠습니까?')) {
        allTodos[groupName].todos = allTodos[groupName].todos.filter(t => t.id !== todoId);
        
        if (allTodos[groupName].todos.length === 0 && groupName !== 'none_assigned') {
            delete allTodos[groupName];
            allGroups = allGroups.filter(g => g !== groupName);
        }
        
        saveAllData();
        renderAllGroups();
        applyCurrentFilter();
    }
}

// 그룹 삭제

function deleteGroup(groupName) {
    if (confirm(`'${groupName}' 그룹을 삭제하시겠습니까? (그룹 내 모든 할 일도 삭제됩니다)`)) {
        delete allTodos[groupName];
        allGroups = allGroups.filter(g => g !== groupName);
        saveAllData();
        renderAllGroups();
        applyCurrentFilter();
    }
}

// 그룹 테마 변경

function changeGroupTheme(selectElement, groupName) {
    const newTheme = selectElement.value;
    allTodos[groupName].theme = newTheme;
    saveAllData();
    renderAllGroups();
    applyCurrentFilter();
}

// 메모 기능

function enableEditMemo(buttonElement, groupName, todoId) {
    const memoSection = buttonElement.closest('.todo-memo-section');
    const todo = allTodos[groupName].todos.find(t => t.id === todoId);
    
    if (!todo) return;
    
    const editHtml = `
        <textarea class="edit-memo-input" placeholder="메모를 입력하세요...">${escapeHtml(todo.memo)}</textarea>
        <div class="memo-buttons" style="display: flex !important; gap: 6px !important; flex-wrap: nowrap !important; width: 100% !important;">
            <button class="memo-save-btn" onclick="saveMemo(this, '${groupName}', ${todoId})">저장</button>
            <button class="memo-cancel-btn" onclick="cancelMemo(this, '${groupName}', ${todoId})">취소</button>
            ${todo.memo ? `<button class="memo-delete-btn" onclick="deleteMemo(this, '${groupName}', ${todoId})">메모 삭제</button>` : ''}
        </div>
    `;
    
    memoSection.innerHTML = editHtml;
    memoSection.querySelector('.edit-memo-input').focus();
}

function saveMemo(buttonElement, groupName, todoId) {
    const memoSection = buttonElement.closest('.todo-memo-section');
    const textarea = memoSection.querySelector('.edit-memo-input');
    const memoText = textarea.value.trim();
    
    const todo = allTodos[groupName].todos.find(t => t.id === todoId);
    if (todo) {
        todo.memo = memoText;
        saveAllData();
        renderAllGroups();
        applyCurrentFilter();
    }
}

function cancelMemo(buttonElement, groupName, todoId) {
    renderAllGroups();
    applyCurrentFilter();
}

function deleteMemo(buttonElement, groupName, todoId) {
    const todo = allTodos[groupName].todos.find(t => t.id === todoId);
    if (todo) {
        todo.memo = '';
        saveAllData();
        renderAllGroups();
        applyCurrentFilter();
    }
}

// 필터링
function filterTodos(status, buttonElement) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    
    currentFilter = status;
    applyCurrentFilter();
}

function applyCurrentFilter() {
    const items = document.querySelectorAll('.todo-item');
    const groups = document.querySelectorAll('.todo-group');
    
    items.forEach(item => {
        if (currentFilter === 'all') {
            item.classList.remove('hidden');
        } else {
            const itemStatus = item.className.match(/status-(\w+)/)?.[1];
            if (itemStatus === currentFilter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }
    });
    
    groups.forEach(group => {
        const visibleItems = group.querySelectorAll('.todo-item:not(.hidden)');
        if (visibleItems.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = 'block';
        }
    });
}

// 데이터 저장 및 로드

function saveAllData() {
    const dataToSave = {
        todos: allTodos,
        groups: allGroups
    };
    localStorage.setItem('todoAppData', JSON.stringify(dataToSave));
    console.log('데이터 저장됨');
}

function loadAllData() {
    const savedData = localStorage.getItem('todoAppData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            allTodos = data.todos || {};
            allGroups = data.groups || Object.keys(allTodos);
            console.log('저장된 데이터 로드됨');
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            allTodos = {};
            allGroups = [];
        }
    } else {
        console.log('저장된 데이터 없음');
    }
}

// 유틸리티
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}