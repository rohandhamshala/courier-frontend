<template>
  <div class="chart">
    <Bar :data="chartData" />
   </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: {
        type: Object,
        required: true
      }
  }
}
</script>
<style scoped>
/* .chart {
  width: 500px;
  height: 500px;
} */
</style>