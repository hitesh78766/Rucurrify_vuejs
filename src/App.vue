<template>
  <v-app>
    <v-main class="main-wrapper">
      <Header />

      <v-row>
        <div class="d-flex flex-wrap w-100">
          <v-col v-for="(componentItem, index) in componentOrder" :key="index" :cols="componentItem.cols"
            @mouseenter="hoverGrip = componentItem.id" @mouseleave="hoverGrip = null" class="position-relative"
            :draggable="componentItem.type !== 'placeholder'" @dragstart="onDragStart($event, componentItem, index)"
            @dragover="onDragOver($event)" @drop="onDrop($event, index)">
            <!-- Grip for dragging -->
            <div v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'"
              class="grip position-absolute">
              <i class="fa-solid fa-grip-vertical"></i>
            </div>

            <!-- Show component or placeholder -->
            <component v-if="componentItem.type === 'component'" :is="componentItem.component"
              class="component-container" />
            <div v-else-if="componentItem.type === 'placeholder'" class="placeholder-cols">
              Drag the item
            </div>

            <!-- Column width button -->
            <v-btn v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'" color="warning"
              variant="tonal" class="width-btn" small @click="toggleWidthOptions(componentItem.id)">
              Column width
            </v-btn>

            <!-- Column width toggle -->
            <v-btn-toggle v-if="showColumnWidthToggle[componentItem.id]" class="toggle-btns border-thin"
              v-model="toggle_exclusive" small>
              <v-btn @click="setColumnWidth(componentItem.id, 4)">33%</v-btn>
              <v-btn @click="setColumnWidth(componentItem.id, 6)">50%</v-btn>
              <v-btn @click="setColumnWidth(componentItem.id, 8)">66%</v-btn>
              <v-btn @click="setColumnWidth(componentItem.id, 12)">100%</v-btn>
              <v-btn @click="resetColumnWidth(componentItem.id)">X</v-btn>
            </v-btn-toggle>
          </v-col>
        </div>
      </v-row>

      <!-- Dynamic placeholder row -->
      <v-row>
        <v-col v-for="(item, index) in placeHolderLayout" :key="item.id" :cols="item.cols"
          @dragover="onDragOver($event)" @drop="onDropToPlaceholder($event, item.id)">
          <div v-if="item.type === 'component'" class="component-container">
            <component :is="item.component" />
          </div>
          <div v-else class="placeholder-cols">
            Drag the item
          </div>
        </v-col>
      </v-row>

      <div class="mt-3 d-flex align-items-center justify-content-center placeholder-div" @click="showCard = true">
        <i class="fa-solid fa-tablet-button"></i>
      </div>

      <!-- Placeholder card -->
      <div class="mt-2 w-100 d-flex align-items-center justify-content-center">
        <v-card v-if="showCard" class="placeholder-card" width="300" elevation="5">
          <v-card-title class="placeholder-title">Column Placeholders</v-card-title>
          <v-card-text>
            <div class="d-flex" @click="addPlaceHolderRow([4, 4, 4])">
              <v-col v-for="col in 3" :key="col" cols="4">
                <div class="placeholder-col"></div>
              </v-col>
            </div>
            <div class="d-flex" @click="addPlaceHolderRow([6, 6])">
              <v-col v-for="col in 2" :key="col" cols="6">
                <div class="placeholder-col"></div>
              </v-col>
            </div>
            <div class="d-flex" @click="addPlaceHolderRow([8, 4])">
              <v-col cols="8">
                <div class="placeholder-col"></div>
              </v-col>
              <v-col cols="4">
                <div class="placeholder-col"></div>
              </v-col>
            </div>
            <div class="d-flex" @click="addPlaceHolderRow([12])">
              <v-col v-for="col in 1" :key="col" cols="12">
                <div class="placeholder-col"></div>
              </v-col>
            </div>
          </v-card-text>
          <v-card-actions class="card-actions">
            <v-btn @click="showCard = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <!-- Tabs with drag-and-drop support -->
      <div class="mt-4">
        <VTabs v-model="tab" background-color="primary" dark class="mb-3" @dragover="onDragOver($event)"
          @drop="onDropToTabs($event)">
          <VTab v-for="(tabItem, index) in tabsList" :key="index" :value="tabItem.value"
            :class="{ 'active-tab': tab === tabItem.value }" draggable="true"
            @dragstart="onTabDragStart($event, tabItem, index)">
            {{ tabItem.title }}
          </VTab>
        </VTabs>

        <VWindow v-model="tab" :touch="false">
          <VWindowItem v-for="(tabItem, index) in tabsList" :key="index" :value="tabItem.value">
            <component :is="tabItem.component" />
          </VWindowItem>
        </VWindow>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { markRaw } from 'vue';
