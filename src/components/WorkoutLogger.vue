<template>
  <div class="workout-logger-simple">
    <!-- Header -->
    <div class="logger-header">
      <h2>Workout</h2>
      <input v-model="workoutDate" type="date" class="input date-input-minimal" />
    </div>

    <!-- Template Selection (when not in workout) -->
    <div v-if="!activeWorkout" class="template-selection">
      <h3>Start Workout</h3>

      <div v-if="templates.length > 0" class="templates-quick">
        <button
          v-for="template in templates"
          :key="template.name"
          @click="startFromTemplate(template)"
          class="template-btn"
        >
          <span class="template-emoji">{{ template.icon }}</span>
          <span class="template-text">{{ template.name }}</span>
        </button>
      </div>

      <button @click="showNewTemplate = true" class="btn-secondary btn-full">
        {{ templates.length > 0 ? '+ New Template' : 'Create First Template' }}
      </button>
    </div>

    <!-- Active Workout -->
    <div v-if="activeWorkout" class="active-workout">
      <!-- Current Exercise -->
      <div class="current-exercise-section">
        <div class="exercise-selector">
          <select v-model="currentExerciseIndex" class="input exercise-select">
            <option v-for="(ex, idx) in activeWorkout.exercises" :key="idx" :value="idx">
              {{ ex.name }} ({{ ex.completedSets }}/{{ ex.targetSets }} sets)
            </option>
          </select>
        </div>

        <div v-if="currentExercise" class="current-exercise-card">
          <h3 class="exercise-title">{{ currentExercise.name }}</h3>

          <!-- Previous Sets (completed) -->
          <div v-if="currentExercise.sets.length > 0" class="completed-sets">
            <div class="completed-sets-label">Completed Sets:</div>
            <div class="sets-list">
              <div v-for="(set, idx) in currentExercise.sets" :key="idx" class="completed-set">
                <span class="set-num">{{ idx + 1 }}</span>
                <span class="set-info">{{ set.weight }} lbs × {{ set.reps }} reps</span>
              </div>
            </div>
          </div>

          <!-- Log Next Set -->
          <div class="log-set-section">
            <div class="log-set-label">
              Log Set {{ currentExercise.sets.length + 1 }}
            </div>

            <div class="quick-log-inputs">
              <div class="quick-input-group">
                <label>Weight (lbs)</label>
                <div class="stepper">
                  <button @click="decrementWeight" class="stepper-btn" type="button">−</button>
                  <input
                    v-model.number="nextSet.weight"
                    type="number"
                    inputmode="numeric"
                    class="stepper-value"
                  />
                  <button @click="incrementWeight" class="stepper-btn" type="button">+</button>
                </div>
              </div>

              <div class="quick-input-group">
                <label>Reps</label>
                <div class="stepper">
                  <button @click="decrementReps" class="stepper-btn" type="button">−</button>
                  <input
                    v-model.number="nextSet.reps"
                    type="number"
                    inputmode="numeric"
                    class="stepper-value"
                  />
                  <button @click="incrementReps" class="stepper-btn" type="button">+</button>
                </div>
              </div>
            </div>

            <button @click="logSet" class="btn-log-set">
              ✓ Log Set {{ currentExercise.sets.length + 1 }}
            </button>

            <button
              v-if="currentExercise.sets.length > 0"
              @click="useLastSet"
              class="btn-copy-last"
              type="button"
            >
              Copy Last Set
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Exercise Summary -->
      <div class="workout-summary">
        <h4>Today's Exercises</h4>
        <div class="summary-list">
          <div
            v-for="(ex, idx) in activeWorkout.exercises"
            :key="idx"
            @click="currentExerciseIndex = idx"
            :class="['summary-item', { active: idx === currentExerciseIndex }]"
          >
            <span class="summary-name">{{ ex.name }}</span>
            <span class="summary-sets">{{ ex.sets.length }}/{{ ex.targetSets }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="workout-actions">
        <button @click="finishWorkout" class="btn-primary btn-full">
          Finish Workout
        </button>
        <button @click="cancelWorkout" class="btn-secondary btn-full">
          Cancel
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="savedMessage" class="success-message">
      {{ savedMessage }}
    </div>

    <!-- New Template Modal -->
    <div v-if="showNewTemplate" class="modal-overlay" @click="showNewTemplate = false">
      <div class="modal-content" @click.stop>
        <h3>Create Workout Template</h3>

        <div class="input-group">
          <label>Template Name</label>
          <input
            v-model="newTemplate.name"
            type="text"
            placeholder="e.g., Push Day, Leg Day"
            class="input"
          />
        </div>

        <div class="input-group">
          <label>Icon</label>
          <input
            v-model="newTemplate.icon"
            type="text"
            placeholder="💪"
            class="input"
            maxlength="2"
          />
        </div>

        <div class="input-group">
          <label>Exercises</label>
          <div v-for="(ex, idx) in newTemplate.exercises" :key="idx" class="template-exercise-row">
            <input
              v-model="ex.name"
              type="text"
              placeholder="Exercise name"
              class="input"
              list="exercise-presets"
            />
            <input
              v-model.number="ex.targetSets"
              type="number"
              placeholder="Sets"
              class="input input-small"
              min="1"
            />
            <button @click="removeTemplateExercise(idx)" class="btn-remove-mini">×</button>
          </div>
          <button @click="addTemplateExercise" class="btn-secondary btn-full">
            + Add Exercise
          </button>
        </div>

        <datalist id="exercise-presets">
          <option v-for="preset in exercisePresets" :key="preset" :value="preset" />
        </datalist>

        <div class="modal-actions">
          <button @click="showNewTemplate = false" class="btn-secondary">Cancel</button>
          <button @click="saveTemplate" class="btn-primary" :disabled="!newTemplate.name">
            Save Template
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGymData } from '../composables/useGymData'

