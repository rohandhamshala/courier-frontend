<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import OrderServices from "../services/OrderServices.js";
import { ref } from "vue";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"


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
  console.log("type",type)
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
  await OrderServices.getOrders(router.currentRoute.value.params.type,router.currentRoute.value.params.id || user.value.id)
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
const pickedup = async(id,index) => {
    await OrderServices.pickedup(id)
    .then((res) => {
      orders.value[index].pickedup_at = "not null"
      orders.value[index].status = "PROGRESS"
      snackbar.value = updateSnackbar("Order is pickeup successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}
const delivered = async(id,index) => {
    await OrderServices.delivered(id)
    .then((res) => {
      orders.value.splice(index, 1);
      snackbar.value = updateSnackbar("Order is delivered successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}
</script>

<template>
<!-- <v-container> -->
  <div style="margin-top: 20px;margin-left:30px;margin-right:30px;">
    <div style="display: flex; justify-content: center;">
      <h3>Orders</h3>
      <a class="btn btn-warning create" href="/okc-couriers/create-order" style="margin-left:auto;" v-if="user && user.role_id != 3" >Create Order</a>
    </div>
    <br/>
    <div style="display:flex;margin-bottom:10px;" v-if="type != 'my-current-order' && type != 'deliveredByMe'">
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
                    <th scope="col" v-if="type =='deliveredByMe'">Delivered In time</th>
                    <th scope="col" v-if="type =='deliveredByMe'">Bonus</th>
                    <th scope="col" v-if="type !='deliveredByMe'">Actions</th>
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
                    <td v-if="type =='deliveredByMe'"> {{ order.delivered_in_time }} </td>
                    <td scope="col" v-if="type =='deliveredByMe'">{{ order.delivery_boy_bonus }}</td>
                    <td v-if="user.role_id != 3">
                        <div class="btn-group" role="group" aria-label="Basic example" v-if="!order.delivered_at">
                        <a type="button" class="btn btn-secondary edit" :href="['/edit-order/'+order.id]">Edit</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteOrder(order.id,index)">Delete</button>
                        </div>         
                    </td>
                      <td v-if="user.role_id == 3 && !order.delivered_at">
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-secondary edit" v-if="!order.pickedup_at" @click="pickedup(order.id,index)">Picked Up</button>
                        <button type="button" class="btn btn-secondary edit" v-if="!order.delivered_at && order.pickedup_at" @click="delivered(order.id,index)">Delivered</button>
                        </div>         
                    </td>
                    <td>
                        <a type="button" class="btn btn-secondary edit" :href="['/orderDetails/'+order.id]">View Order</a>
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
<!-- </v-container> -->

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