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
            <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="drawer = true">
              <i class="fa-regular fa-pen-to-square"></i>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Drawer -->
      <v-navigation-drawer class="drawer-section" v-model="drawer" left permanent width="400">
        <v-tabs v-model="tabs" class="d-flex align-items-center justify-content-between position-relative">
          <div class="me-5">
            <v-tab value="one">PlaceHolders</v-tab>
            <v-tab value="two">Components</v-tab>
          </div>
          <div class="position-absolute xmark" @click="drawer = false">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </v-tabs>

        <v-divider class="m-0"></v-divider>

        <v-tabs-window v-model="tabs">
          <v-tabs-window-item value="one">
            <div class="mt-2">
              <h6 class="m-0 mt-4 text-center">Select Placeholders Columns</h6>
              <!-- Placeholder card -->
              <div class="mt-3 w-100 d-flex align-items-center justify-content-center">
                <v-card class="placeholder-card mb-2" width="300" elevation="5">
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
                </v-card>
              </div>
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="two">
            <v-list density="compact" nav>
              <v-list-item>
                <div class="d-flex justify-content-between align-items-center p-3"
                  v-for="(item, index) in componentHeading" :key="index" :draggable="!item.visibility"
                  @dragstart="onHiddenComponentDragStart($event, item)">
                  <p class="m-0">{{ item.title }}</p>
                  <div @click="hideShowComponent(item)">
                    <i :class="item.icon"></i>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-navigation-drawer>

      <!-- component order row -->
      <v-row :class="{ 'component-order-row': componentOrder.length > 0 }" @mouseenter="hoverRow = true" @mouseleave="hoverRow = false">
        <v-tooltip text="Delete entire row" location="left">
          <template v-slot:activator="{ props }">
            <div class="trash-row" v-if="hoverRow" v-bind="props" @click="deleteComponentRow">
              <i class="fa-solid fa-trash"></i>
            </div>
          </template>
        </v-tooltip>
        
        <div class="d-flex flex-wrap w-100">
          <v-col v-for="(componentItem, index) in componentOrder" :key="index" :cols="componentItem.cols"
            @mouseenter="hoverGrip = componentItem.id" @mouseleave="hoverGrip = null" class="position-relative"
            :draggable="true" @dragstart="onDragStart($event, componentItem, index)" @dragover="onDragOver($event)"
            @drop="onDrop($event, index)">

            <v-tooltip text="Delete column" location="top">
              <template v-slot:activator="{ props }">
                <div class="trash-column" v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'"
                  v-bind="props" @click="deleteColumn(componentItem.id, index)">
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
            <v-btn v-if="hoverGrip === componentItem.id" color="warning" variant="tonal" class="width-btn" small
              @click="toggleWidthOptions(componentItem.id)">
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
                @click="deletePlaceholderColumn(item.id, index)">
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

          <!-- Column width button for placeholder -->
          <v-btn v-if="hoverGripPlaceHolder === item.id" color="warning" variant="tonal" class="width-btn" small
            @click="toggleWidthOptions(item.id, 'placeholder')">
            Column width
          </v-btn>

          <!-- Column width toggle for placeholder -->
          <v-btn-toggle v-if="showColumnWidthToggle[item.id]" class="toggle-btns border-thin" v-model="toggle_exclusive"
            small>
            <v-btn @click="setColumnWidth(item.id, 4, 'placeholder')">33%</v-btn>
            <v-btn @click="setColumnWidth(item.id, 6, 'placeholder')">50%</v-btn>
            <v-btn @click="setColumnWidth(item.id, 8, 'placeholder')">66%</v-btn>
            <v-btn @click="setColumnWidth(item.id, 12, 'placeholder')">100%</v-btn>
            <v-btn @click="resetColumnWidth(item.id)">X</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <!-- Tabs with drag-and-drop support -->
      <div class="mt-4">
        <VTabs v-model="tab" background-color="primary" dark class="mb-3" @dragover="onDragOver($event)"
          @drop="onDropToTabs($event)">
          <VTab v-for="(tabItem, index) in tabsList" :key="index" :value="tabItem.value"
            :class="{ 'active-tab': tab === tabItem.value }" draggable="true"
            @dragstart="onTabDragStart($event, tabItem, index)" @drop="onDropTab($event, index)"
            @mouseenter="hoverTabDeleteIcon = tabItem.id" @mouseleave="hoverTabDeleteIcon = null">
            <span class="me-2"><i class="fa-regular fa-user"></i></span> {{ tabItem.title }}
            <span class="trash-tab-delete-icon" v-if="hoverTabDeleteIcon === tabItem.id" @click="deleteTab(index)">
              <i class="fa-solid fa-trash"></i>
            </span>
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
import { ref } from 'vue';
import { markRaw } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const drawer = ref(false);
const tabs = ref('one');

