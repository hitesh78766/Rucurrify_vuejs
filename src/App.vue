<template>
  <v-app>
    <v-main class="main-wrapper">
      <!-- <Header /> -->

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

        <v-tabs v-model="tabs" class="d-flex align-items-center justify-content-center">
          <v-tab value="one">PlaceHolders</v-tab>
          <v-tab value="two">Components</v-tab>
        </v-tabs>

        <v-divider></v-divider>


        <v-tabs-window v-model="tabs">
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

      <v-row>
        <div class="d-flex flex-wrap w-100">
          <v-col v-for="(componentItem, index) in componentOrder" :key="index" :cols="componentItem.cols"
            @mouseenter="hoverGrip = componentItem.id" @mouseleave="hoverGrip = null" class="position-relative"
            :draggable="true" @dragstart="onDragStart($event, componentItem, index)" @dragover="onDragOver($event)"
            @drop="onDrop($event, index)">

            <v-tooltip text="Delete column" location="top">
              <template v-slot:activator="{ props }">
                <div class="trash-column" v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'"
                  v-bind="props" @click.stop="deleteColumn(componentItem.id, index)">
                  <i class="fa-solid fa-trash"></i>
                </div>
              </template>
            </v-tooltip>

            <!-- Grip for dragging -->
            <div v-if="hoverGrip === componentItem.id" class="grip position-absolute">
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
        <v-col v-for="(item, index) in placeHolderLayout" :key="index" :cols="item.cols" @dragover="onDragOver($event)"
          @drop="onDropToPlaceholder($event, item.id, index)"
          @mouseenter="hoverPlaceholder = item.id; hoverGripPlaceHolder = item.id"
          @mouseleave="hoverPlaceholder = null; hoverGripPlaceHolder = null" class="position-relative" :draggable="true"
          @dragstart="onPlaceholderDragStart($event, item, index)">

          <v-tooltip text="Delete column" location="right">
            <template v-slot:activator="{ props }">
              <div class="trash-column" v-if="hoverPlaceholder === item.id" v-bind="props"
                @click.stop="deletePlaceholderColumn(item.id, index)">
                <i class="fa-solid fa-trash"></i>
              </div>
            </template>
          </v-tooltip>

          <div v-if="hoverGripPlaceHolder === item.id" class="hover-grip-placeholder">
            <i class="fa-solid fa-grip-vertical"></i>
          </div>

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
            @dragstart="onTabDragStart($event, tabItem, index)" @drop="onDropTab($event, index)">
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

const drawer = ref(false)
const tabs = ref('one')


const componetnHeading = ref([
  {
    title: "Personal Detail",
    icon: 'fa-solid fa-eye',
    component: PersonalDetails
  },
  {
    title: "Purchasing Detail ",
    icon: 'fa-solid fa-eye',
    component : PurchasingDetails
  },
  {
    title: "consumer Note ",
    icon: 'fa-solid fa-eye',
    component : CustomerNote
  },
  {
    title: "Order",
    icon: 'fa-solid fa-eye',
    component : OrderTab
  },
  {
    title: "Timeline",
    icon: 'fa-solid fa-eye',
    component : TimelineTab
  },
  {
    title: "Billing",
    icon: 'fa-solid fa-eye',
    component : BillingTab
  },
  {
    title: "Notification",
    icon: 'fa-solid fa-eye',
    component : Notification
  },
  {
    title: "Email",
    icon: 'fa-solid fa-eye',
    component : EmailTab
  },
])

const showCard = ref(false);
const placeHolderLayout = ref([]);


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
  { id: 1, type: 'component', component: PersonalDetails, cols: 4, title: 'Personal Details' },
  { id: 2, type: 'component', component: PurchasingDetails, cols: 4, title: 'Purchasing Details' },
  { id: 3, type: 'component', component: CustomerNote, cols: 4, title: 'Customer Note' },
]);

const hoverGrip = ref(null);
const hoverPlaceholder = ref(null);
const hoverGripPlaceHolder = ref(null);
const showColumnWidthToggle = ref({});

const draggedItem = ref(null);
const draggedIndex = ref(null);
const draggedTab = ref(null);
const draggedTabIndex = ref(null);
const draggedPlaceholder = ref(null);
const draggedPlaceholderIndex = ref(null);

// Tabs list with component field for dynamic content
const tab = ref('orders');
const tabsList = ref([
  { title: 'Orders', value: 'orders', component: OrderTab },
  { title: 'Timeline', value: 'timeline', component: TimelineTab },
  { title: 'Billing', value: 'billing', component: BillingTab },
  { title: 'Notifications', value: 'notifications', component: Notification },
  { title: 'Email', value: 'email', component: EmailTab },
]);