const { saveWorkout: saveWorkoutData, markVisit } = useGymData()

const workoutDate = ref(new Date().toISOString().split('T')[0])
const templates = ref([])
const activeWorkout = ref(null)
const currentExerciseIndex = ref(0)
const nextSet = ref({ weight: 0, reps: 0 })
const savedMessage = ref('')
const showNewTemplate = ref(false)
const newTemplate = ref({
  name: '',
  icon: '💪',
  exercises: [{ name: '', targetSets: 3 }]
})

const exercisePresets = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Dips', 'Bicep Curl', 'Tricep Extension', 'Leg Press',
  'Lat Pulldown', 'Leg Curl', 'Leg Extension', 'Romanian Deadlift',
  'Incline Bench Press', 'Face Pulls', 'Lateral Raise', 'Hammer Curl',
  'Calf Raise', 'Bulgarian Split Squat', 'Cable Fly', 'Skull Crusher'
]

const currentExercise = computed(() => {
  if (!activeWorkout.value || currentExerciseIndex.value < 0) return null
  return activeWorkout.value.exercises[currentExerciseIndex.value]
})

// Load templates
onMounted(() => {
  const stored = localStorage.getItem('workoutTemplates')
  if (stored) {
    templates.value = JSON.parse(stored)
  }
})

// Template management
const startFromTemplate = (template) => {
  activeWorkout.value = {
    templateName: template.name,
    exercises: template.exercises.map(ex => ({
      name: ex.name,
      targetSets: ex.targetSets,
      sets: [],
      completedSets: 0
    }))
  }
  currentExerciseIndex.value = 0

  // Pre-fill with previous workout data if available
  // TODO: Could load from history here
}

const addTemplateExercise = () => {
  newTemplate.value.exercises.push({ name: '', targetSets: 3 })
}

const removeTemplateExercise = (idx) => {
  newTemplate.value.exercises.splice(idx, 1)
}

const saveTemplate = () => {
  if (!newTemplate.value.name) return

  const template = {
    name: newTemplate.value.name,
    icon: newTemplate.value.icon || '💪',
    exercises: newTemplate.value.exercises.filter(ex => ex.name.trim())
  }

  templates.value.push(template)
  localStorage.setItem('workoutTemplates', JSON.stringify(templates.value))

  showNewTemplate.value = false
  newTemplate.value = {
    name: '',
    icon: '💪',
    exercises: [{ name: '', targetSets: 3 }]
  }
}

// Set logging
const incrementWeight = () => {
  nextSet.value.weight = (nextSet.value.weight || 0) + 5
}

const decrementWeight = () => {
  nextSet.value.weight = Math.max(0, (nextSet.value.weight || 0) - 5)
}

const incrementReps = () => {
  nextSet.value.reps = (nextSet.value.reps || 0) + 1
}

const decrementReps = () => {
  nextSet.value.reps = Math.max(0, (nextSet.value.reps || 0) - 1)
}

const useLastSet = () => {
  if (currentExercise.value && currentExercise.value.sets.length > 0) {
    const last = currentExercise.value.sets[currentExercise.value.sets.length - 1]
    nextSet.value = { ...last }
  }
}

const logSet = () => {
  if (!currentExercise.value) return
  if (nextSet.value.weight === 0 && nextSet.value.reps === 0) return

  currentExercise.value.sets.push({ ...nextSet.value })
  currentExercise.value.completedSets = currentExercise.value.sets.length

  // Auto-fill next set with same values
  // nextSet.value = { weight: nextSet.value.weight, reps: nextSet.value.reps }

  // Or move to next exercise if target sets reached
  if (currentExercise.value.completedSets >= currentExercise.value.targetSets) {
    const nextIdx = currentExerciseIndex.value + 1
    if (nextIdx < activeWorkout.value.exercises.length) {
      currentExerciseIndex.value = nextIdx
      nextSet.value = { weight: 0, reps: 0 }
    }
  }
}

const finishWorkout = () => {
  if (!activeWorkout.value) return

  const exercises = activeWorkout.value.exercises
    .filter(ex => ex.sets.length > 0)
    .map(ex => ({
      name: ex.name,
      type: 'strength',
      sets: ex.sets
    }))

  if (exercises.length === 0) {
    savedMessage.value = 'No sets logged'
    setTimeout(() => savedMessage.value = '', 3000)
    return
  }

  saveWorkoutData({
    date: workoutDate.value,
    exercises
  })

  markVisit(workoutDate.value, true)

  savedMessage.value = 'Workout saved! 💪'
  setTimeout(() => savedMessage.value = '', 3000)

  activeWorkout.value = null
  currentExerciseIndex.value = 0
  nextSet.value = { weight: 0, reps: 0 }
}

const cancelWorkout = () => {
  if (confirm('Discard this workout?')) {
    activeWorkout.value = null
    currentExerciseIndex.value = 0
    nextSet.value = { weight: 0, reps: 0 }
  }
}
</script>
