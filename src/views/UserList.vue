<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import { ref } from "vue";
import Spinner from "../components/Spinner.vue";
import { getDomainUrl } from "../utils"


const users = ref([]);
const spinner = ref(true);
const user = ref(null);
const router = useRouter();
const type = router.currentRoute.value.params.type
const backup = ref([])
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const filter = ref(2)
const search = ref("")
onMounted(async () => {
  await getUsers();
  spinner.value = false;
});

async function getUsers() {
  await UserServices.getUsers(type)
    .then((res) => {
      users.value = res.data;
      backup.value = res.data
    })
    .catch((error) => {
      console.log(error);
    });
}
function closeSnackBar() {
  snackbar.value.value = false;
}
watch(
      () => router.currentRoute.value.params.type,
      (newType, oldType) => {
        if (newType !== oldType) {
          location.reload();
        }
      }
    );

 watch(
      filter,
      (newValue, oldValue) => {
        if (newValue === 2) {
          users.value = backup.value;
        } else {
          const filteredUsers = backup.value.filter(user => user.availabilty == newValue);
          users.value = filteredUsers;
        }
      }
    );
 watch(
      search,
      (newValue, oldValue) => {
          const filteredUsers = backup.value.filter(user => 
          user.firstName.toLowerCase().includes(newValue.toLowerCase()) ||
          user.lastName.toLowerCase().includes(newValue.toLowerCase()) ||
          user.email.toLowerCase().includes(newValue.toLowerCase()) ||
          user.mobile.toLowerCase().includes(newValue.toLowerCase())
          );
          users.value = filteredUsers;
          console.log("user",users.value)
      }
    );
const deleteUser = async(id,index) => {
    await UserServices.deleteUser(id)
    .then((res) => {
      users.value.splice(index, 1);
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "User is deleted successfully!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

</script>

<template>
<v-container>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex; justify-content: center;">
      <h3 v-if="type == 1">Admin list</h3>
      <h3 v-else-if="type == 2">Clerk list</h3>
      <h3 v-else-if="type == 3">Delivery Boy list</h3>
      <h3 v-else-if="type=='unverified'">Unverified Users</h3>
      <h3 v-else>User list</h3>
        <a class="btn btn-warning create" :href=[ getDomainUrl()+"create-user"] style="margin-left:auto;" >Create User</a>
    </div>
    <br/>
    <div style="display:flex;">
      <h5 style="margin-top:5px"> Filters </h5>
      <div class="mb-3">
        <select class="form-control" id="dropdown" style="margin-left:20px;" v-model="filter" >
            <option  :key="2" :value="2">All</option>
            <option  :key="1" :value="1">Available</option>
            <option :key="0" :value="0">Not Available</option>
        </select>
        </div>
      <input class="form-control search" type="search" placeholder="Search" aria-label="Search" v-model="search"/><br/>
    </div>
    <Spinner v-if="spinner" />
    <div class="col-md-12 container elevation-4 users" v-else>
                <table class="table" style="background-color: white;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Is Available Now</th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user,index) in users" :key="index" >
                    <th scope="row">{{ user.id }}</th>
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.mobile }}</td>
                    <td v-if="user.availabilty == 1">Yes</td>
                    <td v-else>No</td>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <a type="button" class="btn btn-secondary edit" :href="[ getDomainUrl()+'edit-user/'+user.id]">Edit</a>
                        <button type="button" class="btn btn-secondary delete" @click="deleteUser(user.id,index)">Delete</button>
                        </div>         
                    </td>
                    </tr>
                </tbody>
                </table>
          </div>
    </div>
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
  <br/>
</v-container>

</template>

<style scoped>

.users {
  padding: 30px;
  background-color: white;
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
 a:hover {
    text-decoration: none;
    color: white;
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
  margin-left: 60%;
  width: 30%;
}
</style>