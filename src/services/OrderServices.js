import apiClient from "./services";

export default {
  getOrders(type,userId) {
    if(!userId || !type)
      return apiClient.get("orders");
    else {
      if(type == "placedByMe"){
        return apiClient.get("orders/placedBy/"+userId)
      } else if(type == "deliveredByMe") {
        return apiClient.get("orders/deliveryBoy/"+userId+"?status=DELIVERED")
      } else if(type == "my-current-order") {
        return apiClient.get("orders/deliveryBoy/"+userId+"?status=NOT_DELIVERED")
      } 
      else {
        return apiClient.get("orders")
      }
    }
      
  },
  getOrder(id) {
    return apiClient.get("orders/" + id);
  },
  addOrder(order) {
    return apiClient.post("orders", order);
  },
  calculateOrderDetails(order) {
    return apiClient.post("orders/calculate",order);
  },
  updateOrder(order) {
    return apiClient.put("orders/" + order.id, order);
  },
  deleteOrder(orderId) {
    return apiClient.delete("orders/" + orderId);
  },
  pickedup(orderId) {
    return apiClient.post("/orders/pickedup/" + orderId);
  },
  delivered(orderId) {
    return apiClient.post("orders/delivered/" + orderId);
  },
  findPath(order) {
    return apiClient.post("orders/route/", order);
  }
};