<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import ReportServices from "../services/ReportServices.js";
import { ref } from "vue";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import Barchart from "../components/Barchart.vue";
import Piechart from "../components/Piechart.vue";
import Linechart from "../components/Linechart.vue";
import { updateSnackbar } from "../utils"

const report = ref(null)
const spinner = ref(true);
const router = useRouter();
const user = ref(null);
const id = null
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const lastWeekChartData = ref([])
const userChartData = ref([])
const orderChartData = ref([])
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
  await getReport();
  spinner.value = false;
});

async function getReport() {
  await ReportServices.getReport()
    .then((res) => {
        report.value = res.data
        generateCharts(res.data)
    })
    .catch((error) => {
      console.log(error);
    });
}
const generateCharts = (data) => {
        generateLastWeekChart(data)
        generateUsersChart(data)
        generateOrdersChart(data)
}
const generateLastWeekChart = (data) =>{
    const lastWeekLabels= data.weeklyReport.map((item) => item.date);
    const lastWeekDeliveredOrders = data.weeklyReport.map((item) => item.delivered);
    lastWeekChartData.value = {
    labels: lastWeekLabels,
    datasets: [
        {
        label: 'Last Week Delivered Orders',
        backgroundColor: '#f87979',
        data: lastWeekDeliveredOrders
        }
    ]
    }
}
const generateOrdersChart = (data) =>{
    const orderLabels= ["Total Pending Orders","Total Progress Orders","Total Delivered Orders"];
    const orderData = [data.pendingOrdersCount,data.progressOrdersCount,data.deliveredOrdersCount];
    orderChartData.value = {
    labels: orderLabels,
    datasets: [
        {
        label: 'Orders',
        backgroundColor: '#1877f2',
        data: orderData
        }
    ]
    }
}
const generateUsersChart = (data) =>{
    const userLabels= ["Admin","Clerk","Courier"];
    const userData = [data.adminCount,data.clerkCount,data.deliveryBoyCount];
    userChartData.value = {
    labels: userLabels,
    datasets: [
        {
        label: 'User List',
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: userData
        }
    ]
    }
}
</script>

<template>
<v-container>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex;">
      <h3>Dashboard</h3>
    </div>
    <br/>
    <Spinner v-if="spinner" />
    <div class="col-md-12 container elevation-4 report" v-else-if="report">
        <div class="row">
            <div class="col-6">
                <Linechart :chartData="lastWeekChartData" />
            </div>
            <div class="col-6">
                <Barchart :chartData="orderChartData" />
            </div>
             <div class="col-6">
                <Piechart :chartData="userChartData" />
            </div>
             <div class="col-6 static">
                <div class="report-static-data">
                     <p> Total Orders </p>
                    <h4> {{ report.orderCount }} </h4> 
                </div>
                 <div class="report-static-data">
                     <p> Delivered Orders </p>
                    <h4> {{ report.deliveredOrdersCount }} </h4> 
                </div>
                <div class="report-static-data">
                    <p> Delivered in Time </p>
                    <h4> {{ report.deliveryInTimeCount }} </h4> 
                </div>
                <div class="report-static-data">
                     <p> Orders Amount </p>
                    <h4> {{ report.totalOrderAmount }} </h4> 
                </div>
                 <div class="report-static-data">
                     <p> Orders Amount for Courier Boys </p>
                    <h4> {{ report.deliveryBoyAmountForOrders.toFixed(2) }} </h4> 
                </div>
                <div class="report-static-data">
                     <p> Remaining Amount </p>
                    <h4> {{ report.totalOrderAmount - report.deliveryBoyAmountForOrders.toFixed(2) }} </h4> 
                </div>
                  
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
      <h4 class="text-muted">Unable to fetch data</h4>
      <hr/>
    </div>
  <Snackbar :snackbar="snackbar"/>
  <br/>
  </div>
</v-container>
</template>

<style scoped>
.report {
    background-color: white;
    padding: 30px;
}
.col-6{
    margin-bottom: 50px;
}
.report-static-data {
    display: flex;
    width: 40%;
    justify-content: space-between;
}
.static {
    margin-top: 40px;
}
</style>