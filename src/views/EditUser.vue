<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import Spinner from "../components/Spinner.vue";

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
function closeSnackBar() {
  snackbar.value.value = false;
}

async function updateUser() {
    if(user.value.firstName === "") {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "First name is empty!";
    }
    else if(user.value.lastName === "") {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Last name is empty!";
    }
    else if(user.value.email === "") {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Email is empty!";
    }
    else if(user.value.mobile === "") {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Mobile is empty!";
    }
    else if(user.value.apartment_number === "") {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Apartment number is empty!";
    }
    else if(user.value.role_id === "") {
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = "Role is empty!";
    }
    else {
        isSpinner.value = true
        await UserServices.updateUser(user.value)
            .then((response) => {
                snackbar.value.value = true;
                snackbar.value.color = "green";
                snackbar.value.text = "User is updated successfully!";
                isSpinner.value = false
            })
            .catch((error) => {
                console.log(error);
                snackbar.value.value = true;
                snackbar.value.color = "error";
                snackbar.value.text = error.response.data.message;
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
          <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input type="text" class="form-control " id="firstName" v-model="user.firstName"/>
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input type="text" class="form-control " id="lastName" v-model="user.lastName"/>
        </div>
          <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="text" class="form-control " id="email" v-model="user.email"/>
        </div>
        <div class="mb-3">
          <label for="mobile" class="form-label">Mobile</label>
          <input type="text" class="form-control " id="mobile" v-model="user.mobile"/>
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