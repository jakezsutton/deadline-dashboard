const MS_PER_DAY = 1000 * 60 * 60 * 24;

let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];

const form = document.getElementById('deadline-form');
const list = document.getElementById('deadline-list');
const emptyMessage = document.getElementById('empty-message');
const toggleCompleted = document.getElementById('toggle-completed');

renderDeadlines();

/**
 * Formats the course input into a standardized format.
 * Removes all whitespace and capitalizes the course code.
 * 
 * Examples:
 * - "cSc    230" -> "CSC230"
 * - "S e N g 2 7 5" -> "SENG275"
 * 
 * @param {string} course - The user's raw course input.
 * @returns {string} The correctly formatted course code.
 */
function formatCourseInput(course) {
    course = course.trim();
    course = course.replace(/\s+/g, '');

    const match = course.match(/^([a-zA-Z]+)(\d+)$/);

    if (match) return match[1].toUpperCase() + match[2];

    // if input doesn't match expected course code format, capitalize and return input
    return course.toUpperCase();
}

/**
 * Determines the urgency of a deadline based on today's date.   
 * 
 * @param {string} date - Deadline date in 'YYYY-MM-DD' format.
 * @param {boolean} completed - Whether the task is completed.
 * @returns {string} One of: 'overdue', 'urgent', 'soon', 'normal', 'completed'.
 */
function getUrgency(date, completed) {
    if (completed) return 'completed';

    const today = new Date();
    const deadlineDate = new Date(date);

    // set to local time for accurate urgency
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const diff = (deadlineDate - today) / MS_PER_DAY;

    if (diff < 0) return 'overdue';
    if (diff <= 3) return 'urgent';
    if (diff <= 7) return 'soon';
    return 'normal';
}

/**
 * Creates an inline SVG icon from Heroicons.com with click handler
 * 
 * @param {string} type - 'delete', 'edit', or 'complete'
 * @param {function} onClick - Callback for when the icon is clicked
 * @param {boolean} completed - For toggle between 'Mark Complete' and 'Mark Uncomplete'
 * @returns {HTMLElement} Span containing SVG icon for type
 */
function createIcon(type, onClick, completed = false) {
    const span = document.createElement('span');
    span.className = `${type} icon`;
    span.style.cursor = 'pointer';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.style.width = '20px';
    span.style.height = '20px';

    switch (type) {
        case 'delete':
            span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>`;
            span.title = 'Delete';
            break;

        case 'edit':
            span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>`;
            span.title = 'Edit';
            break;

        case 'complete':
            span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${completed ? 'gray' : 'green'}">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>`;
            span.title = completed ? 'Mark Uncomplete' : 'Mark Complete';
    }

    span.addEventListener('click', onClick);
    return span;
}

/**
 * Shows an edit form for a given deadline directly below it
 * 
 * @param {HTMLElement} li - The <li> element representing the deadline.
 * @param {object} deadline - The deadline object to edit.
 */
function showEditForm(li, deadline) {
    // remove any other open edit forms first
    const existingEdit = document.querySelector('.edit-form');
    if (existingEdit) existingEdit.remove();

    // disable all icons while editing
    document.querySelectorAll('.deadline-right .icon').forEach(icon => {
        icon.style.pointerEvents = 'none';
        icon.style.opacity = '0.4';
    });

    const editDiv = document.createElement('div');
    editDiv.className = 'edit-form';

    const courseInput = document.createElement('input');
    courseInput.type = 'text';
    courseInput.value = deadline.course;
    courseInput.className = 'edit-input course-input';
    courseInput.required = true;

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.value = deadline.task;
    taskInput.className = 'edit-input task-input';
    taskInput.required = true;

    const deadlineInput = document.createElement('input');
    deadlineInput.type = 'date';
    deadlineInput.value = deadline.deadline;
    deadlineInput.className = 'edit-input date-input';
    deadlineInput.required = true;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'save-btn';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'cancel-btn';

    const errorMsg = document.createElement('div');
    errorMsg.className = 'edit-error';

    saveBtn.addEventListener('click', () => {
        const newCourse = courseInput.value.trim();
        const newTask = taskInput.value.trim();
        const newDeadline = deadlineInput.value;

        if (!newCourse || !newTask || !newDeadline) {
            errorMsg.textContent = 'All fields are required!';
            return;
        }

        errorMsg.textContent = '';

        deadline.course = formatCourseInput(courseInput.value);
        deadline.task = taskInput.value;
        deadline.deadline = deadlineInput.value;

        localStorage.setItem('deadlines', JSON.stringify(deadlines));
        renderDeadlines();
    });

    cancelBtn.addEventListener('click', () => {
        editDiv.remove();
        // re-enable all the icons
        document.querySelectorAll('.deadline-right .icon').forEach(icon => {
            icon.style.pointerEvents = '';
            icon.style.opacity = '';
        });
    });

    editDiv.appendChild(courseInput);
    editDiv.appendChild(taskInput);
    editDiv.appendChild(deadlineInput);
    editDiv.appendChild(saveBtn);
    editDiv.appendChild(cancelBtn);
    editDiv.appendChild(errorMsg);

    // properly show the edit form below the deadline
    li.insertAdjacentElement('afterend', editDiv);
}