const componentHeading = ref([
  {
    title: "Personal Detail",
    icon: 'fa-solid fa-eye',
    component: PersonalDetails,
    visibility: true
  },
  {
    title: "Purchasing Detail",
    icon: 'fa-solid fa-eye',
    component: PurchasingDetails,
    visibility: true
  },
  {
    title: "Consumer Note",
    icon: 'fa-solid fa-eye',
    component: CustomerNote,
    visibility: true
  },
  {
    title: "Order",
    icon: 'fa-solid fa-eye',
    component: OrderTab,
    visibility: true
  },
  {
    title: "Timeline",
    icon: 'fa-solid fa-eye',
    component: TimelineTab,
    visibility: true
  },
  {
    title: "Billing",
    icon: 'fa-solid fa-eye',
    component: BillingTab,
    visibility: true
  },
  {
    title: "Notification",
    icon: 'fa-solid fa-eye',
    component: Notification,
    visibility: true
  },
  {
    title: "Email",
    icon: 'fa-solid fa-eye',
    component: EmailTab,
    visibility: true
  },
]);

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
  { id: 1, type: 'component', component: markRaw(PersonalDetails), cols: 4, title: 'Personal Details' },
  { id: 2, type: 'component', component: markRaw(PurchasingDetails), cols: 4, title: 'Purchasing Details' },
  { id: 3, type: 'component', component: markRaw(CustomerNote), cols: 4, title: 'Customer Note' },
]);

const hoverGrip = ref(null);
const hoverPlaceholder = ref(null);
const hoverGripPlaceHolder = ref(null);
const showColumnWidthToggle = ref({});
const hoverTabDeleteIcon = ref(null);
const hoverRow = ref(false);

const draggedItem = ref(null);
const draggedIndex = ref(null);
const draggedTab = ref(null);
const draggedTabIndex = ref(null);
const draggedPlaceholder = ref(null);
const draggedPlaceholderIndex = ref(null);
const draggedHiddenComponent = ref(null);


// Tabs list with component field for dynamic content
const tab = ref('orders');
const tabsList = ref([
  { title: 'Orders', value: 'orders', component: markRaw(OrderTab), id: 1, },
  { title: 'Timeline', value: 'timeline', component: markRaw(TimelineTab), id: 2, },
  { title: 'Billing', value: 'billing', component: markRaw(BillingTab), id: 3, },
  { title: 'Notifications', value: 'notifications', component: markRaw(Notification), id: 4, },
  { title: 'Email', value: 'email', component: markRaw(EmailTab), id: 5, },
]);

