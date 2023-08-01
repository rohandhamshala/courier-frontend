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
import OrderServices from "../services/OrderServices.js";

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
const orders = ref([])
const counts = ref({
        PENDING: 0,
        PROGRESS: 0,
        DELIVERED: 0,
        deliveredInTime: 0
      });

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
  await getReport();
  await getOrders();
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

async function getOrders() {
    const type = user.value.role_id  ==3 ? "noStatus" : "placedByMe"
  await OrderServices.getOrders(type,router.currentRoute.value.params.id || user.value.id)
    .then((res) => {
      orders.value = res.data;
      orders.value.forEach(order => {
        counts.value[order.status]++;
        if (order.delivered_in_time === "YES") {
          counts.value.deliveredInTime++;
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
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
                 <div class="col-6 static">
                <h4> Total Statistics </h4>
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
            <div class="col-6 static" >
                <h4> My Orders Details </h4>
                <p> Pending Orders - {{ counts.PENDING }}</p>
                <p> Progress Orders - {{ counts.PROGRESS }}</p>
                <p> Delivered Orders - {{ counts.DELIVERED }}</p>
                <p> Delivered In Time Orders - {{ counts.deliveredInTime }}</p>
            </div>
            <div class="col-12">
                <Linechart :chartData="lastWeekChartData" style="width:80%;height:400px;" />
            </div>
            <div class="col-6">
                <Barchart :chartData="orderChartData" style="width:500px;height:500px;" />
            </div>
             <div class="col-6">
                <Piechart :chartData="userChartData" style="width:300px;height:300px;" />
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
    width: 50%;
    justify-content: space-between;
}
.static {
    margin-top: 40px;
}
</style>