import { v4 as uuidv4 } from 'uuid'; 

const showCard = ref(false);
const placeHolderLayout = ref([]);

// Import components
import Header from './components/Header.vue';
import PersonalDetails from './components/PersonalDetails.vue';
import PurchasingDetails from './components/PurchasingDetails.vue';
import CustomerNote from './components/CustomerNote.vue';
import OrderTab from './components/tabs/OrderTab.vue';
import TimelineTab from './components/tabs/TimelineTab.vue';
import BillingTab from './components/tabs/BillingTab.vue';
import Notification from './components/tabs/Notification.vue';
import EmailTab from './components/tabs/EmailTab.vue';

// Component order with type and title fields
const componentOrder = ref([
  { id: 1, type: 'component', component: markRaw(PersonalDetails), cols: 4, title: 'Personal Details' },
  { id: 2, type: 'component', component: markRaw(PurchasingDetails), cols: 4, title: 'Purchasing Details' },
  { id: 3, type: 'component', component: markRaw(CustomerNote), cols: 4, title: 'Customer Note' },
]);

const hoverGrip = ref(null);
const showColumnWidthToggle = ref({});

const draggedItem = ref(null);
const draggedIndex = ref(null);
const draggedTab = ref(null);
const draggedTabIndex = ref(null);

// Tabs list with component field for dynamic content
const tab = ref('orders');
const tabsList = ref([
  { title: 'Orders', value: 'orders', component: markRaw(OrderTab) },
  { title: 'Timeline', value: 'timeline', component: markRaw(TimelineTab) },
  { title: 'Billing', value: 'billing', component: markRaw(BillingTab) },
  { title: 'Notifications', value: 'notifications', component: markRaw(Notification) },
  { title: 'Email', value: 'email', component: markRaw(EmailTab) },
]);

// Check if there are any placeholders
const hasPlaceholder = computed(() => {
  return componentOrder.value.some(item => item.type === 'placeholder');
});

// Drag start handler for components
const onDragStart = (event, item, index) => {
  if (item.type === 'component') {
    draggedItem.value = item;
    draggedIndex.value = index;
    event.dataTransfer.setData('text/plain', item);
  }
};

// Drag start handler for tabs
const onTabDragStart = (event, tabItem, index) => {
  console.log("the tabItem is : " , tabItem , index)
   // Only allow drag if placeholder exists
  if (!hasPlaceholder.value && !placeHolderLayout.value.some(item => item.type === 'placeholder')) return;
  draggedTab.value = tabItem;
  draggedTabIndex.value = index;
  event.dataTransfer.setData('text/plain', tabItem);
};

// Drag over handler
const onDragOver = (event) => {
  event.preventDefault();
};

// Drop handler for componentOrder
const onDrop = (event, dropIndex) => {
  event.preventDefault();

  // Handle component drop
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;

    // Remove dragged item and insert at new position
    componentOrder.value.splice(fromIndex, 1);
    componentOrder.value.splice(dropIndex, 0, dragged);

    // Reset dragged item
    draggedItem.value = null;
    draggedIndex.value = null;
  }

  // Handle tab drop
  if (draggedTab.value && componentOrder.value[dropIndex].type === 'placeholder') {
    const tabItem = draggedTab.value;
    const tabIndex = draggedTabIndex.value;

    // Restore component in componentOrder
    componentOrder.value[dropIndex] = {
      id: componentOrder.value[dropIndex].id,
      type: 'component',
      component: markRaw(tabItem.component),
      cols: componentOrder.value[dropIndex].cols,
      title: tabItem.title,
    };

    // Remove tab from tabsList
    tabsList.value.splice(tabIndex, 1);

    // Reset tab if it was active
    if (tab.value === tabItem.value && tabsList.value.length > 0) {
      tab.value = tabsList.value[0].value;
    } else if (tabsList.value.length === 0) {
      tab.value = null;
    }

    // Reset dragged tab
    draggedTab.value = null;
    draggedTabIndex.value = null;
  }
};

