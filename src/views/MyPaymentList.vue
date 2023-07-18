<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import PaymentServices from "../services/PaymentServices.js";
import { ref } from "vue";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"

const payments = ref([]);
const spinner = ref(true);
const router = useRouter();
const user = ref(null);
const id = null
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const totalAmount = ref(0)
onMounted(async () => {
   user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
  await getPayments();
  await getTotalCreditedAmount();
  spinner.value = false;
});

async function getPayments() {
  await PaymentServices.getPayments(user.value.id)
    .then((res) => {
      payments.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getTotalCreditedAmount() {
    await PaymentServices.getTotalCreditedAmount(user.value.id)
    .then((res) => {
      totalAmount.value = res.data.total_credited_amount;
    })
    .catch((error) => {
      console.log(error);
    });
}
const deletePayment = async(id,index) => {
    await PaymentServices.deletePayment(id)
    .then((res) => {
      users.value.splice(index, 1);
      snackbar.value = updateSnackbar("Payment is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}
</script>

<template>
<v-container>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3>My Payments</h3>
    </div>
    <br/>
    <Spinner v-if="spinner" />
    <div class="col-md-12 container elevation-4 payments" v-else-if="payments.length != 0">
      <h5 v-if="totalAmount">Total Amount Received: $ {{ totalAmount }}</h5>
      <div v-for="(payment) in payments" :key="payment.id">
        <div class="payment">
          <table class="table" style="background-color: white;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">Credited Amount</th>
                    <th scope="col">Credited Date</th>
                    <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(payment,index) in payments" :key="index" >
                    <th scope="row">{{ payment.id }}</th>
                    <td>{{ payment.credited_amount }}</td>
                    <td>{{ payment.credited_date }}</td>
                    <td>{{ payment.description }}</td>
                    </tr>
                </tbody>
                </table>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <h4 class="text-muted">No Payments Received</h4>
      <hr/>
    </div>
  </div>
  <Snackbar :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

.payments {
  padding: 30px;
  background-color: white;
}
.getplan {
    color: white;
    background-color: #80162B;
}
.payments {
  padding: 30px;
}
.payment {
  margin-top: 30px;
  width:100%;
  padding:15px;
  margin-left: 20px;
}
.btn-danger {
  margin-left: 20px;
}
.users{
  margin-top: 20px;
  margin-bottom: 20px;
}

.create {
    background-color: #1877f2 ;
    margin-left: 20px;
    padding-top: -10px;
    color: white;
}
.edit {
  background-color: #198754;
  color: white;
}
.delete {
  background-color: #dc3545;
  color: white;
}
</style>