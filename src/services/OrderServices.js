import apiClient from "./services";

export default {
  getOrders(type,userId) {
    if(!type)
      return apiClient.get("orders");
    if(type == "placedBy")
      return apiClient.get("orders/placedBy/"+userId)
    return apiClient.get("orders/deliveryBoy/"+userId) 
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
  }
};