<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import Spinner from "../components/Spinner.vue";
import InputField from "../components/InputField.vue";
import AddressList from "../components/AddressList.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const customer = ref({
  first_name: "",
  last_name: "",
  email: "",
  mobile: "",
  apartment_number: "",
});
const address = ref({ street:"",avenue: ""})
const isSpinner = ref(false);
onMounted(async () => {
  const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn) {
    router.push({ name: "login" });
  }
});
const streetOptions = [ 1,2,3,4,5,6,7]
const avenueOptions = ["A","B","C","D","E","F","G","H"]

async function addCustomer() {
  if(customer.value.first_name === "") {
      snackbar.value = updateSnackbar("First Name is Empty")
  }
  else if(customer.value.last_name === "") {
    snackbar.value = updateSnackbar("Last name is empty")
  }
  else if(customer.value.email === "") {
    snackbar.value = updateSnackbar("Email is empty")
  }
  else if(customer.value.mobile === "") {
    snackbar.value = updateSnackbar("Mobile is empty")
  }
  else if(address.value.street === "") {
    snackbar.value = updateSnackbar("Street is empty")
  }
  else if(address.value.avenue === "") {
    snackbar.value = updateSnackbar("Avenue is empty")
  }
  else if(customer.value.apartment_number === "") {
    snackbar.value = updateSnackbar("Apartment number is empty")
  }
  else {
    isSpinner.value = true
    await CustomerServices.addCustomer({...customer.value, address: address.value.street+address.value.avenue})
        .then((response) => {
            snackbar.value = updateSnackbar("Customer is created successfully!","green")
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
          <v-card-title class="headline mb-2">Create Customer </v-card-title>
        </div>
        <Spinner v-if="isSpinner" />
        <v-card-text v-else>
          <InputField class="md-3" id="first_name" title="First Name" :value="customer.first_name" @update:value="customer.first_name = $event"/>
          <InputField class="md-3" id="last_name" title="Last Name" :value="customer.last_name" @update:value="customer.last_name = $event"/>
          <InputField class="md-3" id="email" title="Email" :value="customer.email" @update:value="customer.email = $event"/>
          <InputField class="md-3" id="mobile" title="Mobile Number" :value="customer.mobile" @update:value="customer.mobile = $event"/>
          <div style="margin-top:10px"/>
          <AddressList :address="address" />
          <InputField class="md-3" id="apt" title="Apartment Number" :value="customer.apartment_number" @update:value="customer.apartment_number = $event"/> 
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="addCustomer()">Create</v-btn>
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