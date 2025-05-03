<template>
  <div class="d-flex justify-content-between mb-4">
    <div>
      <h4 class="text-h4 customer">Customer ID #101</h4>
    </div>

    <div class="d-flex">
      <v-btn class="me-3 back-btn">
        <i class="fa-solid fa-arrow-left me-2"></i>Back
      </v-btn>
      <div class="edit-pen-btn d-flex align-center justify-center">
        <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click.stop="drawer = !drawer">
          <i class="fa-regular fa-pen-to-square"></i>
        </v-btn>
      </div>
    </div>
  </div>

  <!-- Drawer -->
  <v-navigation-drawer class="drawer-section" v-model="drawer" temporary right width="400">
  
    <v-tabs v-model="tab" class="d-flex align-items-center justify-content-center">
      <v-tab value="one">PlaceHolders</v-tab>
      <v-tab value="two">Components</v-tab>
    </v-tabs>

    <v-divider></v-divider>


    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <div class="mt-2">
          content of placeholder tab
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item value="two">
        <v-list density="compact" nav>

          <v-list-item>
            <div class="d-flex justify-content-between align-items-center p-2"
              v-for="(item, index) in componetnHeading" :key="index">
              <p class="m-0">{{ item.title }}</p>
              <div><i :class="item.icon"></i></div>
            </div>
          </v-list-item>

        </v-list>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const tab = ref('one')


const componetnHeading = ref([
  {
    title: "Header",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "Personal Detail Component",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "Purchasing Detail Component",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "consumer Note Component",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "Order Tab",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "Timeline Tab",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "Billing Tab",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "Notification Tab",
    icon: 'fa-solid fa-eye'
  },
  {
    title: "Email Tab",
    icon: 'fa-solid fa-eye'
  },
])

</script>

<style scoped>
.back-btn {
  background-color: transparent !important;
  color: rgba(225, 222, 245, 0.9);
}

.edit-pen-btn {
  border-radius: 50%;
  width: 38px;
  height: 38px;
}

.edit-pen-btn button {
  color: rgba(225, 222, 245, 0.9);
  background: rgba(136, 198, 213, 1);
}

.customer {
  font-size: 1.5rem !important;
  font-weight: 500;
}

.drawer-section {
  background-color: rgba(47, 51, 73, 1) !important;
  color: rgba(255, 222, 245, 0.7);
}
</style>
