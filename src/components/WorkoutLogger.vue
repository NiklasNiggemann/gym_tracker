<template>
  <div class="workout-logger">
    <h2>Log Workout</h2>

    <div class="workout-form">
      <div class="input-group">
        <label>Date</label>
        <input v-model="workoutDate" type="date" class="input" />
      </div>

      <div class="exercises-list">
        <h3>Exercises</h3>

        <ExerciseEntry
          v-for="(exercise, index) in exercises"
          :key="index"
          :exercise="exercise"
          @remove="removeExercise(index)"
        />

        <button @click="addExercise" class="btn-secondary btn-full">
          + Add Exercise
        </button>
      </div>

      <div class="form-actions">
        <button @click="saveWorkout" class="btn-primary btn-full" :disabled="exercises.length === 0">
          Save Workout
        </button>
      </div>

      <div v-if="savedMessage" class="success-message">
        {{ savedMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGymData } from '../composables/useGymData'
import ExerciseEntry from './ExerciseEntry.vue'

const { saveWorkout: saveWorkoutData, markVisit } = useGymData()

const workoutDate = ref(new Date().toISOString().split('T')[0])
const exercises = ref([])
const savedMessage = ref('')

const addExercise = () => {
  exercises.value.push({
    type: 'strength',
    name: '',
    sets: [{ weight: 0, reps: 0 }]
  })
}

const removeExercise = (index) => {
  exercises.value.splice(index, 1)
}

const saveWorkout = () => {
  if (exercises.value.length === 0) return

  // Clean up exercises before saving
  const cleanedExercises = exercises.value.map(ex => {
    if (ex.type === 'strength') {
      return {
        type: ex.type,
        name: ex.name,
        sets: ex.sets.filter(s => s.weight > 0 || s.reps > 0)
      }
    } else {
      return {
        type: ex.type,
        name: ex.name,
        duration: ex.duration || 0,
        speed: ex.speed || 0,
        distance: ex.distance || 0
      }
    }
  }).filter(ex => {
    return ex.name.trim() !== '' &&
      (ex.type === 'cardio' || (ex.sets && ex.sets.length > 0))
  })

  if (cleanedExercises.length === 0) {
    savedMessage.value = 'Please add at least one exercise with data'
    setTimeout(() => savedMessage.value = '', 3000)
    return
  }

  saveWorkoutData({
    date: workoutDate.value,
    exercises: cleanedExercises
  })

  // Also mark this day as visited
  markVisit(workoutDate.value, true)

  savedMessage.value = 'Workout saved successfully! 💪'
  setTimeout(() => savedMessage.value = '', 3000)

  // Reset form
  exercises.value = []
}
</script>
