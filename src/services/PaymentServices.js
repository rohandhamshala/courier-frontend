import apiClient from "./services";

export default {
  getPayments(id) {
    if(!id)
      return apiClient.get("payments");
    return apiClient.get("payments/users/"+id)
  },
  getPayment(id) {
    return apiClient.get("payments/" + id);
  },
  addPayment(payment) {
    return apiClient.post("payments", payment);
  },
  updatePayment(payment) {
    return apiClient.put("payments/" + payment.id, payment);
  },
  deletePayment(paymentId) {
    return apiClient.delete("payments/" + paymentId);
  },
  getTotalCreditedAmount(id) {
    if(!id)
      return apiClient.get("payments/creditedAmount"); 
    return apiClient.get("payments/creditedAmount/"+id)
  }
};