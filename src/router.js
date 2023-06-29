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
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("./views/UserList.vue"),
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
  ],
});

export default router;
