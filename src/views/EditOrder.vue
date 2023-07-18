<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"
import InputField from "../components/InputField.vue";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const order = ref(null);
const isSpinner = ref(true);
const user = ref(null);
const orders = ref([]);
const customers = ref([]);
const deliveryBoys = ref([]);
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
  await getOrder();
  await getCustomers();
  await getAvailableDeliveryBoys();
  isSpinner.value = false;
});
const statusOptions =  [
        "PENDING","PROGRESS","DELIVERED"
      ]

async function getOrder() {
    isSpinner.value = true
    await OrderServices.getOrder(router.currentRoute.value.params.id)
        .then((response) => {
            order.value = response.data
            isSpinner.value = false
        })
        .catch((error) => {
            isSpinner.value = false
        });
}


async function updateOrder() {
    if(order.value.status != 'PENDING' && !order.value.delivery_boy_id) {
        snackbar.value = updateSnackbar("Assign the Delivery Boy to change the status!")
        return;
    }
    isSpinner.value = true
    await OrderServices.updateOrder({...order.value,user_id: user.value.id})
        .then((response) => {
            snackbar.value = updateSnackbar("Order is updated successfully!","green")
            isSpinner.value = false
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = updateSnackbar(error.response.data.message)
            isSpinner.value = false
        });
}

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getAvailableDeliveryBoys() {
  await UserServices.getAvailableDeliveryBoys()
    .then((response) => {
      deliveryBoys.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Update Order </v-card-title>
        </div>
        <Spinner v-if="isSpinner" />
        <v-card-text v-else>
          <div class="mb-3">
            <label for="user" class="form-label">Assign Delivery Boy</label>
            <select class="form-control" id="dropdown" v-model="order.delivery_boy_id">
              <option value="">Select Delivery Boy</option>
              <option v-for="deliveryBoy in deliveryBoys" :key="deliveryBoy.id" :value="deliveryBoy.id"> {{deliveryBoy.lastName}} {{deliveryBoy.firstName}}</option>
            </select>
          </div>
          <div class="mb-3">
          <label for="first_name" class="form-label">Pickup Time</label>
          <input type="text" class="form-control" id="first_name" v-model="order.pickup_time"/>
        </div>
        <div class="mb-3">
            <label for="user" class="form-label">Pickup Customer </label>
            <select class="form-control" id="dropdown" v-model="order.pickup_customer_id">
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id"> {{customer.last_name}} {{customer.first_name}}</option>
            </select>
          </div>
        <div class="mb-3">
            <label for="user" class="form-label">Delivery Customer</label>
            <select class="form-control" id="dropdown" v-model="order.delivery_customer_id">
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id"> {{customer.last_name}} {{customer.first_name}}</option>
            </select>
        </div>
        <InputField class="md-3" id="price" title="Price for Order" :value="order.price_for_order" @update:value="order.price_for_order = $event"/>
        <InputField class="md-3" id="price" title="Price for Delivery Boy" :value="order.price_for_delivery_boy" @update:value="order.price_for_delivery_boy = $event"/>
          <div class="mb-3">
              <label for="price" class="form-label">Status </label>
              <select class="form-control" id="dropdown" v-model="order.status" disabled>
              <option v-for="status in statusOptions" :key="status" :value="status"> {{status}}</option>
            </select>
          </div>
        <InputField class="md-3" id="time" title="Time takes to deliver order" :value="order.minimum_time" @update:value="order.minimum_time = $event"/>
        <InputField class="md-3" id="price" title="Distance" :value="order.distance" @update:value="order.distance = $event"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="updateOrder()">Update</v-btn>
        </v-card-actions><br/>
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
.click {
  color: blue;
}
.order_details {
  margin-left: 30px;
}

</style>