// Delete the component cols
const deleteColumn = (id, index) => {
  componentOrder.value.splice(index, 1);
  adjustColumnWidths();
};

// Adjust the component cols after the deletion of the component cols
const adjustColumnWidths = () => {
  const totalCols = 12;
  const visibleColumns = componentOrder.value.filter(item => item.type === 'component');
  const count = visibleColumns.length;

  if (count === 0) return;

  const newWidth = Math.floor(totalCols / count);

  componentOrder.value.forEach(item => {
    if (item.type === 'component') {
      item.cols = newWidth;
    }
  });
};

// Check if there are any placeholders
const hasPlaceholder = computed(() => {
  return componentOrder.value.some(item => item.type === 'placeholder');
});

// Drag start handler for components and placeholders in componentOrder
const onDragStart = (event, item, index) => {
  draggedItem.value = item;
  draggedIndex.value = index;
};

// Drag start handler for placeholders in placeHolderLayout
const onPlaceholderDragStart = (event, item, index) => {
  draggedPlaceholder.value = item;
  draggedPlaceholderIndex.value = index;
};

// Drag start handler for tabs 
const onTabDragStart = (event, tabItem, index) => {
  draggedTab.value = tabItem;
  draggedTabIndex.value = index;
};

// Drag over handler
const onDragOver = (event) => {
  event.preventDefault();
};

// Drop handler for componentOrder
const onDrop = (event, dropIndex) => {
  event.preventDefault();

  // Handle component or placeholder drop from componentOrder
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;

    // Swap within componentOrder (component-to-component or placeholder)
    componentOrder.value.splice(fromIndex, 1);
    componentOrder.value.splice(dropIndex, 0, dragged);

    draggedItem.value = null;
    draggedIndex.value = null;
  }

  // Handle placeholder drop from placeHolderLayout
  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;

    // Swap or replace in componentOrder
    const targetItem = componentOrder.value[dropIndex];
    if (targetItem.type === 'component') {
      placeHolderLayout.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'component',
        component: markRaw(targetItem.component),
        cols: dragged.cols,
        title: targetItem.title,
      });
      // Replace target with dragged placeholder
      componentOrder.value[dropIndex] = dragged;
    } else {
      // Simple swap within componentOrder
      placeHolderLayout.value.splice(fromIndex, 1);
      componentOrder.value.splice(dropIndex, 0, dragged);
    }

    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
  }

  // Handle tab drop
  if (draggedTab.value) {
    const tabItem = draggedTab.value;
    const tabIndex = draggedTabIndex.value;
    const targetItem = componentOrder.value[dropIndex];

    if (targetItem.type === 'placeholder') {
      // Replace placeholder with tab component
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
    } else {
      // Swap tab with component
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
      // Add target component to tabsList at the dragged tab's index
      tabsList.value.splice(tabIndex, 0, {
        title: targetItem.title,
        value: `custom-${targetItem.id}-${Date.now()}`,
        component: markRaw(targetItem.component),
      });
    }

    // Remove tab from tabsList
    tabsList.value.splice(tabIndex + (targetItem.type !== 'placeholder' ? 1 : 0), 1);

    // Reset tab if it was active
    if (tab.value === tabItem.value && tabsList.value.length > 0) {
      tab.value = tabsList.value[0].value;
    } else if (tabsList.value.length === 0) {
      tab.value = null;
    }

    draggedTab.value = null;
    draggedTabIndex.value = null;
  }
};

