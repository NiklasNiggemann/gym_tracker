<template>
  <div class="visit-tracker">
    <h2>Gym Visits</h2>

    <div class="streak-display">
      <div class="streak-number">{{ currentStreak }}</div>
      <div class="streak-label">Day Streak 🔥</div>
    </div>

    <div class="quick-actions">
      <button
        @click="toggleToday"
        :class="['btn-primary', { 'visited': visitedToday }]"
      >
        {{ visitedToday ? '✓ Visited Today' : 'Mark Today as Visited' }}
      </button>
    </div>

    <div class="calendar">
      <div class="calendar-header">
        <button @click="previousMonth" class="btn-nav">&lt;</button>
        <h3>{{ currentMonthName }} {{ currentYear }}</h3>
        <button @click="nextMonth" class="btn-nav">&gt;</button>
      </div>

      <div class="calendar-grid">
        <div class="day-header" v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">
          {{ day }}
        </div>

        <div
          v-for="day in calendarDays"
          :key="day.key"
          :class="['calendar-day', {
            'empty': !day.date,
            'visited': day.visited,
            'today': day.isToday
          }]"
          @click="day.date && toggleVisit(day.dateString)"
        >
          {{ day.date }}
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">{{ thisMonthVisits }}</div>
        <div class="stat-label">This Month</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ thisWeekVisits }}</div>
        <div class="stat-label">This Week</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGymData } from '../composables/useGymData'

const { getVisits, hasVisitedOn, markVisit, getCurrentStreak } = useGymData()

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const currentMonthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long' })
})

const currentStreak = computed(() => getCurrentStreak.value)

const todayString = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const visitedToday = computed(() => {
  return hasVisitedOn(todayString.value)
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const days = []

  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ key: `empty-${i}`, date: null })
  }

  // Add all days of the month
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const dateObj = new Date(currentYear.value, currentMonth.value, date)
    const dateString = dateObj.toISOString().split('T')[0]
    const isToday = dateString === todayString.value

    days.push({
      key: dateString,
      date,
      dateString,
      visited: hasVisitedOn(dateString),
      isToday
    })
  }

  return days
})

const thisMonthVisits = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).toISOString().split('T')[0]
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0).toISOString().split('T')[0]

  return getVisits.value.filter(v =>
    v.visited && v.date >= firstDay && v.date <= lastDay
  ).length
})

const thisWeekVisits = computed(() => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startString = startOfWeek.toISOString().split('T')[0]

  return getVisits.value.filter(v =>
    v.visited && v.date >= startString
  ).length
})

const toggleToday = () => {
  markVisit(todayString.value, !visitedToday.value)
}

const toggleVisit = (dateString) => {
  markVisit(dateString, !hasVisitedOn(dateString))
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}
</script>
