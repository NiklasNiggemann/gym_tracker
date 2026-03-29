<template>
  <div id="app">
    <header>
      <h1>💪 Gym Tracker</h1>
      <button @click="handleExport" class="btn-export">Export Data</button>
    </header>

    <nav class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <main>
      <GymVisitTracker v-if="currentTab === 'visits'" />
      <WorkoutLogger v-if="currentTab === 'log'" />
      <WorkoutHistory v-if="currentTab === 'history'" />
    </main>

    <footer>
      <p>Your data is stored locally on this device</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GymVisitTracker from './components/GymVisitTracker.vue'
import WorkoutLogger from './components/WorkoutLogger.vue'
import WorkoutHistory from './components/WorkoutHistory.vue'
import { useGymData } from './composables/useGymData'

const { exportData } = useGymData()

const currentTab = ref('visits')

const tabs = [
  { id: 'visits', label: 'Visits' },
  { id: 'log', label: 'Log Workout' },
  { id: 'history', label: 'History' }
]

const handleExport = () => {
  exportData()
}
</script>
