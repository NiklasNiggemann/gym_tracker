<template>
  <div class="exercise-entry">
    <div class="exercise-header">
      <select v-model="exercise.type" class="input">
        <option value="strength">Strength</option>
        <option value="cardio">Cardio</option>
      </select>
      <button @click="$emit('remove')" class="btn-danger">×</button>
    </div>

    <div class="exercise-body">
      <input
        v-model="exercise.name"
        type="text"
        placeholder="Exercise name"
        class="input"
        list="exercise-suggestions"
      />

      <datalist id="exercise-suggestions">
        <option v-for="preset in exercisePresets" :key="preset" :value="preset" />
      </datalist>

      <!-- Strength Exercise Fields -->
      <div v-if="exercise.type === 'strength'" class="sets-container">
        <div class="sets-header">
          <h4>Sets</h4>
          <button @click="addSet" class="btn-secondary">+ Add Set</button>
        </div>

        <div v-for="(set, index) in exercise.sets" :key="index" class="set-row">
          <span class="set-number">Set {{ index + 1 }}</span>
          <input
            v-model.number="set.weight"
            type="number"
            placeholder="Weight (lbs)"
            class="input input-small"
            step="5"
          />
          <input
            v-model.number="set.reps"
            type="number"
            placeholder="Reps"
            class="input input-small"
          />
          <button @click="removeSet(index)" class="btn-danger-small">×</button>
        </div>
      </div>

      <!-- Cardio Exercise Fields -->
      <div v-if="exercise.type === 'cardio'" class="cardio-fields">
        <div class="input-group">
          <label>Duration (min)</label>
          <input
            v-model.number="exercise.duration"
            type="number"
            placeholder="20"
            class="input"
            step="1"
          />
        </div>

        <div class="input-group">
          <label>Speed (mph)</label>
          <input
            v-model.number="exercise.speed"
            type="number"
            placeholder="6.5"
            class="input"
            step="0.1"
          />
        </div>

        <div class="input-group">
          <label>Distance (miles)</label>
          <input
            v-model.number="exercise.distance"
            type="number"
            placeholder="2.17"
            class="input"
            step="0.01"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove'])

const exercisePresets = [
  // Strength
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Dips', 'Bicep Curl', 'Tricep Extension', 'Leg Press',
  'Lat Pulldown', 'Leg Curl', 'Leg Extension', 'Shoulder Press',
  // Cardio
  'Treadmill', 'Elliptical', 'Stationary Bike', 'Rowing Machine', 'Stair Climber'
]

const addSet = () => {
  if (!props.exercise.sets) {
    props.exercise.sets = []
  }
  props.exercise.sets.push({ weight: 0, reps: 0 })
}

const removeSet = (index) => {
  props.exercise.sets.splice(index, 1)
}
</script>
