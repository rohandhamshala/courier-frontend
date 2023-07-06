<script setup>
import { defineProps, toRef } from "vue";

const props = defineProps({
  customer: Object,
});
const customer = toRef(props, 'customer');
</script>


<template>
  <div class="row" style="display:flex;justify-content:space-between;" v-if="customer?.id">
    <h6>Customer Details</h6>
    <div class="col-6">
      <label for="address" class="form-label">Address</label>
      <input type="text" class="form-control" id="address" :value="'Street - ' + customer.address.charAt(0) + ', Avenue - ' + customer.address.charAt(1)" disabled/>
    </div>
    <div class="col-6">
      <label for="apt" class="form-label">Apt Number</label>
      <input type="text" class="form-control" id="apt" :value="customer.apartment_number" disabled />
    </div>
    <div style="margin-top:10px;"/>
    <div class="col-6">
      <label for="email" class="form-label">Email</label>
      <input type="text" class="form-control" id="email" :value="customer.email" disabled/>
    </div>
    <div class="col-6">
      <label for="mobile" class="form-label">Mobile</label>
      <input type="text" class="form-control" id="mobile" :value="customer.mobile" disabled />
    </div>
  </div>
  <div style="margin-bottom:10px;"/>
</template>
