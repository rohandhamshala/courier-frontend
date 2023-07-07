<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import OrderServices from "../services/OrderServices.js";
import { ref } from "vue";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"
import { getDomainUrl } from "../utils"

const orders = ref([]);
const backup = ref([]);
const spinner = ref(true);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const router = useRouter()
const type = router.currentRoute.value.params.type
const search = ref("");
const filter = ref(0)
const availableOptions = [
  { value: 0, label: 'All' },
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Progress' },
  { value: 3, label: 'Delivered' },
  { value: 4, label: 'Not Assigned' },
];
const pickup_customer_details = ref({})
const drop_customer_details = ref({})
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getOrders();
  spinner.value = false;
});

watch(
      () => router.currentRoute.value.params.type,
      (newType, oldType) => {
        if (newType !== oldType) {
          location.reload();
        }
      }
    );

 watch(
      search,
      (newValue, oldValue) => {
          if(newValue == ""){
            orders.value = backup.value
            return;
          }
          const filteredOrders = backup.value.filter(order => 
          order.id == newValue);
          orders.value = filteredOrders;
      }
    );

 watch(
      filter,
      (newValue, _) => {
        var filteredOrders = backup.value
        if (newValue === 1) {
          filteredOrders = backup.value.filter(order => order.status == "PENDING");
        }
        else if(newValue == 2){
          filteredOrders = backup.value.filter(order => order.status == "PROGRESS");
        }
        else if(newValue == 3){
          filteredOrders = backup.value.filter(order => order.status == "DELIVERED");
        }
        else if(newValue == 4){
          filteredOrders = backup.value.filter(order => !order.delivery_boy_id);
        }
        orders.value = filteredOrders
      }
    );

async function getOrders() {
  await OrderServices.getOrders(type,user.value.id)
    .then((res) => {
      orders.value = res.data;
      backup.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteOrder = async(id,index) => {
    await OrderServices.deleteOrder(id)
    .then((res) => {
      orders.value.splice(index, 1);
      snackbar.value = updateSnackbar("Order is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}
</script>

<template>
<v-container>
  <div style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3>Orders</h3>
      <a class="btn btn-warning create" :href="[ getDomainUrl() + '/okc-couriers/create-order']" style="margin-left:auto;" v-if="user && user.role_id != 3" >Create Order</a>
    </div>
    <br/>
    <div style="display:flex;margin-bottom:10px;">
      <h5 style="margin-top:5px"> Filters </h5>
      <div class="mb-3">
        <select class="form-control" id="dropdown" style="margin-left:20px;" v-model="filter">
          <option v-for="(option, index) in availableOptions" :key="index" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <input class="form-control search" type="search" placeholder="Search" aria-label="Search" v-model="search"/><br/>
    </div>
    <Spinner v-if="spinner" />
     <div class="col-md-12 elevation-4 orders" v-else-if="orders.length != 0">
                <table class="table" style="background-color: white;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">Pickup Customer</th>
                    <th scope="col">Delivery Customer</th>
                    <th v-if="user.role_id != 3"> Delivery Boy </th>
                    <th scope="col">Pickup Time</th>
                    <th scope="col">Price of Order</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Status</th>
                    <th scope="col" v-if="user.role_id != 3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order,index) in orders" :key="index" >
                    <th scope="row">{{ order.id }}</th>
                    <td>{{ order.pickup_customer.first_name }} {{ order.pickup_customer.last_name }}</td>
                    <td>{{ order.delivery_customer.first_name }} {{ order.delivery_customer.last_name }}</td>
                    <td v-if="order.delivery_boy_id && user.role_id != 3">{{ order.delivery_boy_details.firstName }} {{ order.delivery_boy_details.laststName }}</td>
                    <td v-else-if="user.role_id != 3"> Not Assigned</td>
                    <td>{{ order.pickup_time }}</td>
                    <td>${{ order.price_for_order }}</td>
                    <td >{{ order.distance }} Miles</td>
                    <td> {{ order.status }} </td>
                    <td v-if="user.role_id != 3">
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <a type="button" class="btn btn-secondary edit" :href="['/edit-order/'+order.id]">Edit</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteOrder(order.id,index)">Delete</button>
                        <a type="button" class="btn btn-secondary edit" :href="[ getDomainUrl() +'/edit-order/'+order.id]" v-if="!order.delivery_boy_id">Assign</a>
                        </div>         
                    </td>
                    </tr>
                </tbody>
                </table>
    </div>
     <div class="text-center" v-else>
      <h4 class="text-muted">No Orders are available Now.</h4>
      <hr/>
    </div>
  </div>
  <Snackbar :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

.orders {
    background-color: white;
}
.orders {
  padding: 30px;
}
.order {
  margin-top: 30px;
  width:100%;
  border-bottom: 1px solid black;
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