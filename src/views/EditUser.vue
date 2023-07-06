<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import Spinner from "../components/Spinner.vue";
import Snackbar from "../components/Snackbar.vue";
import { updateSnackbar } from "../utils"
import InputField from "../components/InputField.vue"

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  roleId: "",
});
const isSpinner = ref(false);
const roleOptions =  [
        {
            id:"1",
            role:"Admin"
        },
         {
            id:"2",
            role:"Clerk"
        },
         {
            id:"3",
            role:"Delivery Boy"
        }
      ]
onMounted(async () => {
   const isLoggedIn = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn) {
    router.push({ name: "login" });
  }
    await getUser();
    isSpinner.value = false
});

async function getUser() {
    isSpinner.value = true
    await UserServices.getUser(router.currentRoute.value.params.id)
        .then((response) => {
            user.value = response.data
            isSpinner.value = false
        })
        .catch((error) => {
            isSpinner.value = false
        });
}

async function updateUser() {
      if(user.value.firstName === "") {
        snackbar.value = updateSnackbar("First Name is Empty")
    }
    else if(user.value.lastName === "") {
        snackbar.value = updateSnackbar("Last Name is Empty")
    }
    else if(user.value.email === "") {
           snackbar.value = updateSnackbar("Email is Empty")
    }
    else if(user.value.mobile === "") {
             snackbar.value = updateSnackbar("Mobile is Empty")
    }
    else if(user.value.password === "") {
        snackbar.value = updateSnackbar("Password is Empty")
    }
    else if(user.value.apartment_number === "") {
        snackbar.value = updateSnackbar("Apartment Number is Empty")
    }
    else if(user.value.role_id === "") {
        snackbar.value = updateSnackbar("Role is Empty")
    }
    else {
        isSpinner.value = true
        await UserServices.updateUser(user.value)
            .then((response) => {
              snackbar.value = updateSnackbar("User is Updated successfully!","green")
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
          <v-card-title class="headline mb-2">Update User </v-card-title>
        </div>
        <Spinner v-if="isSpinner" />
        <v-card-text v-else>
        <InputField class="md-3" id="firstName" title="First Name" :value="user.firstName" @update:value="user.firstName = $event"/>
        <InputField class="md-3" id="lastName" title="Last Name" :value="user.lastName" @update:value="user.lastName = $event"/>
        <InputField class="md-3" id="email" title="Email" :value="user.email" @update:value="user.email = $event"/>
        <InputField class="md-3" id="mobile" title="Mobile" :value="user.mobile" @update:value="user.mobile = $event"/>
        <!-- <InputField class="md-3" id="password" title="Password" :value="user.password" @update:value="user.password = $event"/> -->
        <div class="mb-3">
        <label for="role" class="form-label">Availability</label>
        <select class="form-control " id="role" v-model="user.availabilty">
            <option value="">Select Availability</option>
            <option value="0" key="0">No</option>
            <option value="1" key="1">Yes</option>
        </select>
        </div>
        <div class="mb-3">
        <label for="role" class="form-label">Role</label>
        <select class="form-control " id="role" v-model="user.roleId">
            <option value="">Select Role</option>
            <option v-for="item in roleOptions" :key="item.id" :value="item.id"> {{item.id}}.{{item.role}}</option>
        </select>
        </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="updateUser()">Update</v-btn>
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