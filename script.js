let draggedTask = null;
const STORAGE_KEY = 'kanban_tasks';
const TIMER_CHECK_INTERVAL = 60000;  

const taskColumns = document.querySelectorAll('.task-column');
const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('nav button');
const confirmBtn = document.getElementById('add-task-confirm');
const cancelBtn = document.getElementById('add-task-cancel');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-column').forEach(column => {
        const columnId = column.id;
        column.querySelectorAll('.task').forEach(task => {
            const title = task.querySelector('h2').textContent;
            const desc = task.querySelector('p').textContent;
            const timestamp = task.getAttribute('data-timestamp');
            tasks.push({ title, desc, columnId, timestamp });
        });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    updateAllCounts();
}

function updateAllCounts() {
    const columns = ['todo', 'progress', 'done'];
    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        const taskCount = column.querySelectorAll('.task').length;
        const countElement = column.querySelector('.heading .right');
        if (countElement) {
            countElement.textContent = taskCount;
        }
    });
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    tasks.forEach(task => {
        const column = document.getElementById(task.columnId);
        if (column) {
            createTaskElement(task.title, task.desc, column, task.timestamp);
        }
    });
}

function createTaskElement(title, desc, targetColumn, timestamp) {
    const newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.draggable = true;
    const taskTimestamp = timestamp || Date.now();
    newTask.setAttribute('data-timestamp', taskTimestamp);
    newTask.innerHTML = `
        <h2>${title}</h2>
        <p>${desc || 'No description'}</p>
        <div class="task-timer" style="font-size: 0.8rem; color: #ffa500; margin-top: 5px;"></div>
        <div class="task-buttons">
            <button class="done-btn">Done</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    
    targetColumn.appendChild(newTask);
    
    addDragStartListener(newTask);
    addDragEndListener(newTask);
    addTaskButtonListeners(newTask);
    updateTaskButtons(newTask);
    updateTaskTimer(newTask);
}

function updateTaskButtons(task) {
    const doneBtn = task.querySelector('.done-btn');
    const parentColumn = task.closest('.task-column');
    
    if (parentColumn && parentColumn.id === 'done') {
        doneBtn.style.display = 'none';
    } else {
        doneBtn.style.display = 'block';
    }
}

function updateTaskTimer(task) {
    const timestamp = parseInt(task.getAttribute('data-timestamp'));
    const now = Date.now();
    const timeElapsed = now - timestamp;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    const timerDiv = task.querySelector('.task-timer');
    const parentColumn = task.closest('.task-column');
    
     
    const createdDate = new Date(timestamp);
    const formattedTime = createdDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (parentColumn && parentColumn.id === 'done') {
        timerDiv.textContent = `✓ Completed - Created: ${formattedTime}`;
        timerDiv.style.color = '#4CAF50';
        task.style.borderLeft = '4px solid #4CAF50';
        return;
    }
    
     
    timerDiv.textContent = `Created: ${formattedTime}`;
    timerDiv.style.color = '#aaa';
    task.style.borderLeft = '4px solid #4CAF50';
    
     
    if (timeElapsed >= twentyFourHours && parentColumn && parentColumn.id === 'todo') {
        const progressColumn = document.getElementById('progress');
        progressColumn.appendChild(task);
        timerDiv.textContent = `⚠️ Auto-moved after 24hrs - Created: ${formattedTime}`;
        timerDiv.style.color = '#ff9800';
        task.style.borderLeft = '4px solid #ff9800';
        saveTasks();
        updateAllCounts();
    }
}

function addTaskButtonListeners(task) {
    const doneBtn = task.querySelector('.done-btn');
    const deleteBtn = task.querySelector('.delete-btn');
    
    doneBtn.addEventListener('click', () => {
        const doneColumn = document.getElementById('done');
        doneColumn.appendChild(task);
        updateTaskButtons(task);
        updateTaskTimer(task);
        saveTasks();
        updateAllCounts();
    });
    
    deleteBtn.addEventListener('click', () => {
        task.remove();
        saveTasks();
        updateAllCounts();
    });
}

function addDragStartListener(task) {
    task.addEventListener('dragstart', (e) => {
        draggedTask = task;
        task.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
    });
}

function addDragEndListener(task) {
    task.addEventListener('dragend', (e) => {
        task.style.opacity = '1';
        draggedTask = null;
    });
}

taskColumns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        column.style.borderColor = 'var(--accent-color)';
    });

    column.addEventListener('dragleave', (e) => {
        if (e.target === column) {
            column.style.borderColor = 'transparent';
        }
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.style.borderColor = 'transparent';
        
        if (draggedTask) {
            column.appendChild(draggedTask);
            updateTaskButtons(draggedTask);
            updateTaskTimer(draggedTask);
            saveTasks();
            updateAllCounts();
        }
    });
});

function initializeTasks() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        task.setAttribute('draggable', 'true');
        addDragStartListener(task);
        addDragEndListener(task);
        addTaskButtonListeners(task);
    });
}

function openModal() {
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
    taskTitleInput.value = '';
    taskDescInput.value = '';
}

addTaskButton.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

confirmBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const desc = taskDescInput.value.trim();
    
    if (title === '') {
        alert('Please enter a task title');
        return;
    }
    
    const todoColumn = document.getElementById('todo');
    createTaskElement(title, desc, todoColumn);
    saveTasks();
    closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
    initializeTasks();
    loadTasks();
    updateAllCounts();
    
     
    setInterval(() => {
        document.querySelectorAll('.task').forEach(task => {
            updateTaskTimer(task);
        });
    }, TIMER_CHECK_INTERVAL);
});
