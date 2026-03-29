<template>
  <div class="exercise-entry-modern">
    <div class="exercise-header-modern">
      <input
        v-model="exercise.name"
        type="text"
        placeholder="Exercise name (e.g., Bench Press)"
        class="input exercise-name-input"
        list="exercise-suggestions"
      />
      <button @click="$emit('remove')" class="btn-remove-exercise" aria-label="Remove exercise">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <datalist id="exercise-suggestions">
      <option v-for="preset in exercisePresets" :key="preset" :value="preset" />
    </datalist>

    <!-- Sets Container -->
    <div class="sets-container-modern">
      <div v-for="(set, index) in exercise.sets" :key="index" class="set-row-modern">
        <div class="set-badge">{{ index + 1 }}</div>

        <div class="set-inputs">
          <div class="input-stepper">
            <label class="stepper-label">Weight</label>
            <div class="stepper-controls">
              <button @click="decrementWeight(index)" class="stepper-btn" type="button">−</button>
              <input
                v-model.number="set.weight"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                class="stepper-input"
              />
              <button @click="incrementWeight(index)" class="stepper-btn" type="button">+</button>
            </div>
            <span class="stepper-unit">lbs</span>
          </div>

          <div class="input-stepper">
            <label class="stepper-label">Reps</label>
            <div class="stepper-controls">
              <button @click="decrementReps(index)" class="stepper-btn" type="button">−</button>
              <input
                v-model.number="set.reps"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                class="stepper-input"
              />
              <button @click="incrementReps(index)" class="stepper-btn" type="button">+</button>
            </div>
            <span class="stepper-unit">reps</span>
          </div>
        </div>

        <button
          v-if="exercise.sets.length > 1"
          @click="removeSet(index)"
          class="btn-remove-set"
          type="button"
          aria-label="Remove set"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="set-actions">
        <button @click="addSet" class="btn-add-set" type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add Set
        </button>
        <button
          v-if="exercise.sets.length > 0"
          @click="duplicateLastSet"
          class="btn-duplicate-set"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="5" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 3H12C12.5523 3 13 3.44772 13 4V11" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Copy Last
        </button>
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
  // Compound Lifts
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  // Upper Body
  'Pull-ups', 'Dips', 'Bicep Curl', 'Tricep Extension', 'Lat Pulldown',
  'Chest Fly', 'Incline Bench Press', 'Face Pulls', 'Hammer Curl',
  // Lower Body
  'Leg Press', 'Leg Curl', 'Leg Extension', 'Romanian Deadlift',
  'Bulgarian Split Squat', 'Calf Raise', 'Lunges',
  // Shoulders & Back
  'Shoulder Press', 'Lateral Raise', 'Shrugs', 'T-Bar Row'
]

const addSet = () => {
  if (!props.exercise.sets) {
    props.exercise.sets = []
  }
  const lastSet = props.exercise.sets[props.exercise.sets.length - 1]
  props.exercise.sets.push({
    weight: lastSet?.weight || 0,
    reps: lastSet?.reps || 0
  })
}

const duplicateLastSet = () => {
  if (props.exercise.sets.length > 0) {
    const lastSet = props.exercise.sets[props.exercise.sets.length - 1]
    props.exercise.sets.push({ ...lastSet })
  }
}

const removeSet = (index) => {
  props.exercise.sets.splice(index, 1)
}

// Weight steppers
const incrementWeight = (index) => {
  const set = props.exercise.sets[index]
  set.weight = (set.weight || 0) + 5
}

const decrementWeight = (index) => {
  const set = props.exercise.sets[index]
  set.weight = Math.max(0, (set.weight || 0) - 5)
}

// Reps steppers
const incrementReps = (index) => {
  const set = props.exercise.sets[index]
  set.reps = (set.reps || 0) + 1
}

const decrementReps = (index) => {
  const set = props.exercise.sets[index]
  set.reps = Math.max(0, (set.reps || 0) - 1)
}
</script>
