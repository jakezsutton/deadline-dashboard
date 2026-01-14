# Deadline Dashboard

An interactive web application for tracking academic deadlines by their urgency.

Built with HTML, CSS, and JavaScript, this dashboard will help with staying organized
by visually prioritizing tasks, supporting inline deadline editing, and persisting data
across sessions.

## Features

- Add deadlines with course code, task description, and due date
- Automatic urgency detection with colour-coded prioritization:
    - `#dc2626` Overdue
    - `#d97706` Urgent (< 3 days)
    - `#f4f41f` Upcoming (3-7 days)
    - `#2563eb` Normal (> 7 days)
- Sorts deadlines by due date, keeping the most important tasks at the top
- Mark tasks as complete/uncomplete
- Completed tasks grouped at the bottom, still sorted by date
- Toggle to hide/show completed tasks
- Inline editing of deadlines directly within the list
- Keyboard-friendly UX for faster editing of deadlines
- Persistent storage using `localStorage`
- Clean, responsive UI with intuitive interactions

## Demo

GitHub Pages link: https://jakezsutton.github.io/deadline-dashboard/

## Technologies Used

- **HTML5** - semantic structure
- **CSS3** - Flexbox layout
- **JavaScript (ES6)** - DOM manipulation, event handling
- **localStorage API** - persistent data storage

## How to Use

**1. Add a deadline**
    - Enter a course code, task description, and due date, then click 'Add'
**2. View deadlines**
    - Tasks are automatically sorted by due date
    - Colour indicates urgency at a glance
**3. Edit a deadline**
    - Click the edit (pencil) icon
    - Modify fields inline
    - Save (enter) or cancel (escape) changes
**4. Mark complete**
    - Click the mark complete (check) icon to toggle completion
    - Completed tasks move to the bottom, still sorted
**5. Hide completed tasks**
    - Use the checkbox next to _Upcoming Deadlines_

## Learning Objectives & Takeaways

This project was built to strengthen front-end skills using basic HTML, CSS, and JavaScript by creating a meaningful interface.

### Technical Skills

- DOM manipulation
- Event-driven programming
- Data persistence with `localStorage`
- Sorting and filtering data
- Input validation

### UI Skills

- Colour-coded indicators
- Inline editing patterns
- Keyboard accessibility
- Visual hierarchy for readability

## Future Improvements

- Due today indicator
- Animations for state changes
- Dark mode
- Calendar view integration

## Credits

- SVG icons from Heroicons: https://heroicons.com/
  (MIT license)

## Author

**Jake Sutton**
Software Engineering Student