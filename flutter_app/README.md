# TaskFlow — Flutter Mobile & Web Front Page

Designed with **Google Stitch** and implemented with **Flutter**, this front page delivers a modern, clean, and minimalist task management experience.

---

## 🎨 Stitch Design System Overview

- **Stitch Project ID**: `1593233930607286075`
- **Stitch Screen**: `projects/1593233930607286075/screens/a1de6b9e6c4744a797d5a4c9b24b4afd`
- **Design System Asset**: `assets/9ac06db391c448a4bbad41f156a03a88`
- **Primary Color**: `#6366F1` (Electric Indigo)
- **Secondary Color**: `#10B981` (Mint Emerald for completion)
- **Warning / Medium**: `#F59E0B` (Warm Amber)
- **High Priority**: `#EF4444` (Soft Coral)
- **Typography**: Plus Jakarta Sans

---

## 📱 Features Implemented in `lib/main.dart`

1. **Header & Greeting**:
   - Personalized morning greeting (`Good morning, Alex 👋`)
   - Current date display
   - Profile avatar and unread notification bell badge
2. **Daily Focus Progress Card**:
   - Circular progress indicator showing live completion percentage
   - Motivational subtext (`Almost there! 6 of 8 completed`)
   - Interactive streak badge (`🔥 12 day streak`) and remaining tasks counter
3. **Quick-Add Input Bar**:
   - Clean inline input field with upward arrow submit button
4. **Horizontal Category Chips**:
   - Scrollable filter chips (`All`, `Work`, `Personal`, `Study`) with active indicator
5. **Interactive Task Cards**:
   - Custom squircle checkboxes with smooth toggle feedback
   - Strike-through typography on completion
   - Color-coded priority badges (`🔥 High`, `⚡ Med`, `🌱 Low`)
   - Scheduled due time badges
   - Three-dot dropdown menu for deleting tasks
6. **Completed Archive**:
   - Dedicated section for completed tasks
7. **Adaptive Navigation & Responsiveness**:
   - Dynamic layout switching: Side **NavigationRail** on tablets/desktops and bottom **NavigationBar** on mobile phones
   - Fluid sizing, constrained container widths for tablets, and touch-optimized hit areas on mobile
8. **Hourly Task Reminders**:
   - Interactive notification bell toggle in the header
   - Color-coded `⏰ Hourly alert` badges displayed on all incomplete tasks until marked completed

---

## 🚀 How to Run

If you have Flutter installed:

```bash
cd flutter_app
flutter pub get
flutter run
```

Or you can open `flutter_app/lib/main.dart` and copy it directly into any Flutter project or [DartPad](https://dartpad.dev).
