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

let deadlines = [];

const form = document.getElementById('deadline-form');
const list = document.getElementById('deadline-list');
const emptyMessage = document.getElementById('empty-message');

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

    renderDeadlines();
    form.reset();
});