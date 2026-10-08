/**
 * TaskFlow — Modern To-Do Application
 * Features:
 * - Full CRUD tasks with Title, Description, Priority, Category, and Due Date
 * - Dynamic Status Filters (All / Active / Completed), Priority & Category Filters
 * - Live Real-Time Search with instant query clear
 * - Due date status indicators (Overdue, Due Today, Upcoming)
 * - Animated Progress Bar & Task Statistics
 * - Dark / Light Theme toggle with LocalStorage persistence
 * - Automatic migration from legacy Kanban board data
 * - Responsive UI with Keyboard shortcuts & Toast notifications
 */

// Storage Keys
const STORAGE_KEY = 'taskflow_tasks';
const LEGACY_KANBAN_KEY = 'kanban_tasks';
const THEME_KEY = 'taskflow_theme';

// Application State
let tasks = [];
let currentFilter = 'all'; // 'all' | 'active' | 'completed'
let currentPriority = 'all'; // 'all' | 'high' | 'medium' | 'low'
let currentCategory = 'all'; // 'all' | 'work' | 'personal' | 'study' | 'general'
let searchQuery = '';

// DOM Elements
const taskListEl = document.getElementById('task-list');
const emptyStateEl = document.getElementById('empty-state');
const emptyAddBtn = document.getElementById('empty-add-btn');
const quickAddForm = document.getElementById('quick-add-form');
const quickTaskInput = document.getElementById('quick-task-input');

// Search & Filters
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const statusPills = document.querySelectorAll('#status-filters .pill-btn');
const priorityFilter = document.getElementById('priority-filter');
const categoryFilter = document.getElementById('category-filter');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const currentViewTitle = document.getElementById('current-view-title');

// Stats Elements
const statAllCount = document.getElementById('stat-all-count');
const statActiveCount = document.getElementById('stat-active-count');
const statDoneCount = document.getElementById('stat-done-count');
const statsSummary = document.getElementById('stats-summary');
const statsPercentage = document.getElementById('stats-percentage');
const progressBarFill = document.getElementById('progress-bar-fill');

