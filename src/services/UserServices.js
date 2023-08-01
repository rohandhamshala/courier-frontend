import apiClient from "./services";

export default {
  getUser(id) {
    if(!id)
      return apiClient.get("users");
    return apiClient.get("users/"+id)
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  updateUser(user) {
    return apiClient.put("users/" + user.id, user);
  },
  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
  getAdmins(){
    return apiClient.get("users/admins");
  },
  getClerks(){
    return apiClient.get("users/clerks");
  },
  getDeliveryBoys(){
    return apiClient.get("users/deliveryBoys");
  },
  getUnVerifiedUsers(){
    return apiClient.get("users/unverified");
  },
  getAvailableDeliveryBoys(){
    return apiClient.get("users/deliveryBoys");
  },
  getUsers(id) {
    if(!id)
      return this.getUser()
    else {
      if(id==1){
        return this.getAdmins()
      } else if(id==2) {
        return this.getClerks();
      } else if(id=="unverified") {
        return this.getUnVerifiedUsers();
      }
      else {
        return this.getDeliveryBoys();
      }
    }
  },
  deleteUser(userId) {
    return apiClient.delete("users/" + userId);
  }
};