// Drop handler for placeholder layout
const onDropToPlaceholder = (event, placeholderId) => {
  // console.log("the placeholder id is :" , placeholderId)
  event.preventDefault();

  const placeholderIndex = placeHolderLayout.value.findIndex(item => item.id === placeholderId);
  if (placeholderIndex === -1) return;

  // Handle component drop
  if (draggedItem.value && placeHolderLayout.value[placeholderIndex].type === 'placeholder') {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;

    // Replace placeholder with component
    placeHolderLayout.value[placeholderIndex] = {
      id: placeholderId,
      type: 'component',
      component: markRaw(dragged.component),
      cols: placeHolderLayout.value[placeholderIndex].cols,
      title: dragged.title,
    };

    // Replace dragged item with placeholder in componentOrder
    componentOrder.value.splice(fromIndex, 1, {
      id: dragged.id,
      type: 'placeholder',
      cols: dragged.cols,
    });

    // Reset dragged item
    draggedItem.value = null;
    draggedIndex.value = null;
  }

  // Handle tab drop
  if (draggedTab.value && placeHolderLayout.value[placeholderIndex].type === 'placeholder') {
    const tabItem = draggedTab.value;
    const tabIndex = draggedTabIndex.value;

    // Replace placeholder with tab component
    placeHolderLayout.value[placeholderIndex] = {
      id: placeholderId,
      type: 'component',
      component: markRaw(tabItem.component),
      cols: placeHolderLayout.value[placeholderIndex].cols,
      title: tabItem.title,
    };

    // Remove tab from tabsList
    tabsList.value.splice(tabIndex, 1);

    // Reset tab if it was active
    if (tab.value === tabItem.value && tabsList.value.length > 0) {
      tab.value = tabsList.value[0].value;
    } else if (tabsList.value.length === 0) {
      tab.value = null;
    }

    // Reset dragged tab
    draggedTab.value = null;
    draggedTabIndex.value = null;
  }
};

// Drop handler for tabs
const onDropToTabs = (event) => {
  event.preventDefault();
  if (!draggedItem.value) 
  return;

  const dragged = draggedItem.value;
  const fromIndex = draggedIndex.value;

  // Generate unique tab value and use component's title
  const tabValue = `custom-${dragged.id}-${Date.now()}`;
  const tabTitle = dragged.title;

  // Add to tabsList
  tabsList.value.push({
    title: tabTitle,
    value: tabValue,
    component: markRaw(dragged.component),
  });

  // Replace dragged item with placeholder in componentOrder
  componentOrder.value.splice(fromIndex, 1, {
    id: dragged.id,
    type: 'placeholder',
    cols: dragged.cols,
  });

  // Activate the new tab
  tab.value = tabValue;

  // Reset dragged item
  draggedItem.value = null;
  draggedIndex.value = null;
};

// Set column width
const setColumnWidth = (id, width) => {
  const component = componentOrder.value.find((item) => item.id === id);
  if (component) {
    component.cols = width;
  }
};

// Toggle width options
const toggleWidthOptions = (id) => {
  showColumnWidthToggle.value[id] = !showColumnWidthToggle.value[id];
};

// Reset column width
const resetColumnWidth = (id) => {
  showColumnWidthToggle.value[id] = false;
};

// Add placeholder row
const addPlaceHolderRow = (col) => {
  col.forEach((cols) => {
    placeHolderLayout.value.push({
      id: uuidv4(), 
      type: 'placeholder',
      cols,
    });
  });
  showCard.value = false;
};
</script>




<style scoped>
.active-tab {
  background-color: rgba(136, 198, 213, 1);
  color: white;
  box-shadow: 0 2px 6px rgba(136, 198, 213, 0.3);
  border-radius: 6px !important;
}

.grip {
  right: 20px;
  top: 10px;
  z-index: 2;
  cursor: grab;
  font-size: 20px;
  color: #555;
}

.relative-wrapper {
  position: relative;
}

.width-btn {
  position: absolute;
  right: 20px;
  bottom: 20px;
  min-width: 100px;
  font-size: 12px;
  padding: 6px 12px;
}

.toggle-btns {
  cursor: pointer;
  position: absolute;
  right: 25px;
  bottom: 25px;
}

.toggle-btns v-btn:hover {
  background-color: rgba(136, 198, 213, 0.3);
  color: rgba(255, 255, 255, 1);
}

.placeholder-div {
  cursor: pointer;
}

.placeholder-title {
  font-size: 16px;
}

.placeholder-card {
  background-color: rgba(47, 51, 73, 1) !important;
  color: rgba(255, 222, 245, 0.7);
}

.placeholder-col {
  width: 100%;
  height: 35px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  background: #f8f8f8;
}

.card-actions {
  text-align: end !important;
  display: block;
}

.placeholder-cols {
  background-color: rgba(47, 51, 73, 1) !important;
  height: 100%;
  min-height: 600px;
  box-shadow: 0 3px 12px rgba(19, 17, 32, 1), 0 0 transparent, 0 0 transparent;
  color: rgba(255, 222, 245, 0.7) !important;
}

.component-container {
  height: 100%;
  min-height: 600px;
}

/* Visual feedback during drag */
[draggable="true"]:hover {
  opacity: 0.8;
}
</style>