// function for toggle visibility of component 
const hideShowComponent = (item) => {
  const headingItem = componentHeading.value.find((heading) => heading.component === item.component);
  if (!headingItem) return;

  if (headingItem.visibility) {
    // Clear previous stored positions
    headingItem.storedComponent = null;
    headingItem.storedPlaceholder = null;
    headingItem.storedTab = null;

    // Check in componentOrder
    const componentIndex = componentOrder.value.findIndex(
      (component) => component.component === item.component && component.type === 'component'
    );

    if (componentIndex !== -1) {
      headingItem.storedComponent = {
        component: componentOrder.value[componentIndex].component,
        title: componentOrder.value[componentIndex].title,
        index: componentIndex,
      };
      componentOrder.value[componentIndex] = {
        id: componentOrder.value[componentIndex].id,
        type: 'placeholder',
        cols: componentOrder.value[componentIndex].cols,
      };
    }

    // Check in placeHolderLayout
    const placeholderIndex = placeHolderLayout.value.findIndex(
      (component) => component.component === item.component && component.type === 'component'
    );
    if (placeholderIndex !== -1) {
      headingItem.storedPlaceholder = {
        component: placeHolderLayout.value[placeholderIndex].component,
        title: placeHolderLayout.value[placeholderIndex].title,
        index: placeholderIndex,
      };
      placeHolderLayout.value[placeholderIndex] = {
        id: placeHolderLayout.value[placeholderIndex].id,
        type: 'placeholder',
        cols: placeHolderLayout.value[placeholderIndex].cols,
      };
    }

    // Check in tabsList
    const tabIndex = tabsList.value.findIndex((tabItem) => tabItem.component === item.component);
    if (tabIndex !== -1) {
      headingItem.storedTab = {
        title: tabsList.value[tabIndex].title,
        value: tabsList.value[tabIndex].value,
        component: tabsList.value[tabIndex].component,
        index: tabIndex,
      };
      const removedTab = tabsList.value[tabIndex];
      tabsList.value.splice(tabIndex, 1);

      if (tab.value === removedTab.value) {
        tab.value = tabsList.value.length > 0 ? tabsList.value[0].value : null;
      }
    }

    headingItem.icon = 'fa-solid fa-eye-slash';
    headingItem.visibility = false;
  } else {
    // Restore to the current or most logical position
    let restored = false;

    // Try to restore to current location if it exists
    if (headingItem.storedComponent) {
      const targetIndex = headingItem.storedComponent.index;
      if (componentOrder.value[targetIndex]?.type === 'placeholder') {
        componentOrder.value[targetIndex] = {
          id: componentOrder.value[targetIndex].id,
          type: 'component',
          component: headingItem.storedComponent.component,
          cols: componentOrder.value[targetIndex].cols,
          title: headingItem.storedComponent.title,
        };
        restored = true;
      }
    } else if (headingItem.storedPlaceholder) {
      const targetIndex = headingItem.storedPlaceholder.index;
      if (placeHolderLayout.value[targetIndex]?.type === 'placeholder') {
        placeHolderLayout.value[targetIndex] = {
          id: placeHolderLayout.value[targetIndex].id,
          type: 'component',
          component: headingItem.storedPlaceholder.component,
          cols: placeHolderLayout.value[targetIndex].cols,
          title: headingItem.storedPlaceholder.title,
        };
        restored = true;
      }
    } else if (headingItem.storedTab) {
      tabsList.value.splice(headingItem.storedTab.index, 0, {
        title: headingItem.storedTab.title,
        value: headingItem.storedTab.value,
        component: headingItem.storedTab.component,
      });
      if (!tab.value && tabsList.value.length > 0) {
        tab.value = tabsList.value[headingItem.storedTab.index].value;
      }
      restored = true;
    }

    // If not restored (e.g., placeholder was deleted), add to componentOrder as a fallback
    if (!restored) {
      componentOrder.value.push({
        id: uuidv4(),
        type: 'component',
        component: markRaw(item.component),
        cols: 4, // Default width
        title: item.title,
      });
    }

    headingItem.icon = 'fa-solid fa-eye';
    headingItem.visibility = true;
    headingItem.storedComponent = null;
    headingItem.storedPlaceholder = null;
    headingItem.storedTab = null;
  }
};

// Drag start for hidden components from componentHeading
const onHiddenComponentDragStart = (event, item) => {
  if (item.visibility) return;
  draggedHiddenComponent.value = item;
  event.dataTransfer.setData('drawerComponentDrag', item.title);
};

// Deleting component cols
const deleteColumn = (id, index) => {
  const deletedComponent = componentOrder.value[index];

  // Only proceed if the deleted item is a component (not a placeholder)
  if (deletedComponent.type === 'component') {
    // Find the corresponding component in componentHeading
    const headingItem = componentHeading.value.find(
      (heading) => heading.component === deletedComponent.component
    );

    if (headingItem) {
      // Update visibility and icon
      headingItem.visibility = false;
      headingItem.icon = 'fa-solid fa-eye-slash';

      // Store the component's position for restoration
      headingItem.storedComponent = {
        component: deletedComponent.component,
        title: deletedComponent.title,
        index: index,
      };
    }
  }

  // Remove the column and adjust widths
  componentOrder.value.splice(index, 1);
  adjustColumnWidths();
};