/**
 * Sorts deadlines by due date.
 * Uncompleted deadlines are sorted first followed by completed ones.
 * Both groups are sorted by earliest due date.
 * 
 * @param {Array} deadlines - The list of deadlines to be sorted. 
 */
function sortDeadlines(deadlines) {
    deadlines.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed - b.completed;
        } else {
            return new Date(a.deadline) - new Date(b.deadline);
        }
    });
}

function renderDeadlines() {
    // clear existing list
    list.innerHTML = '';

    // sort the deadlines
    sortDeadlines(deadlines);

    // show or hide the empty message
    const hasUncompleted = deadlines.some(d => !d.completed);
    emptyMessage.style.display = hasUncompleted ? 'none' : 'block';

    // divider to separate completed tasks from uncompleted
    let insertedDivider = false;

    // determine whether to hide completed tasks
    const hideCompleted = toggleCompleted.checked;

    deadlines.forEach((deadline, index) => {
        const li = document.createElement('li');
        li.className = 'deadline-item';

        if (hideCompleted && deadline.completed) return;

        // determine urgency
        const urgency = getUrgency(deadline.deadline, deadline.completed);
        li.classList.add(urgency);

        if (deadline.completed && !insertedDivider) {
            const div = document.createElement('div');
            div.className = 'completed-divider';
            div.textContent = 'Completed Tasks'
            list.appendChild(div);
            insertedDivider = true;
        }

        // left: course (bold) + task
        const left = document.createElement('div');
        left.className = 'deadline-left';

        const courseElem = document.createElement('span');
        courseElem.className = 'course';
        courseElem.textContent = deadline.course;

        const taskElem = document.createElement('span');
        taskElem.className = 'task';
        taskElem.textContent = deadline.task;
        taskElem.style.display = 'block';

        left.appendChild(courseElem);
        left.appendChild(taskElem);

        // right: date and icons for edit, delete, and mark complete
        const right = document.createElement('div');
        right.className = 'deadline-right';

        const dateElem = document.createElement('span');
        dateElem.className = 'deadline-date';
        dateElem.textContent = deadline.deadline;

        right.appendChild(dateElem);

        // icons for deadline operations
        right.appendChild(createIcon('delete', () => {
            deadlines.splice(index, 1);
            localStorage.setItem('deadlines', JSON.stringify(deadlines));
            renderDeadlines();
        }));

        const editIcon = createIcon('edit', () => showEditForm(li, deadline));
        if (deadline.completed) editIcon.classList.add('disabled');

        right.appendChild(editIcon);

        right.appendChild(createIcon('complete', () => {
            // toggle completed
            deadline.completed = !deadline.completed;
            localStorage.setItem('deadlines', JSON.stringify(deadlines));
            renderDeadlines();
        }, deadline.completed));

        li.appendChild(left);
        li.appendChild(right);

        list.appendChild(li);
    });
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const course = formatCourseInput(document.getElementById('course-input').value);
    const task = document.getElementById('task-input').value.trim();
    const deadline = document.getElementById('date-input').value;

    const newDeadline = {
        course,
        task,
        deadline,
        completed: false
    }

    deadlines.push(newDeadline);
    localStorage.setItem('deadlines', JSON.stringify(deadlines));

    renderDeadlines();
    form.reset();
});

toggleCompleted.addEventListener('change', (e) => {
    const scrollY = window.scrollY;

    e.target.blur();

    renderDeadlines();

    requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
    });
});