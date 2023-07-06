<script setup>
import { defineProps, toRef } from "vue";

const props = defineProps({
  address: Object,
});
const address = toRef(props, 'address');
const avenueOptions = ["A","B","C","D","E","F","G","H"]
const streetOptions = [ 1,2,3,4,5,6,7]

</script>


<template>
  <div class="row" style="display:flex;justify-content:space-between;">
      <div class="col-6">
        <label for="Apartment" class="form-label">Street</label>
        <select class="form-control" id="dropdown" v-model="address.street" >
          <option value="">Select Street</option>
          <option v-for="street in streetOptions" :key="street" :value="street"> Street - {{street}}</option>
        </select>
      </div>
      <div class="col-6">
          <label for="Apartment" class="form-label">Avenue</label>
          <select class="form-control" id="dropdown" v-model="address.avenue">
          <option value="">Select Avenue</option>
          <option v-for="avenue in avenueOptions" :key="avenue" :value="avenue"> Avenue - {{avenue}}</option>
        </select>
      </div>
      </div>
<div style="margin-bottom:10px;"/> 
</template>
