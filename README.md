# 💪 Gym Tracker PWA

A personal gym tracking Progressive Web App to track your workout habits, exercises, and progress.

## Features

- **Habit Tracker**: Visual calendar to mark gym visits with streak counter
- **Workout Logger**: Log exercises with sets, reps, and weights
- **Cardio Tracking**: Track duration, speed, and distance for cardio workouts
- **Workout History**: View and search through all past workouts
- **Data Export**: Backup your data as JSON
- **PWA Support**: Install on your device and use offline
- **Privacy First**: All data stored locally in your browser

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- Vue 3 (Composition API)
- Vite
- LocalStorage for data persistence
- PWA with service worker for offline support
- Mobile-first responsive design

## Data Storage

All workout data is stored locally in your browser's LocalStorage. Use the Export button to backup your data regularly.

## License

Personal use
