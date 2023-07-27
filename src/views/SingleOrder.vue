<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import OrderServices from "../services/OrderServices.js";
import { ref } from "vue";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"
import html2pdf from 'html2pdf.js';


const order = ref([]);
const spinner = ref(true);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const path = ref(null)
const router = useRouter()

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getOrder();
  spinner.value = false;
});

async function getOrder() {
  await OrderServices.getOrder(router.currentRoute.value.params.id)
    .then((res) => {
      order.value = res.data;
      findPath(res.data.pickup_customer.address,res.data.delivery_customer.address)
      console.log("order",res.data)
    })
    .catch((error) => {
      console.log(error);
    });
}

const findPath = async(pickup_address,delivery_address)=>{
  await OrderServices.findPath({ pickup_address, delivery_address})
      .then((res) => {
        path.value = res.data
      })
      .catch((error) => {
        console.log(error);
        snackbar.value = updateSnackbar(error.response.data.message)
      });
}

const deleteOrder = async() => {
    await OrderServices.deleteOrder(order.value.id)
    .then((res) => {
      snackbar.value = updateSnackbar("Order is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}
const pickedup = async() => {
    await OrderServices.pickedup(order.value.id)
    .then((res) => {
      snackbar.value = updateSnackbar("Order is pickeup successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}
const delivered = async() => {
    await OrderServices.delivered(order.value.id)
    .then((res) => {
      snackbar.value = updateSnackbar("Order is delivered successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = updateSnackbar(error.response.data.message)
    });
}

const downloadInvoice = () =>{
  const invoice = order.value
   // Generate the HTML content for the invoice
      const invoiceHTML = `
         <html>
        <head>
          <style>
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }
          table {
              width: 80%;
          }
          td {
              width: 80%;
              padding: 10px;
          }
          th {
              padding-left: 10px;
          }
          .flex {
              display: flex;
              justify-content: space-around;
          }
          </style>
        </head>
        <body>
          <h3>Invoice for Order ID: ${invoice.id}</h3>
          <div class="flex">
          <table>
                <tr>
                <th>Price to Deliver</th>
                <td>$ ${ invoice.price_for_order}</td>
                </tr>
                <tr>
                <th>Distance</th>
                <td> ${ invoice.distance } Miles</td>
                </tr>
                <tr>
                <th>Order Created At</th>
                <td> ${ invoice.createdAt } </td>
                </tr>
                <tr>
                <th>Picked up At</th>
                <td> ${ invoice.pickedup_at } </td>
                </tr>
                <tr>
                 <th>Delivered in time</th>
                <td> ${ invoice.delivered_in_time } </td>
                </tr>
                 <tr>
                 <th>Pickup Details</th>
                <td> 
                    <p> Name - ${ invoice.pickup_customer.first_name} ${ invoice.pickup_customer.last_name} <br/>
                     Email - ${ invoice.pickup_customer.email} <br/>
                     Mobile - ${ invoice.pickup_customer.mobile} <br/>
                     Address - ${ invoice.pickup_customer.address} <br/>
                     Apt Number - ${ invoice.pickup_customer.apartment_number} </p>
                </td>
                </tr>
                <tr>
                <th>Delivery Details</th>
                <td> 
                    <p> Name - ${ invoice.delivery_customer.first_name} ${ invoice.delivery_customer.last_name} <br/>
                     Email - ${ invoice.delivery_customer.email} <br/>
                     Mobile - ${ invoice.delivery_customer.mobile} <br/>
                     Address - ${ invoice.delivery_customer.address} <br/>
                     Apt Number - ${ invoice.delivery_customer.apartment_number} </p>
                </td>
                </tr>
            </table>
            </div>
        </body>
      </html>
      `;

      // Options for the PDF generation (optional)
      const options = {
        margin: [10, 10], // Page margins (top, right, bottom, left)
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 }, // Optional image settings
        html2canvas: { scale: 2 }, // Optional html2canvas settings
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Optional jsPDF settings
      };

      // Generate the PDF from the HTML content
      html2pdf().from(invoiceHTML).set(options).save();
}
</script>

<template>
<v-container>
  <div style="margin-top: 20px;margin-left:30px;margin-right:30px;">
    <div style="display: flex; justify-content: center;">
      <h3>Order Details</h3>
    </div>
    <br/>
    <Spinner v-if="spinner" />
     <div class="col-md-12 elevation-4 orders" v-else>
        <div class="flex">
            <table>
                <tr>
                <th>Order Id</th>
                <td>{{ order.id }}</td>
                </tr>
                <tr>
                <th>Status</th>
                <td>{{ order.status }}</td>
                </tr>
                <tr>
                <th>Price</th>
                <td> ${{ order.price_for_order }}</td>
                </tr>
                <tr>
                <th>Distance</th>
                <td> {{ order.distance }} miles</td>
                </tr>
                 <tr>
                <th>Price for Delivery Boy</th>
                <td> ${{ order.price_for_delivery_boy }}</td>
                </tr>
                <tr v-if="order.delivery_boy_bonus">
                <th>Delivery Boy Bonus</th>
                <td> ${{ order.delivery_boy_bonus }}</td>
                </tr>
                <tr>
                <th>Expected Time for Delivery </th>
                <td> {{ order.minimum_time }} Minutes</td>
                </tr>
                <tr>
                 <th>Created At</th>
                <td> {{ order.createdAt }} </td>
                </tr>
                <tr v-if="order.pickedup_at" >
                 <th>Picked up At</th>
                <td> {{ order.pickedup_at }} </td>
                </tr>
                <tr v-if="order.delivered_at" >
                 <th>Delivered At</th>
                <td> {{ order.delivered_at }} </td>
                </tr>
                <tr v-if="order.delivered_in_time" >
                 <th>Delivered in time</th>
                <td> {{ order.delivered_in_time }} </td>
                </tr>
                 <tr v-if="order.pickup_customer" >
                 <th>Pickup Details</th>
                <td> 
                    <p> Name - {{ order.pickup_customer.first_name}} {{ order.pickup_customer.last_name}} <br/>
                     Email - {{ order.pickup_customer.email}} <br/>
                     Mobile - {{ order.pickup_customer.mobile}} <br/>
                     Address - {{ order.pickup_customer.address}} <br/>
                     Apt Number - {{ order.pickup_customer.apartment_number}} </p>
                </td>
                </tr>
                <tr v-if="order.delivery_customer">
                 <th>Delivery Details</th>
                <td> 
                    <p> Name - {{ order.delivery_customer.first_name}} {{ order.delivery_customer.last_name}} <br/>
                     Email - {{ order.delivery_customer.email}} <br/>
                     Mobile - {{ order.delivery_customer.mobile}} <br/>
                     Address - {{ order.delivery_customer.address}} <br/>
                     Apt Number - {{ order.delivery_customer.apartment_number}} </p>
                </td>
                </tr>
                <tr>
                <th v-if="order.clerk_details">Clerk Details</th>
                <td> 
                    <p> Name - {{ order.clerk_details.firstName}} {{ order.clerk_details.lastName}} <br/>
                     Email - {{ order.clerk_details.email}} <br/>
                     Mobile - {{ order.clerk_details.mobile}} <br/>
                    </p>
                </td>
                </tr>
                <tr v-if="order.delivery_boy_details">
                <th>Delivery Boy Details</th>
                <td> 
                    <p> Name - {{ order.delivery_boy_details.firstName}} {{ order.delivery_boy_details.lastName}} <br/>
                     Email - {{ order.delivery_boy_details.email}} <br/>
                     Mobile - {{ order.delivery_boy_details.mobile}} <br/>
                    </p>
                </td>
                </tr>
                <tr v-if="path ">
                <th>Path</th>
                <td>
                  Office to Pickup - {{ path.officeToSource.join(" -> ")}} <br/>
                  Pickup to Delivery - {{ path.sourceToDestination.join(" -> ") }} <br/>
                  Return back to Office - {{ path.destinationToOffice.join(" -> ") }}
                </td>
                </tr>
                <tr v-if="order.delivered_at ">
                <th>Invoice</th>
                <td> 
                  <button type="button" class="btn btn-secondary edit" @click="downloadInvoice()">Download</button>
                </td>
                </tr>
                <tr v-if="user.role_id =='3' && !order.delivered_at ">
                    <th>Actions</th>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-secondary edit" v-if="!order.pickedup_at" @click="pickedup()">Picked Up</button>
                        <button type="button" class="btn btn-secondary edit" v-if="!order.delivered_at" @click="delivered()">Delivered</button>
                        </div> 
                    </td>
                </tr>

                
            </table>

        </div>
    </div>
  </div>
  <Snackbar :snackbar="snackbar"/>
  <br/>
</v-container>

</template>

<style scoped>

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
table {
    width: 80%;
}
td {
    width: 80%;
    padding: 10px;
}
th {
    padding-left: 10px;
}
.flex {
    display: flex;
    justify-content: space-around;
}
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