// delete the tab form the tab list 
const deleteTab = (index) => {
  const deletedTab = tabsList.value[index];
  tabsList.value.splice(index, 1);

  // Find the corresponding component in componentHeading
  const headingItem = componentHeading.value.find((heading) => heading.component === deletedTab.component);

  if (headingItem) {
    // update icon visiblility and hide the component
    headingItem.visibility = false;
    headingItem.icon = 'fa-solid fa-eye-slash';

    //  store  tab position for restore
    headingItem.storedTab = {
      title: deletedTab.title,
      value: deletedTab.value,
      component: deletedTab.component,
      index: index,
    };
  }

  // Update the active tab if the deleted tab was active
  if (tab.value === deletedTab.value && tabsList.value.length > 0) {
    tab.value = tabsList.value[0].value;
  } else if (tabsList.value.length === 0) {
    tab.value = null;
  }
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

  // Handle hidden component drop
  if (draggedHiddenComponent.value) {
    const targetItem = componentOrder.value[dropIndex];
    if (targetItem.type === 'placeholder') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(draggedHiddenComponent.value.component),
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
    }

    const headingItem = componentHeading.value.find((heading) => heading.component === draggedHiddenComponent.value.component);
    if (headingItem) {
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.visibility = true;
    }
    draggedHiddenComponent.value = null;
    return;
  }

  // Handle component or placeholder drop from componentOrder
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    componentOrder.value.splice(fromIndex, 1);
    componentOrder.value.splice(dropIndex, 0, dragged);
    draggedItem.value = null;
    draggedIndex.value = null;
  }

  // Handle placeholder drop from placeHolderLayout
  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    const targetItem = componentOrder.value[dropIndex];

    // Swap logic: Replace targetItem with dragged item, adopting targetItem's width
    if (dragged.type === 'component') {
      // Dragging a component from placeHolderLayout
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(dragged.component),
        cols: targetItem.cols, // Adopt targetItem's width
        title: dragged.title,
      };
      placeHolderLayout.value[fromIndex] = {
        id: dragged.id,
        type: targetItem.type,
        component: targetItem.type === 'component' ? markRaw(targetItem.component) : null,
        cols: dragged.cols, // Retain original dragged cols for placeHolderLayout
        title: targetItem.title,
      };
    } else {
      // Dragging a placeholder from placeHolderLayout
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'placeholder',
        cols: targetItem.cols, // Adopt targetItem's width
      };
      placeHolderLayout.value[fromIndex] = {
        id: dragged.id,
        type: targetItem.type,
        component: targetItem.type === 'component' ? markRaw(targetItem.component) : null,
        cols: dragged.cols, // Retain original dragged cols for placeHolderLayout
        title: targetItem.title,
      };
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
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
    } else {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
      tabsList.value.splice(tabIndex, 0, {
        title: targetItem.title,
        value: `custom-${targetItem.id}-${Date.now()}`,
        component: markRaw(targetItem.component),
      });
    }
    tabsList.value.splice(tabIndex + (targetItem.type !== 'placeholder' ? 1 : 0), 1);
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

  // Handle hidden component drop to placeholder row
  if (draggedHiddenComponent.value) {
    const targetItem = placeHolderLayout.value[placeholderIndex];
    if (targetItem.type === 'placeholder') {
      placeHolderLayout.value[placeholderIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(draggedHiddenComponent.value.component),
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
    }
    const headingItem = componentHeading.value.find((heading) => heading.component === draggedHiddenComponent.value.component);
    if (headingItem) {
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.visibility = true;
    }
    draggedHiddenComponent.value = null;
    return;
  }

  // Handle component or placeholder drop from componentOrder
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    const targetItem = placeHolderLayout.value[placeholderIndex];
    if (targetItem.type === 'placeholder') {
      placeHolderLayout.value[placeholderIndex] = {
        id: placeholderId,
        type: dragged.type,
        component: dragged.type === 'component' ? markRaw(dragged.component) : null,
        cols: targetItem.cols,
        title: dragged.title,
      };
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });
    } else {
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
      placeHolderLayout.value[placeholderIndex] = {
        id: placeholderId,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
    } else {
      placeHolderLayout.value[placeholderIndex] = {
        id: placeholderId,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
      tabsList.value.splice(tabIndex, 0, {
        title: targetItem.title,
        value: `custom-${targetItem.id}-${Date.now()}`,
        component: markRaw(targetItem.component),
      });
    }
    tabsList.value.splice(tabIndex + (targetItem.type !== 'placeholder' ? 1 : 0), 1);
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

  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    const targetTab = tabsList.value[dropIndex];
    tabsList.value[dropIndex] = {
      title: dragged.title,
      value: `custom-${dragged.id}-${Date.now()}`,
      component: markRaw(dragged.component),
    };
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

  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    const targetTab = tabsList.value[dropIndex];
    tabsList.value[dropIndex] = {
      title: 'Placeholder',
      value: `custom-${dragged.id}-${Date.now()}`,
      component: null,
    };
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

  if (draggedHiddenComponent.value) {
    const tabValue = `custom-${uuidv4()}`;
    tabsList.value.push({
      title: draggedHiddenComponent.value.title,
      value: tabValue,
      component: markRaw(draggedHiddenComponent.value.component),
    });
    tab.value = tabValue;

    // Update visibility and icon in componentHeading
    const headingItem = componentHeading.value.find(
      (heading) => heading.component === draggedHiddenComponent.value.component
    );
    if (headingItem) {
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.visibility = true;
      // Clear stored positions
      headingItem.storedComponent = null;
      headingItem.storedPlaceholder = null;
      headingItem.storedTab = null;
    }

    draggedHiddenComponent.value = null;
    return;
  }

  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    const tabValue = `custom-${dragged.id}-${Date.now()}`;
    const tabTitle = dragged.title;
    tabsList.value.push({
      title: tabTitle,
      value: tabValue,
      component: markRaw(dragged.component),
    });
    componentOrder.value.splice(fromIndex, 1, {
      id: dragged.id,
      type: 'placeholder',
      cols: dragged.cols,
    });
    tab.value = tabValue;
    draggedItem.value = null;
    draggedIndex.value = null;
  }

  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    const tabValue = `custom-${dragged.id}-${Date.now()}`;
    if (dragged.type === 'component') {
      // If dragging a component from placeHolderLayout
      tabsList.value.push({
        title: dragged.title,
        value: tabValue,
        component: markRaw(dragged.component),
        id: uuidv4(),
      });
      placeHolderLayout.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });
    } else {
      // If dragging a placeholder from placeHolderLayout
      tabsList.value.push({
        title: 'Placeholder',
        value: tabValue,
        component: null,
        id: uuidv4(),
      });
      placeHolderLayout.value.splice(fromIndex, 1);
    }
    tab.value = tabValue;
    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
  }
};