// Drop handler for placeholder layout
const onDropToPlaceholder = (event, placeholderId, dropIndex) => {
  event.preventDefault();

  const placeholderIndex = placeHolderLayout.value.findIndex(item => item.id === placeholderId);
  if (placeholderIndex === -1) return;

  // Handle component or placeholder drop from componentOrder
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    const targetItem = placeHolderLayout.value[placeholderIndex];

    if (targetItem.type === 'placeholder') {
      // Replace placeholder with component
      placeHolderLayout.value[placeholderIndex] = {
        id: placeholderId,
        type: dragged.type,
        component: dragged.type === 'component' ? markRaw(dragged.component) : null,
        cols: targetItem.cols,
        title: dragged.title,
      };
      // Replace dragged item in componentOrder with placeholder
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });
    } else {
      // Swap with existing component in placeHolderLayout
      placeHolderLayout.value[placeholderIndex] = {
        id: placeholderId,
        type: dragged.type,
        component: dragged.type === 'component' ? markRaw(dragged.component) : null,
        cols: targetItem.cols,
        title: dragged.title,
      };
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'component',
        component: markRaw(targetItem.component),
        cols: dragged.cols,
        title: targetItem.title,
      });
    }

    draggedItem.value = null;
    draggedIndex.value = null;
  }

  // Handle placeholder drop from placeHolderLayout
  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;

    // Swap within placeHolderLayout
    placeHolderLayout.value.splice(fromIndex, 1);
    placeHolderLayout.value.splice(placeholderIndex, 0, dragged);

    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
  }

  // Handle tab drop
  if (draggedTab.value) {
    const tabItem = draggedTab.value;
    const tabIndex = draggedTabIndex.value;
    const targetItem = placeHolderLayout.value[placeholderIndex];

    if (targetItem.type === 'placeholder') {
      // Replace placeholder with tab component
      placeHolderLayout.value[placeholderIndex] = {
        id: placeholderId,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
    } else {
      // Swap tab with component
      placeHolderLayout.value[placeholderIndex] = {
        id: placeholderId,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
      // Add target component to tabsList at the dragged tab's index
      tabsList.value.splice(tabIndex, 0, {
        title: targetItem.title,
        value: `custom-${targetItem.id}-${Date.now()}`,
        component: markRaw(targetItem.component),
      });
    }

    // Remove tab from tabsList
    tabsList.value.splice(tabIndex + (targetItem.type !== 'placeholder' ? 1 : 0), 1);

    // Reset tab if it was active
    if (tab.value === tabItem.value && tabsList.value.length > 0) {
      tab.value = tabsList.value[0].value;
    } else if (tabsList.value.length === 0) {
      tab.value = null;
    }

    draggedTab.value = null;
    draggedTabIndex.value = null;
  }
};

// Drop handler for reordering tabs
const onDropTab = (event, dropIndex) => {
  event.preventDefault();

  if (draggedTab.value) {
    const fromIndex = draggedTabIndex.value;

    if (fromIndex === dropIndex) return;

    const dragged = tabsList.value.splice(fromIndex, 1)[0];
    tabsList.value.splice(dropIndex, 0, dragged);

    draggedTab.value = null;
    draggedTabIndex.value = null;
  }

  // Handle component drop to swap with tab
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    const targetTab = tabsList.value[dropIndex];

    // Replace tab with component
    tabsList.value[dropIndex] = {
      title: dragged.title,
      value: `custom-${dragged.id}-${Date.now()}`,
      component: markRaw(dragged.component),
    };

    // Replace dragged item in componentOrder with tab component
    componentOrder.value.splice(fromIndex, 1, {
      id: dragged.id,
      type: 'component',
      component: markRaw(targetTab.component),
      cols: dragged.cols,
      title: targetTab.title,
    });

    draggedItem.value = null;
    draggedIndex.value = null;
  }

  // Handle placeholder drop to swap with tab
  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    const targetTab = tabsList.value[dropIndex];

    // Replace tab with placeholder
    tabsList.value[dropIndex] = {
      title: 'Placeholder',
      value: `custom-${dragged.id}-${Date.now()}`,
      component: null,
    };

    // Replace dragged placeholder in placeHolderLayout with tab component
    placeHolderLayout.value.splice(fromIndex, 1, {
      id: dragged.id,
      type: 'component',
      component: markRaw(targetTab.component),
      cols: dragged.cols,
      title: targetTab.title,
    });

    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
  }
};

// Drop handler for tabs
const onDropToTabs = (event) => {
  event.preventDefault();
  if (!draggedItem.value && !draggedPlaceholder.value) return;

  if (draggedItem.value) {
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

    draggedItem.value = null;
    draggedIndex.value = null;
  }

  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;

    // Add placeholder as a tab (no component)
    const tabValue = `custom-${dragged.id}-${Date.now()}`;
    tabsList.value.push({
      title: 'Placeholder',
      value: tabValue,
      component: null,
    });

    // Remove placeholder from placeHolderLayout
    placeHolderLayout.value.splice(fromIndex, 1);

    // Activate the new tab
    tab.value = tabValue;

    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
  }
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

// Delete the col of placeholder
const deletePlaceholderColumn = (id, index) => {
  const itemIndex = placeHolderLayout.value.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  placeHolderLayout.value.splice(itemIndex, 1);
  adjustPlaceholderWidth();
};

// Adjust col of placeholder after the deletion of placeholder cols
const adjustPlaceholderWidth = () => {
  const totalCols = 12;
  const visibleColumns = placeHolderLayout.value;
  const count = visibleColumns.length;

  if (count === 0) return;

  const baseWidth = Math.floor(totalCols / count);
  const remainder = totalCols % count;
  placeHolderLayout.value.forEach((item, index) => {
    item.cols = index === count - 1 ? baseWidth + remainder : baseWidth;
  });
};

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

.trash-column {
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 20px;
  color: #c03131ed;
}

.hover-grip-placeholder {
  position: absolute;
  z-index: 1;
  right: 20px;
  top: 10px;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.component-container {
  height: 100%;
  min-height: 600px;
}
</style>