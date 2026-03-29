import { ref, computed } from 'vue'

const STORAGE_KEY = 'gym_tracker_data'

// Initialize data structure
const defaultData = {
  visits: [],
  workouts: []
}

// Load data from localStorage
function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : defaultData
  } catch (error) {
    console.error('Error loading data:', error)
    return defaultData
  }
}

// Save data to localStorage
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

export function useGymData() {
  const data = ref(loadData())

  // Get all visits
  const getVisits = computed(() => data.value.visits)

  // Check if visited on a specific date
  const hasVisitedOn = (date) => {
    return data.value.visits.some(v => v.date === date && v.visited)
  }

  // Mark gym visit for a date
  const markVisit = (date, visited = true) => {
    const existingIndex = data.value.visits.findIndex(v => v.date === date)

    if (existingIndex >= 0) {
      data.value.visits[existingIndex].visited = visited
    } else {
      data.value.visits.push({ date, visited })
    }

    saveData(data.value)
  }

  // Get current streak
  const getCurrentStreak = computed(() => {
    if (data.value.visits.length === 0) return 0

    const sortedVisits = [...data.value.visits]
      .filter(v => v.visited)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const visit of sortedVisits) {
      const visitDate = new Date(visit.date)
      visitDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((currentDate - visitDate) / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }

    return streak
  })

  // Get workouts
  const getWorkouts = computed(() => {
    return [...data.value.workouts].sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  // Get workouts for a specific date
  const getWorkoutsByDate = (date) => {
    return data.value.workouts.filter(w => w.date === date)
  }

  // Save a new workout
  const saveWorkout = (workout) => {
    const newWorkout = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: workout.date || new Date().toISOString().split('T')[0],
      exercises: workout.exercises || []
    }

    data.value.workouts.push(newWorkout)
    saveData(data.value)

    return newWorkout.id
  }

  // Delete a workout
  const deleteWorkout = (id) => {
    data.value.workouts = data.value.workouts.filter(w => w.id !== id)
    saveData(data.value)
  }

  // Export data as JSON
  const exportData = () => {
    const dataStr = JSON.stringify(data.value, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gym-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Import data from JSON
  const importData = (jsonData) => {
    try {
      const imported = JSON.parse(jsonData)
      data.value = imported
      saveData(data.value)
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  return {
    getVisits,
    hasVisitedOn,
    markVisit,
    getCurrentStreak,
    getWorkouts,
    getWorkoutsByDate,
    saveWorkout,
    deleteWorkout,
    exportData,
    importData
  }
}