// Set column width
const setColumnWidth = (id, width, type = 'component') => {
  if (type === 'component') {
    const component = componentOrder.value.find((item) => item.id === id);
    if (component) {
      component.cols = width;
    }
  } else if (type === 'placeholder') {
    const placeholder = placeHolderLayout.value.find((item) => item.id === id);
    if (placeholder) {
      placeholder.cols = width;
    }
  }
};

// Toggle width options
const toggleWidthOptions = (id, type = 'component') => {
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
};

// Delete the col of placeholder
const deletePlaceholderColumn = (id, index) => {
  const itemIndex = placeHolderLayout.value.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  const deletedPlaceholder = placeHolderLayout.value[itemIndex];

  // Check if the placeholder contains a component
  if (deletedPlaceholder.type === 'component') {
    // Find the corresponding component in componentHeading
    const headingItem = componentHeading.value.find(
      (heading) => heading.component === deletedPlaceholder.component
    );

    if (headingItem) {
      // Update visibility and icon
      headingItem.visibility = false;
      headingItem.icon = 'fa-solid fa-eye-slash';

      // Store the component's position for restoration
      headingItem.storedPlaceholder = {
        component: deletedPlaceholder.component,
        title: deletedPlaceholder.title,
        index: itemIndex,
      };
    }
  }

  // Remove the placeholder and adjust widths
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

// delete the component order row 
const deleteComponentRow = () => {
  componentOrder.value.forEach((item, index) => {
    if (item.type === 'component') {
      const headingItem = componentHeading.value.find((heading) => heading.component === item.component);
      if (headingItem) {
        headingItem.visibility = false;
        headingItem.icon = 'fa-solid fa-eye-slash';
        headingItem.storedComponent = {
          component: item.component,
          title: item.title,
          index: index,
        };
      }
    }
  });

  componentOrder.value = [];
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

.xmark {
  right: 12px;
  top: 2px;
  font-size: 18px;
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

.trash-tab-delete-icon {
  color: #c03131ed;
  position: absolute;
  right: 0;
  top: 0;
}

.component-container {
  height: 100%;
  min-height: 600px;
}

.trash-row {
  position: absolute;
  z-index: 10;
  top: 50px;
  left: 50%;
  color: #c03131ed;
  cursor: pointer;
  font-size: 15px;
}

.component-order-row {
  border: 1px solid blue;
}
</style>