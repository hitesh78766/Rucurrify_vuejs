<template>
    <!-- Life Lab Tab Content -->
    <v-row>
      <!-- Life Lab Stats -->
      <v-col 
        v-for="(item, index) in lifeLabStatsDisplay" 
        :key="index" 
        cols="6"
        class="d-flex align-items-center gap-3"
      >
        <div class="d-flex align-items-center justify-content-center sign-container">
          <i :class="`fa-solid ${item.icon} text-primary`"></i>
        </div>
        <div>
          <h6 class="m-0 selected-title">{{ item.title }}</h6>
          <p class="m-0 selected-total">{{ item.value }}</p>
        </div>
  
        <!-- Add Button -->
        <div class="life-lab-plus-icon d-flex align-center justify-center">
          <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="$emit('add-row')">
            <i class="fa-solid fa-plus"></i>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  
    <!-- Extra Rows -->
    <v-row v-for="(extraRow, rowIndex) in extraLifeLabRows" :key="rowIndex" class="align-center">
      <v-col cols="6" v-for="(field, fieldIndex) in [0, 1]" :key="fieldIndex">
        
        <!-- Show + if not selected -->
        <div v-if="!extraRow.selectedStats[fieldIndex]">
          <v-menu v-model="extraRow.menuOpen[fieldIndex]" offset-y :close-on-content-click="false">
            <template #activator="{ props }">
              <div v-bind="props" class="menu-container">+</div>
            </template>
  
            <v-card class="menu-list">
              <v-card-title>Add or Replace Details</v-card-title>
              <v-list class="px-2 menu-list-item">
                <v-list-item 
                  v-for="(item, index) in filteredLifeLabMenuList(extraRow)" 
                  :key="index"
                  @click="extraRow.tempSelection[fieldIndex] = item"
                  :class="{ 'selected-menu-item': extraRow.tempSelection[fieldIndex]?.title === item.title }"
                  class="rounded"
                >
                  <v-list-item-title>
                    <i :class="`fa-solid ${item.icon} me-2`"></i> {{ item.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
  
              <v-card-actions class="justify-end">
                <v-btn variant="text" @click="$emit('cancel-selection', { extraRow, fieldIndex })">Cancel</v-btn>
                <v-btn variant="flat" class="selected-menu-item" @click="$emit('apply-selection', { extraRow, fieldIndex })">
                  Apply
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
  
        <!-- Show selected item -->
        <div v-else class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center justify-content-center sign-container">
            <i :class="`fa-solid ${extraRow.selectedStats[fieldIndex].icon} text-primary`"></i>
          </div>
          <div>
            <h6 class="m-0 selected-title">{{ extraRow.selectedStats[fieldIndex].title }}</h6>
            <p class="m-0 selected-total">{{ extraRow.selectedStats[fieldIndex].value }}</p>
          </div>
        </div>
  
      </v-col>
  
      <!-- Delete Extra Row Button -->
      <div class="delete-icon d-flex align-center justify-center position-absolute">
        <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="$emit('delete-row', rowIndex)" color="red">
          <i class="fa-solid fa-trash delete-list-icon"></i>
        </v-btn>
      </div>
  
    </v-row>
  
    <!-- Customer Details -->
    <v-row class="mt-3">
      <v-col cols="12">
        <div class="customer-details-container">
          <VueDraggableNext v-model="lifeLabDetails" :animation="200">
            <div class="customer-details-grid" v-for="(customer, index) in lifeLabDetails" :key="index">
              <div class="detail-title">{{ customer.title }}</div>
              <div class="detail-value">{{ customer.value }}</div>
              <i 
                v-if="editMode" 
                class="fa-solid fa-trash mt-3 delete-list-icon" 
                @click="$emit('delete-customer', index)"
              ></i>
            </div>
          </VueDraggableNext>
        </div>
      </v-col>
  
      <!-- Add New Customer Details -->
      <v-col cols="12">
        <v-menu v-model="lifeLabLastRowMenuOpen" offset-y :close-on-content-click="false">
          <template #activator="{ props }">
            <div v-bind="props" class="menu-container">+</div>
          </template>
  
          <v-card class="menu-list">
            <v-card-title>Select Details</v-card-title>
            <v-list class="px-2 menu-list-item">
              <v-list-item 
                v-for="(item, index) in lifeLabMenuList" 
                :key="index"
                @click="$emit('toggle-last-row', item)"
                :class="{ 'selected-menu-item': isLifeLabSelected(item) }"
                class="rounded"
              >
                <v-list-item-title>
                  <i :class="`fa-solid ${item.icon} me-2`"></i> {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
  
            <v-card-actions class="justify-end">
              <v-btn variant="text" @click="$emit('cancel-last-row')">Cancel</v-btn>
              <v-btn variant="flat" class="selected-menu-item" @click="$emit('apply-last-row')">
                Apply
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  // Props receive kar rahe hain
  defineProps({
    lifeLabStatsDisplay: Array,
    extraLifeLabRows: Array,
    lifeLabDetails: Array,
    lifeLabMenuList: Array,
    lifeLabLastRowMenuOpen: Boolean,
    editMode: Boolean,
    isLifeLabSelected: Function,
    filteredLifeLabMenuList: Function
  });
  
  // Emit events
  defineEmits([
    'add-row', 
    'delete-row', 
    'cancel-selection', 
    'apply-selection',
    'delete-customer',
    'toggle-last-row',
    'cancel-last-row',
    'apply-last-row'
  ]);
  </script>
  
  <style scoped>
  /* Aapka existing styling yahan aa sakta hai */
  </style>
  