// Modal Elements
const taskModal = document.getElementById('task-modal');
const modalTitle = document.getElementById('modal-title');
const taskForm = document.getElementById('task-form');
const editTaskIdInput = document.getElementById('edit-task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskPriorityInput = document.getElementById('task-priority');
const taskCategoryInput = document.getElementById('task-category');
const taskDueDateInput = document.getElementById('task-due-date');
const openAddModalBtn = document.getElementById('open-add-modal-btn');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// Theme & Notifications
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const toastContainer = document.getElementById('toast-container');

// ==========================================================================
// Initialization & LocalStorage Management
// ==========================================================================

function initApp() {
    initTheme();
    loadTasks();
    setupEventListeners();
    render();
}

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} theme`);
}

function loadTasks() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
        try {
            tasks = JSON.parse(rawData);
            return;
        } catch (e) {
            console.error('Error parsing tasks:', e);
            tasks = [];
        }
    }

    // Auto-migrate legacy Kanban data if present
    const legacyRaw = localStorage.getItem(LEGACY_KANBAN_KEY);
    if (legacyRaw) {
        try {
            const legacyTasks = JSON.parse(legacyRaw);
            if (Array.isArray(legacyTasks) && legacyTasks.length > 0) {
                tasks = legacyTasks.map(oldTask => ({
                    id: generateId(),
                    title: oldTask.title || 'Untitled Task',
                    desc: oldTask.desc === 'No description' ? '' : (oldTask.desc || ''),
                    completed: oldTask.columnId === 'done',
                    priority: 'medium',
                    category: 'general',
                    dueDate: '',
                    createdAt: parseInt(oldTask.timestamp) || Date.now()
                }));
                saveTasks();
                showToast(`Imported ${tasks.length} tasks from your previous board`);
                return;
            }
        } catch (e) {
            console.error('Error importing legacy tasks:', e);
        }
    }

    // Default sample tasks if first time visiting
    tasks = [
        {
            id: generateId(),
            title: 'Welcome to TaskFlow! 🎉',
            desc: 'Check off tasks, set priorities, and organize your day effortlessly.',
            completed: false,
            priority: 'high',
            category: 'general',
            dueDate: getFormattedDateOffset(0), // Today
            createdAt: Date.now() - 3600000
        },
        {
            id: generateId(),
            title: 'Try quick add or click + Add Task',
            desc: 'Use keyboard shortcut "/" to search anytime.',
            completed: false,
            priority: 'medium',
            category: 'work',
            dueDate: getFormattedDateOffset(1), // Tomorrow
            createdAt: Date.now() - 1800000
        },
        {
            id: generateId(),
            title: 'Explore Dark & Light mode',
            desc: 'Click the sun/moon icon in the top right to switch your view.',
            completed: true,
            priority: 'low',
            category: 'personal',
            dueDate: '',
            createdAt: Date.now() - 7200000
        }
    ];
    saveTasks();
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function generateId() {
    return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

function getFormattedDateOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
}

// ==========================================================================
// Rendering
// ==========================================================================

function render() {
    updateStats();
    renderTasks();
}

function updateStats() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const activeCount = totalCount - completedCount;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    statAllCount.textContent = totalCount;
    statActiveCount.textContent = activeCount;
    statDoneCount.textContent = completedCount;
    statsSummary.textContent = `${completedCount} of ${totalCount} tasks completed`;
    statsPercentage.textContent = `${percentage}%`;
    progressBarFill.style.width = `${percentage}%`;

    // Clear completed button visibility
    clearCompletedBtn.style.display = completedCount > 0 ? 'inline-block' : 'none';
}

function getFilteredTasks() {
    return tasks.filter(task => {
        // Status filter
        if (currentFilter === 'active' && task.completed) return false;
        if (currentFilter === 'completed' && !task.completed) return false;

        // Priority filter
        if (currentPriority !== 'all' && task.priority !== currentPriority) return false;

        // Category filter
        if (currentCategory !== 'all' && task.category !== currentCategory) return false;

        // Search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const titleMatch = task.title.toLowerCase().includes(query);
            const descMatch = (task.desc || '').toLowerCase().includes(query);
            if (!titleMatch && !descMatch) return false;
        }

        return true;
    });
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    taskListEl.innerHTML = '';

    // Update section title
    if (searchQuery.trim() !== '') {
        currentViewTitle.textContent = `Search Results (${filteredTasks.length})`;
    } else if (currentFilter === 'active') {
        currentViewTitle.textContent = `Active Tasks (${filteredTasks.length})`;
    } else if (currentFilter === 'completed') {
        currentViewTitle.textContent = `Completed Tasks (${filteredTasks.length})`;
    } else {
        currentViewTitle.textContent = `All Tasks (${filteredTasks.length})`;
    }

    if (filteredTasks.length === 0) {
        taskListEl.style.display = 'none';
        emptyStateEl.style.display = 'flex';
        return;
    }

    taskListEl.style.display = 'flex';
    emptyStateEl.style.display = 'none';

    // Sort: uncompleted first, then by priority / due date
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return b.createdAt - a.createdAt;
    });

    sortedTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskListEl.appendChild(taskItem);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    // Format Created Date
    const createdDate = new Date(task.createdAt);
    const createdDateStr = createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    // Due Date Badge Logic
    let dueBadgeHtml = '';
    if (task.dueDate) {
        const dueInfo = getDueDateStatus(task.dueDate);
        dueBadgeHtml = `<span class="badge badge-due ${dueInfo.statusClass}">
            📅 ${dueInfo.label}
        </span>`;
    }

    // Priority Labels
    const priorityLabels = {
        high: '🔥 High',
        medium: '⚡ Medium',
        low: '🌱 Low'
    };

    // Category Icons
    const categoryIcons = {
        work: '💼 Work',
        personal: '👤 Personal',
        study: '📚 Study',
        general: '✨ General'
    };

    li.innerHTML = `
        <label class="task-checkbox-label" title="${task.completed ? 'Mark as active' : 'Mark as completed'}">
            <input type="checkbox" class="task-checkbox-input" ${task.completed ? 'checked' : ''}>
            <div class="custom-checkbox">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
        </label>

        <div class="task-main">
            <div class="task-title-line">
                <h4 class="task-title">${escapeHtml(task.title)}</h4>
            </div>
            ${task.desc ? `<p class="task-desc">${escapeHtml(task.desc)}</p>` : ''}
            
            <div class="task-meta">
                <span class="badge badge-priority-${task.priority}">
                    ${priorityLabels[task.priority] || task.priority}
                </span>
                <span class="badge badge-category">
                    ${categoryIcons[task.category] || task.category}
                </span>
                ${dueBadgeHtml}
                <span class="task-date-created">${createdDateStr}</span>
            </div>
        </div>

        <div class="task-actions">
            <button class="action-btn edit-btn" title="Edit task" aria-label="Edit task">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
            </button>
            <button class="action-btn delete-btn" title="Delete task" aria-label="Delete task">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `;

    // Event Listeners for Item
    const checkbox = li.querySelector('.task-checkbox-input');
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => openEditModal(task.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    return li;
}

function getDueDateStatus(dueDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dueDateStr.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            statusClass: 'overdue',
            label: `Overdue by ${Math.abs(diffDays)}d`
        };
    } else if (diffDays === 0) {
        return {
            statusClass: 'due-today',
            label: 'Due Today'
        };
    } else if (diffDays === 1) {
        return {
            statusClass: '',
            label: 'Due Tomorrow'
        };
    } else {
        const formatted = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
            statusClass: '',
            label: formatted
        };
    }
}

// ==========================================================================
// Task Actions: Add, Toggle, Edit, Delete
// ==========================================================================

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    render();

    if (task.completed) {
        showToast('Task completed! Great job! 🎉');
    }
}

function deleteTask(taskId) {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return;

    const removedTask = tasks.splice(index, 1)[0];
    saveTasks();
    render();
    showToast(`Deleted "${removedTask.title}"`);
}

function clearCompleted() {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) return;

    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
    showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}`);
}

