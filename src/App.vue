<template>
  <div id="app">
    <header>
      <h1>💪 Gym Tracker</h1>
      <button @click="handleExport" class="btn-export">Export</button>
    </header>

    <main>
      <GymVisitTracker v-if="currentTab === 'visits'" />
      <WorkoutLogger v-if="currentTab === 'log'" />
      <WorkoutHistory v-if="currentTab === 'history'" />
    </main>

    <nav class="bottom-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['nav-item', { active: currentTab === tab.id }]"
        @click="currentTab = tab.id"
      >
        <span class="nav-icon">{{ tab.icon }}</span>
        <span class="nav-label">{{ tab.label }}</span>
      </button>
    </nav>
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
  { id: 'visits', label: 'Visits', icon: '📅' },
  { id: 'log', label: 'Log', icon: '📝' },
  { id: 'history', label: 'History', icon: '📊' }
]

const handleExport = () => {
  exportData()
}
</script>
