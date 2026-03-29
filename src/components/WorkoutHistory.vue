<template>
  <div class="workout-history">
    <h2>Workout History</h2>

    <div class="history-stats">
      <div class="stat-card">
        <div class="stat-value">{{ totalWorkouts }}</div>
        <div class="stat-label">Total Workouts</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ uniqueExercises }}</div>
        <div class="stat-label">Unique Exercises</div>
      </div>
    </div>

    <div class="filter-section">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search exercises..."
        class="input"
      />
    </div>

    <div v-if="filteredWorkouts.length === 0" class="empty-state">
      <p>No workouts logged yet. Start tracking your progress!</p>
    </div>

    <div class="workouts-list">
      <div
        v-for="workout in filteredWorkouts"
        :key="workout.id"
        class="workout-card"
      >
        <div class="workout-header" @click="toggleWorkout(workout.id)">
          <div class="workout-date">
            <strong>{{ formatDate(workout.date) }}</strong>
            <span class="exercise-count">{{ workout.exercises.length }} exercises</span>
          </div>
          <button class="btn-expand">
            {{ expandedWorkouts.has(workout.id) ? '−' : '+' }}
          </button>
        </div>

        <div v-if="expandedWorkouts.has(workout.id)" class="workout-details">
          <div
            v-for="(exercise, index) in workout.exercises"
            :key="index"
            class="exercise-detail"
          >
            <h4>{{ exercise.name }}</h4>

            <div v-if="exercise.type === 'strength'" class="sets-detail">
              <div v-for="(set, setIndex) in exercise.sets" :key="setIndex" class="set-detail">
                Set {{ setIndex + 1 }}: {{ set.weight }} lbs × {{ set.reps }} reps
              </div>
            </div>

            <div v-if="exercise.type === 'cardio'" class="cardio-detail">
              <div v-if="exercise.duration">Duration: {{ exercise.duration }} min</div>
              <div v-if="exercise.speed">Speed: {{ exercise.speed }} mph</div>
              <div v-if="exercise.distance">Distance: {{ exercise.distance }} miles</div>
            </div>
          </div>

          <button @click="confirmDelete(workout.id)" class="btn-danger btn-small">
            Delete Workout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGymData } from '../composables/useGymData'

const { getWorkouts, deleteWorkout } = useGymData()

const searchTerm = ref('')
const expandedWorkouts = ref(new Set())

const totalWorkouts = computed(() => getWorkouts.value.length)

const uniqueExercises = computed(() => {
  const exercises = new Set()
  getWorkouts.value.forEach(workout => {
    workout.exercises.forEach(ex => {
      exercises.add(ex.name)
    })
  })
  return exercises.size
})

const filteredWorkouts = computed(() => {
  if (!searchTerm.value) return getWorkouts.value

  const term = searchTerm.value.toLowerCase()
  return getWorkouts.value.filter(workout =>
    workout.exercises.some(ex => ex.name.toLowerCase().includes(term))
  )
})

const toggleWorkout = (id) => {
  if (expandedWorkouts.value.has(id)) {
    expandedWorkouts.value.delete(id)
  } else {
    expandedWorkouts.value.add(id)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const confirmDelete = (id) => {
  if (confirm('Are you sure you want to delete this workout?')) {
    deleteWorkout(id)
    expandedWorkouts.value.delete(id)
  }
}
</script>
