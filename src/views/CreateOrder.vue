<script setup>
import { onMounted, watch } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";
import Spinner from "../components/Spinner.vue";
import CreateCustomer from "./CreateCustomer.vue";
import CustomerDetails from "../components/CustomerDetails.vue";
import InputField from "../components/InputField.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const order = ref({
  pickup_time: "",
  pickup_customer_id: "",
  delivery_customer_id: "",
  mobile: "",
  address: "",
  apartment_number: "",
});
const pickup_customer_details = ref({})
const drop_customer_details = ref({})

const isSpinner = ref(true);
const user = ref(null);
const customers = ref([]);

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getCustomers();
  isSpinner.value = false;
});
const orderDetailsRetrieved = ref(null)

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getOrderDetails() {
  if(order.value.pickup_customer_id === "") {
      snackbar.value = updateSnackbar("Pickup Customer is empty!")
  }
  else if(order.value.delivery_customer_id === "") {
      snackbar.value = updateSnackbar("Delivery Customer is empty!")
  }
  else {
    isSpinner.value = true
    await OrderServices.calculateOrderDetails({pickup_address: pickup_customer_details.value.address, delivery_address: drop_customer_details.value.address})
        .then((response) => {
            snackbar.value = updateSnackbar("order details retrieved successfully!","green")
            isSpinner.value = false
            orderDetailsRetrieved.value = response.data
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = updateSnackbar(error.response.data.message)
            isSpinner.value = false
        });
  }
}
async function addOrder() {
    isSpinner.value = true
    await OrderServices.addOrder({...order.value,...orderDetailsRetrieved.value, user_id: user.value.id})
        .then((response) => {
            isSpinner.value = false
            snackbar.value = updateSnackbar("order created successfully!","green")
            console.log("res",response)
        })
        .catch((error) => {
            console.log(error);
            snackbar.value = updateSnackbar(error.response.data.message)
            isSpinner.value = false
        });
}

 watch(
      pickup_customer_details,
      (newValue, oldValue) => {
          order.value.pickup_customer_id = newValue?.id || ""
      }
    );
  
  watch(
      drop_customer_details,
      (newValue, oldValue) => {
          order.value.delivery_customer_id = newValue?.id || ""
      }
    );


</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Create Order </v-card-title>
        </div>
        <Spinner v-if="isSpinner" />
        <v-card-text v-else>
          <div class="md-3" style="margin-bottom:10px">
            <label for="pickuptime" class="form-label">Pickup Date and Time</label>
            <input
              type="datetime-local"
              class="form-control"
              id="pickuptime"
              v-model="order.pickup_time"
            />
          </div>
        <div class="mb-3">
            <label for="user" class="form-label">Pickup Customer </label>
            <select class="form-control" id="dropdown" v-model="pickup_customer_details">
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.last_name}} {{customer.first_name}}</option>
            </select>
        </div>
        <CustomerDetails :customer="pickup_customer_details" v-if="pickup_customer_details.id"/>
        <div class="mb-3">
            <label for="user" class="form-label">Delivery Customer</label>
            <select class="form-control" id="dropdown" v-model="drop_customer_details">
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.last_name}} {{customer.first_name}}</option>
            </select>
        </div>
        <CustomerDetails :customer="drop_customer_details" v-if="drop_customer_details.id"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="getOrderDetails()">Next</v-btn>
        </v-card-actions><br/>
        <div v-if="orderDetailsRetrieved != null" class="order_details">
          <h3 style="text-decoration:underline;">Order Details</h3>
          <InputField class="md-3 details" id="price" title="Price for Order" :value="orderDetailsRetrieved.price_for_order" disabled="true" />
          <InputField class="md-3 details" id="time" title="Time takes to deliver order" :value="orderDetailsRetrieved.minimum_time" disabled="true"/>
          <InputField class="md-3 details" id="distance" title="Distance" :value="orderDetailsRetrieved.distance" disabled="true"/>
          <v-card-actions>
            <v-btn variant="flat" class="create" color="primary" @click="addOrder()">Place Order</v-btn>
          </v-card-actions><br/>
        </div>
      </v-card>
      <Snackbar :snackbar="snackbar"/>
    </div>
     <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
           <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <CreateCustomer />
        </div>
      </div>
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
.details {
  width: 30%;
}
.create {
  margin-left:40%;
}
</style>