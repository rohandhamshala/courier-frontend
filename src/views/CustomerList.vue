<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import { ref } from "vue";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"
import { getDomainUrl } from "../utils"

const customers = ref([]);
const spinner = ref(true);
const user = ref(null);
const router = useRouter();
const type = router.currentRoute.value.params.type
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const backup = ref([])
const search = ref("")
onMounted(async () => {
   user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getCustomers();
  spinner.value = false;
});

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((res) => {
      customers.value = res.data;
      backup.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteCustomer = async(id,index) => {
    await CustomerServices.deleteCustomer(id)
    .then((res) => {
      users.value.splice(index, 1);
      snackbar.value = updateSnackbar("Customer is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}
 watch(
      search,
      (newValue, oldValue) => {
          const filteredCustomers = backup.value.filter(customer => 
          customer.first_name.toLowerCase().includes(newValue.toLowerCase()) ||
          customer.last_name.toLowerCase().includes(newValue.toLowerCase()) ||
          customer.email.toLowerCase().includes(newValue.toLowerCase()) ||
          customer.mobile.toLowerCase().includes(newValue.toLowerCase())
          );
          customers.value = filteredCustomers;
      }
    );
</script>

<template>
<v-container>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3>Customer list</h3>
    <a class="btn btn-warning create" :href="[ getDomainUrl() +'/create-customer']" style="margin-left:auto;" >Create Customer</a>
    </div>
    <br/>
    <input class="form-control search" type="search" placeholder="Search" aria-label="Search" v-model="search"/><br/>
    <Spinner v-if="spinner" />
    <div class="col-md-12 container elevation-4 customers" v-else-if="customers.length != 0">
             <table class="table" style="background-color: white;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Apartment Number</th>
                    <th scope="col">Address</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(customer,index) in customers" :key="index" >
                    <th scope="row">{{ index+1 }}</th>
                    <td>{{ customer.first_name }}</td>
                    <td>{{ customer.last_name }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.mobile }}</td>
                    <td>{{ customer.apartment_number }}</td>
                    <td>{{ customer.address }}</td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <a type="button" class="btn btn-secondary edit" :href="[ getDomainUrl() +'/edit-customer/'+customer.id]">Edit</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteCustomer(customer.id,index)">Delete</button>
                        </div>         
                    </td>
                    </tr>
                </tbody>
                </table>
          </div>
      <div class="text-center" v-else>
      <h4 class="text-muted">No Customers are available</h4>
      <hr/>
    </div>
    </div>
    <Snackbar :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

.getplan {
    color: white;
    background-color: #80162B;
}
.customers {
  padding: 30px;
  background-color: white;
}
.booking {
  margin-top: 30px;
  width:100%;
  border-bottom: 1px solid black;
  padding:15px;
  margin-left: 20px;
}
.btn-danger {
  margin-left: 20px;
}
.customers{
  margin-top: 20px;
  margin-bottom: 20px;
}
.underline {
  border-bottom: 2px solid black;
  width: 40%;
  margin-bottom: 10px;
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
.search {
  margin-left: 70%;
  width: 30%;
}
</style>