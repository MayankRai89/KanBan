# KanBan Board

A modern, responsive Kanban task management application built with HTML, CSS, and JavaScript. Manage your tasks efficiently with drag-and-drop functionality, automatic timers, and persistent storage.

## Features

### Core Functionality
- 📋 **Three Task Columns**: To Do, In Progress, and Done
- 🖱️ **Drag & Drop**: Move tasks between columns seamlessly
- ➕ **Add Tasks**: Create new tasks with title and description via modal dialog
- 🗑️ **Delete Tasks**: Remove tasks from any column
- ✅ **Mark Done**: Complete tasks and move them to the Done column

### Advanced Features
- ⏱️ **Task Creation Timestamp**: Each task displays when it was created
- ⚠️ **Auto-Transfer After 24hrs**: Tasks automatically move from "To Do" to "In Progress" if not completed within 24 hours
- 📊 **Task Counter**: Real-time count of tasks in each column
- 💾 **Local Storage**: All tasks are automatically saved and persist across browser sessions
- 🎨 **Glassmorphism Modal**: Modern frosted glass effect for the task creation dialog
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

### User Interface
- 🌙 Dark theme with green accent colors
- 🎯 Intuitive task management interface
- ⚡ Smooth animations and transitions
- 🎨 Color-coded visual feedback
  - Green border: Active tasks
  - Orange border: Tasks nearing 24-hour limit
  - Green checkmark: Completed tasks

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Flexbox, Grid, Media Queries, Backdrop Filter, Animations
- **Vanilla JavaScript**: DOM manipulation, Event handling, Local Storage API
- **Local Storage**: Client-side data persistence

## Installation & Usage

### Getting Started

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/MayankRai89/KanBan.git
   cd kanban-board
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - No server or installation required!

### How to Use

#### Adding Tasks
1. Click the **"Add Task"** button in the navigation bar
2. Enter task title (required)
3. Add optional description
4. Click **"Add Task"** to create
5. Task appears in the "To Do" column

#### Managing Tasks
- **Drag Tasks**: Click and drag any task to move it between columns
- **Mark Complete**: Click the **"Done"** button on a task to mark it complete and move to "Done" column
- **Delete Tasks**: Click the **"Delete"** button (red) to remove a task

#### Auto-Transfer Feature
- If a task stays in "To Do" for 24 hours without being completed, it automatically moves to "In Progress"
- Tasks in "In Progress" or "Done" columns won't auto-transfer
- The task will show a warning indicator when auto-transferred

#### Task Information
- Creation timestamp is displayed below each task description
- Task counter shows the number of tasks in each column
- Timer updates automatically every minute

## File Structure

```
kanban-board/
├── index.html          # Main HTML file with modal dialog
├── style.css           # Styling and responsive design
├── script.js           # JavaScript functionality and logic
└── README.md           # This file
```

## Features in Detail

### 1. Task Creation
- Modal dialog with smooth backdrop blur effect
- Input validation (title is required)
- Optional description field
- Tasks created with timestamp

### 2. Task Movement
- **Drag & Drop**: Move tasks by dragging between columns
- **Done Button**: Quick move to Done column
- **Automatic Transfer**: 24-hour auto-transfer from To Do → In Progress

### 3. Data Persistence
- All tasks saved to browser's Local Storage
- Automatic saving on every action:
  - Creating a task
  - Deleting a task
  - Moving a task
  - Marking as done
- Tasks restored on page refresh

### 4. Task Counters
- Real-time update of task count in each column
- Updates when tasks are added, deleted, or moved

### 5. Responsive Design

#### Desktop (1024px and above)
- Three columns displayed side-by-side
- Full-size modal dialog
- Optimized padding and spacing

#### Tablet (768px - 1024px)
- Single column layout
- Adjusted font sizes and spacing
- Touch-friendly buttons

#### Mobile (480px - 768px)
- Full-width columns
- Stacked navigation
- Compact modal
- Optimized for touch

#### Small Mobile (320px - 480px)
- Minimal spacing
- Small fonts
- Single column layout
- Full-width buttons

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

## Local Storage Details

Tasks are stored in Local Storage with the following structure:

```javascript
{
  "title": "Task Title",
  "desc": "Task Description",
  "columnId": "todo|progress|done",
  "timestamp": 1234567890
}
```

## Keyboard Shortcuts

- Currently supported via mouse/touch interactions
- Future versions may include keyboard navigation

## Responsive Breakpoints

- **1024px+**: Desktop layout with 3 columns
- **768px - 1024px**: Tablet layout with single column
- **480px - 768px**: Mobile layout with single column
- **Below 480px**: Extra small mobile with minimal spacing

## Features Roadmap

### Planned Features
- 🔐 User authentication and cloud sync
- 📧 Email notifications for tasks
- 🏷️ Task categories and tags
- 📅 Calendar view integration
- 🔍 Search and filter functionality
- 👥 Collaboration and team features
- 🌐 Multiple language support

## Known Limitations

- Data is stored locally in browser (not synced across devices)
- Clearing browser cache will delete all tasks
- No user accounts or authentication
- No collaboration features yet

## Troubleshooting

### Tasks not appearing after refresh?
- Check if Local Storage is enabled in your browser
- Check browser console for errors (F12)

### Modal not closing?
- Click outside the modal or click Cancel button
- Clear browser cache if issues persist

### Drag & drop not working?
- Ensure JavaScript is enabled
- Try on a different browser
- Check if you're using an older browser version

## Performance

- Lightweight: No external dependencies
- Fast: Pure vanilla JavaScript
- Efficient: Optimized DOM operations
- Smooth: Hardware-accelerated animations

## Privacy

- All data stored locally on your device
- No data sent to servers
- No tracking or analytics
- Complete privacy control

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork, modify, and improve this project! 

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation

## Author

**Mayank Rai**
- GitHub: [@MayankRai89](https://github.com/MayankRai89)
- Project: [KanBan Board](https://github.com/MayankRai89/KanBan)
- Link: https://kan-dju2td40v-mayank-rais-projects-1b6da0fa.vercel.app/
## Changelog

### Version 1.0 (Current)
- Initial release
- Kanban board with 3 columns
- Drag and drop functionality
- Task creation and deletion
- 24-hour auto-transfer feature
- Local Storage persistence
- Fully responsive design
- Dark theme with glassmorphism
- Task counters
- Creation timestamps

---

**Last Updated**: January 20, 2026

Enjoy your KanBan board! 🎉
