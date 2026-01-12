const MS_PER_DAY = 1000 * 60 * 60 * 24;

let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];

const form = document.getElementById('deadline-form');
const list = document.getElementById('deadline-list');
const emptyMessage = document.getElementById('empty-message');

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

function renderDeadlines() {
    // clear existing list
    list.innerHTML = '';

    // show or hide the empty message
    emptyMessage.style.display = deadlines.length === 0 ? 'block' : 'none';

    deadlines.forEach((deadline, index) => {
        const li = document.createElement('li');
        li.className = 'deadline-item';

        // determine urgency
        const urgency = getUrgency(deadline.deadline, deadline.completed);
        li.classList.add(urgency);

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

