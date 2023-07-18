<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import PaymentServices from "../services/PaymentServices.js";
import Spinner from "../components/Spinner.vue";
import InputField from "../components/InputField.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const payment = ref({
  userId: "",
  credited_amount: "",
  description: "",
});
const users = ref({});
const isSpinner = ref(false);

onMounted(async () => {
   const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn) {
    router.push({ name: "login" });
  }
  await getUsers();
  isSpinner.value = false;
});

async function getUsers() {
  await UserServices.getUsers()
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addPayment() {
  if(payment.value.userId === "") {
      snackbar.value = updateSnackbar("User is empty")
  }
  else if(payment.value.description === "") {
        snackbar.value = updateSnackbar("Description is empty")
  }
  else if(payment.value.credited_amount === "") {
        snackbar.value = updateSnackbar("Amount is empty")
  }
  else {
    isSpinner.value = true
    await PaymentServices.addPayment({ ...payment.value})
        .then((response) => {
            snackbar.value = updateSnackbar("Payment Details are stored successfully!","green")
            isSpinner.value = false
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = updateSnackbar(error.response.data.message)
            isSpinner.value = false
        });
  }
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Make Payment </v-card-title>
        </div>
        <Spinner v-if="isSpinner" />
        <v-card-text v-else>
           <div class="mb-3">
            <label for="user" class="form-label">User</label>
            <select class="form-control" id="dropdown" v-model="payment.userId">
              <option value="">Select User</option>
              <option v-for="user in users" :key="user.id" :value="user.id"> {{user.id}}.{{user.firstName}}</option>
            </select>
          </div>
        <InputField class="md-3" id="description" title="Description" :value="payment.description" @update:value="payment.description = $event"/>
        <InputField class="md-3" id="amount" title="Amount Credited" :value="payment.credited_amount" @update:value="payment.credited_amount = $event"/>  
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="addPayment()">Create</v-btn>
        </v-card-actions>
      </v-card>
      <Snackbar :snackbar="snackbar"/>
    </div>
  </v-container>
</template>

<style scoped>
.add {
  margin-right: 20px;
  height: 40px;
  margin-top: 5px;
}
.heading {
    margin-top: 10px;
    justify-content: space-between;
}
</style>