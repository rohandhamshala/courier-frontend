import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/DashBoard.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/DashBoard.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/payments",
      name: "payment",
      component: () => import("./views/PaymentList.vue"),
    },
    {
      path: "/mypayments",
      name: "mypayment",
      component: () => import("./views/MyPaymentList.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("./views/OrderList.vue"),
    },
    {
      path: "/orders/:type/:id",
      name: "filterOrders",
      component: () => import("./views/OrderList.vue"),
    },
    {
      path: "/orders/:type/",
      name: "filterOrders",
      component: () => import("./views/OrderList.vue"),
    },
    {
      path: "/orderDetails/:id",
      name: "singleOrder",
      component: () => import("./views/SingleOrder.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("./views/UserList.vue"),
    },
    {
      path: "/customers",
      name: "customers",
      component: () => import("./views/CustomerList.vue"),
    },
    {
      path: "/users/:type",
      name: "userWithType",
      component: () => import("./views/UserList.vue"),
    },
    {
      path: "/create-user",
      name: "createUser",
      component: () => import("./views/CreateUser.vue"),
    },
    {
      path: "/edit-user/:id",
      name: "editUser",
      component: () => import("./views/EditUser.vue"),
    },
    {
      path: "/create-customer",
      name: "createCustomer",
      component: () => import("./views/CreateCustomer.vue"),
    },
    {
      path: "/edit-customer/:id",
      name: "editCustomer",
      component: () => import("./views/EditCustomer.vue"),
    },
    {
      path: "/create-payment",
      name: "createPayment",
      component: () => import("./views/CreatePayment.vue"),
    },
    {
      path: "/edit-payment/:id",
      name: "editPayment",
      component: () => import("./views/EditPayment.vue"),
    },
    {
      path: "/create-order",
      name: "createOrder",
      component: () => import("./views/CreateOrder.vue"),
    },
    {
      path: "/edit-order/:id",
      name: "editOrder",
      component: () => import("./views/EditOrder.vue"),
    },
  ],
});

export default router;
