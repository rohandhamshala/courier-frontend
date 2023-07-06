<script setup>
import ocLogo from "/oc_logo.png";
import navbarImage from "/navbar.svg";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import {getDomainUrl} from "../utils";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref(null);
const title = ref("OKC Couriers");
const logoURL = ref("");
const navbar = ref("");
const drawerOpen = ref(false)
const isAvailable = ref(false)
onMounted(() => {
  logoURL.value = ocLogo;
  navbar.value = navbarImage;
  user.value = JSON.parse(localStorage.getItem("user"));
  if(user.value)
    isAvailable.value = user.value.availabilty ? true : false
});

const routes = {
  1:[
    {
    path: "/dashboard",
    icon: getDomainUrl()+"/dashboard.png",
    name: "Dashboard"
  },
  {
    path: "/users/1",
    icon: getDomainUrl()+"/admin.png",
    name: "Manage Admins"
  },
   {
    path: "/users/2",
    icon: getDomainUrl()+"/clerk.png",
    name: "Manage Clerks"
  },
  {
    path: "/users/3",
    icon: getDomainUrl()+"/delivery_boy.png",
    name: "Manage Delivery Boys"
  },
  {
    path: "/orders",
    icon: getDomainUrl()+"/order.png",
    name: "Manage Orders"
  },
  {
    path: "/customers",
    icon: getDomainUrl()+"/customer.png",
    name: "Manage Customers"
  },
  {
    path: "/payments",
    icon: getDomainUrl()+"/payment.png",
    name: "Manage Payments"
  }
  ],
  2:[
    {
    path: "/dashboard",
    icon: getDomainUrl()+"/dashboard.png",
    name: "Dashboard"
    },
    {
      path: "/users/3",
      icon: getDomainUrl()+"/delivery_boy.png",
      name: "Manage Delivery Boys"
    },
    {
      path: "/orders",
      icon: getDomainUrl()+"/order.png",
      name: "Manage Orders"
    },
    {
      path: "/customers",
      icon: getDomainUrl()+"/customer.png",
      name: "Manage Customers"
    },
    {
      path: "/mypayments",
      icon: getDomainUrl()+"/payment.png",
      name: "My Payments"
    },
    {
      path: "/orders/placedByMe",
      icon: getDomainUrl()+"/order.png",
      name: "Orders placed by me"
    }
    ],
  3: [
    {
    path: "/dashboard",
    icon: getDomainUrl()+"/dashboard.png",
    name: "Dashboard"
    },
    {
    path: "/my-current-order",
    icon: getDomainUrl()+"/order.png",
    name: "Current Order"
    },
    {
      path: "/mypayments",
      icon: getDomainUrl()+"/payment.png",
      name: "My Payments"
    },
    {
      path: "/orders/deliveredByMe",
      icon: getDomainUrl()+"/order.png",
      name: "Orders delivered by me"
    }
  ],
}

 watch(
      isAvailable,
      async(newValue, oldValue) => { 
          await UserServices.updateUser({ id: user.value.id, availabilty: newValue ? 1 : 0 })
          .then((response) => {
            user.value.availabilty = newValue ? 1 : 0
            localStorage.setItem("user",JSON.stringify(user.value))
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
      }
    );

function closeSnackBar() {
  snackbar.value.value = false;
}

function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
}
</script>

<template>
  <div>
    <v-navigation-drawer v-model="drawerOpen" app>
      <!-- Your navigation menu content here -->
      <v-list style="margin-top:20px;">
        <v-list-item v-for="route in routes[user?.role_id]" :key="route.path" :to="route.path" link>
          <div style="display:flex">
            <!-- <v-icon>{{ route.icon }}</v-icon> -->
            <img :src="route.icon" width="25" height="25" style="margin-right:20px;"/>
            <p style="color:black;">{{ route.name }}</p>
          </div>
        </v-list-item>
      </v-list>
      <div class="form-check form-switch" style="margin-left:20px" v-if="user">
        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" v-model="isAvailable" >
        <label class="form-check-label" for="flexSwitchCheckChecked" v-if="isAvailable">You are currently Available!</label>
        <label class="form-check-label" for="flexSwitchCheckChecked" v-else>You are offline!</label>
      </div>
    </v-navigation-drawer>
    <v-app-bar color='#1877f2' app dark>
      <v-app-bar-nav-icon color="secondary"  @click.stop="drawerOpen = !drawerOpen" v-if="user?.id">
        <v-img
          class="mx-2"
          :src="navbar"
          height="30"
          width="30"
          contain
        ></v-img> 
      </v-app-bar-nav-icon>
      <v-toolbar-title class="title" :style="{color:'white',cursor:'pointer'}" >
        <a href="/">{{ title }}</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="user === null" class="mx-2" :to="{ name: 'login' }">
        Login
      </v-btn>
      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
                `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                }}</span>
              </v-avatar>
              <h3>{{ `${user.firstName} ${user.lastName}` }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
    
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
  </div>
</template>

<style scoped>
 a {
  color: white;
 }
 a:hover {
  color: white;
 }
</style>