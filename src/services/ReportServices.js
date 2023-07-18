import apiClient from "./services";

export default {
  getReport() {
    return apiClient.get("report");
  }
};