function handleQuickAdd(e) {
    e.preventDefault();
    const title = quickTaskInput.value.trim();
    if (!title) return;

    const newTask = {
        id: generateId(),
        title,
        desc: '',
        completed: false,
        priority: 'medium',
        category: 'general',
        dueDate: '',
        createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    quickTaskInput.value = '';
    render();
    showToast('Task added successfully!');
}

// ==========================================================================
// Modal Operations
// ==========================================================================

function openAddModal() {
    editTaskIdInput.value = '';
    modalTitle.textContent = 'Add New Task';
    taskForm.reset();
    taskPriorityInput.value = 'medium';
    taskCategoryInput.value = 'general';
    taskDueDateInput.value = '';

    taskModal.classList.add('show');
    setTimeout(() => taskTitleInput.focus(), 50);
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editTaskIdInput.value = task.id;
    modalTitle.textContent = 'Edit Task';
    taskTitleInput.value = task.title;
    taskDescInput.value = task.desc || '';
    taskPriorityInput.value = task.priority || 'medium';
    taskCategoryInput.value = task.category || 'general';
    taskDueDateInput.value = task.dueDate || '';

    taskModal.classList.add('show');
    setTimeout(() => taskTitleInput.focus(), 50);
}

function closeModal() {
    taskModal.classList.remove('show');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    if (!title) {
        showToast('Please provide a task title');
        return;
    }

    const editId = editTaskIdInput.value;
    if (editId) {
        // Editing existing task
        const task = tasks.find(t => t.id === editId);
        if (task) {
            task.title = title;
            task.desc = taskDescInput.value.trim();
            task.priority = taskPriorityInput.value;
            task.category = taskCategoryInput.value;
            task.dueDate = taskDueDateInput.value;
            showToast('Task updated successfully!');
        }
    } else {
        // Creating new task
        const newTask = {
            id: generateId(),
            title,
            desc: taskDescInput.value.trim(),
            completed: false,
            priority: taskPriorityInput.value,
            category: taskCategoryInput.value,
            dueDate: taskDueDateInput.value,
            createdAt: Date.now()
        };
        tasks.unshift(newTask);
        showToast('New task created!');
    }

    saveTasks();
    closeModal();
    render();
}

// ==========================================================================
// Toast Notifications
// ==========================================================================

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// ==========================================================================
// Event Listeners & Shortcuts
// ==========================================================================

function setupEventListeners() {
    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Quick add form
    quickAddForm.addEventListener('submit', handleQuickAdd);

    // Modal triggers
    openAddModalBtn.addEventListener('click', openAddModal);
    emptyAddBtn.addEventListener('click', openAddModal);
    modalCloseBtn.addEventListener('click', closeModal);
    modalCancelBtn.addEventListener('click', closeModal);
    taskForm.addEventListener('submit', handleFormSubmit);

    // Close modal on backdrop click
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeModal();
        }
    });

    // Clear completed button
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Search events
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        render();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        render();
    });

    // Status filter pills
    statusPills.forEach(pill => {
        pill.addEventListener('click', () => {
            statusPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.getAttribute('data-status');
            render();
        });
    });

    // Dropdown filters
    priorityFilter.addEventListener('change', (e) => {
        currentPriority = e.target.value;
        render();
    });

    categoryFilter.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        render();
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Esc closes modal
        if (e.key === 'Escape' && taskModal.classList.contains('show')) {
            closeModal();
        }

        // '/' focuses search input (when not already typing in an input/textarea)
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Utility: HTML Sanitizer
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Start Application on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
