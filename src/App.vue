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


      <div v-for="(section, index) in sectionOrder" :key="section.id" class="section-wrapper"
        @drop="onSectionDrop($event, index)">
        <!-- Component Order Row -->
        <v-row v-if="section.type === 'componentOrder'"
          :class="{ 'component-order-row mt-3': componentOrder.length > 0 }" @mouseenter="hoverRow = true"
          @mouseleave="hoverRow = false" draggable="true" @dragstart="onSectionDragStart($event, section, index)">

          <v-tooltip text="Add Placeholder" location="top">
            <template v-slot:activator="{ props }">
              <div class="placeholder-row" v-if="hoverRow" v-bind="props" @click="drawer = true">
                <i class="fa-solid fa-plus"></i>
              </div>
            </template>
          </v-tooltip>
          <v-tooltip text="Drag entire row" location="top">
            <template v-slot:activator="{ props }">
              <div class="grip-row" v-if="hoverRow" v-bind="props" draggable="true"
                @dragstart="onSectionDragStart($event, section, index)">
                <i class="fa-solid fa-grip-vertical"></i>
              </div>
            </template>
          </v-tooltip>
          <v-tooltip text="Duplicate Row" location="top">
            <template v-slot:activator="{ props }">
              <div class="dublicate-row" v-if="hoverRow" v-bind="props" @click="addPlaceHolderRow([4, 4, 4])">
                <i class="fa-solid fa-clone"></i>
              </div>
            </template>
          </v-tooltip>
          <v-tooltip text="Delete entire row" location="top">
            <template v-slot:activator="{ props }">
              <div class="trash-row" v-if="hoverRow" v-bind="props" @click="deleteComponentRow">
                <i class="fa-solid fa-trash"></i>
              </div>
            </template>
          </v-tooltip>

          <div class="d-flex flex-wrap w-100">
            <v-col v-for="(componentItem, index) in componentOrder" :key="componentItem.id" :cols="componentItem.cols"
              @mouseenter="onMouseEnter(componentItem.id)" @mouseleave="onMouseLeave" @dragover="onDragOver($event)"
              @drop="onDrop($event, index)" class="position-relative">
              <!-- delete column -->
              <v-tooltip text="Delete column" location="top">
                <template v-slot:activator="{ props }">
                  <div class="trash-column"
                    v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'" v-bind="props"
                    @click="deleteColumn(componentItem.id, index)">
                    <i class="fa-solid fa-trash"></i>
                  </div>
                </template>
              </v-tooltip>

              <!-- drag component icon -->
              <v-tooltip text="Drag Component" location="top">
                <template v-slot:activator="{ props }">
                  <div class="drag-component"
                    v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'" v-bind="props">
                    <i class="fa-solid fa-layer-group"></i>
                  </div>
                </template>
              </v-tooltip>

              <!-- duplicate column -->
              <v-tooltip text="Duplicate column" location="top">
                <template v-slot:activator="{ props }">
                  <div class="dublicate-component-column"
                    v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'" v-bind="props"
                    @click="duplicateColumn(componentItem, index)">
                    <i class="fa-solid fa-clone"></i>
                  </div>
                </template>
              </v-tooltip>

              <!-- drag column -->
              <v-tooltip text="Drag column" location="top">
                <template v-slot:activator="{ props }">
                  <div v-if="hoverGrip === componentItem.id" class="grip position-absolute" v-bind="props"
                    :draggable="true" @dragstart="onDragStart($event, componentItem, index)">
                    <i class="fa-solid fa-grip-vertical"></i>
                  </div>
                </template>
              </v-tooltip>

              <component v-if="componentItem.type === 'component'" :is="componentItem.component"
                class="component-container" />


              <div v-else-if="componentItem.type === 'placeholder'" class="placeholder-cols">
                Drag the item
              </div>


              <div v-else-if="componentItem.type === 'tabsList'" class="component-container">
                <v-tabs v-model="tabStates[componentItem.id]" background-color="primary" dark class="mb-3">
                  <v-tab v-for="(tabItem, tabIndex) in componentItem.tabsList" :key="tabIndex" :value="tabItem.value"
                    :class="{ 'active-tab': tabStates[componentItem.id] === tabItem.value }" draggable="true"
                    @dragstart="onTabDragStart($event, tabItem, tabIndex)" @drop="onDropTab($event, tabIndex)"
                    @mouseenter="hoverTabDeleteIcon = tabItem.id" @mouseleave="hoverTabDeleteIcon = null">
                    <span class="me-2"><i class="fa-regular fa-user"></i></span> {{ tabItem.title }}
                    <span class="trash-tab-delete-icon" v-if="hoverTabDeleteIcon === tabItem.id"
                      @click="deleteTab(tabIndex, { value: componentItem.tabsList }, { value: tabStates[componentItem.id] })">
                      <i class="fa-solid fa-trash"></i>
                    </span>
                  </v-tab>
                </v-tabs>
                <v-window v-model="tabStates[componentItem.id]" :touch="false">
                  <v-window-item v-for="(tabItem, tabIndex) in componentItem.tabsList" :key="tabIndex"
                    :value="tabItem.value">
                    <component :is="tabItem.component" />
                  </v-window-item>
                </v-window>
              </div>

              <v-btn v-if="hoverGrip === componentItem.id" color="warning" variant="tonal" class="width-btn" small
                @click="toggleWidthOptions(componentItem.id)">
                Column width
              </v-btn>
              <v-btn-toggle v-if="showColumnWidthToggle[componentItem.id]" class="toggle-btns border-thin"
                v-model="toggle_exclusive" small>
                <v-btn @click="setColumnWidth(componentItem.id, 4)">33%</v-btn>
                <v-btn @click="setColumnWidth(componentItem.id, 6)">50%</v-btn>
                <v-btn @click="setColumnWidth(componentItem.id, 8)">66%</v-btn>
                <v-btn @click="setColumnWidth(componentItem.id, 12)">100%</v-btn>
                <v-btn @click="closeToggleBtns(componentItem.id)">X</v-btn>
              </v-btn-toggle>
            </v-col>
          </div>
        </v-row>

        <!-- Dynamic placeholder row -->
        <v-row class="" v-if="section.type === 'componentOrder'">
          <v-col v-for="(item, index) in placeHolderLayout" :key="item.id" :cols="item.cols"
            @dragover="onDragOver($event)" @drop="onDropToPlaceholder($event, item.id, index)"
            @mouseenter="onMouseEnterPlaceholder(item.id)" @mouseleave="onMouseLeavePlaceholder"
            class="position-relative">
            <v-tooltip text="Delete column" location="right">
              <template v-slot:activator="{ props }">
                <div class="trash-column" v-if="hoverPlaceholder === item.id" v-bind="props"
                  @click="deletePlaceholderColumn(item.id, index)">
                  <i class="fa-solid fa-trash"></i>
                </div>
              </template>
            </v-tooltip>
            <v-tooltip text="Duplicate column" location="right">
              <template v-slot:activator="{ props }">
                <div class="dublicate-component-column"
                  v-if="hoverGripPlaceHolder === item.id && item.type !== 'placeholder'" v-bind="props">
                  <i class="fa-solid fa-clone" @click="duplicatePlaceholderColumn(item, index)"></i>
                </div>
              </template>
            </v-tooltip>

            <v-tooltip text="Drag column" location="right">
              <template v-slot:activator="{ props }">
                <div v-if="hoverGripPlaceHolder === item.id" class="hover-grip-placeholder" v-bind="props"
                  :draggable="true" @dragstart="onPlaceholderDragStart($event, item, index)">
                  <i class="fa-solid fa-grip-vertical"></i>
                </div>
              </template>
            </v-tooltip>

            <div v-if="item.type === 'component'" class="component-container">
              <component :is="item.component" />
            </div>

            <!-- for make the tabs of all the components in the placeholder 12 -->
            <div v-else-if="item.type === 'tabsList'" class="component-container">
              <v-tabs v-model="tabStates[item.id]" background-color="primary" dark class="mb-3">
                <v-tab v-for="(tabItem, tabIndex) in item.tabsList" :key="tabIndex" :value="tabItem.value"
                  :class="{ 'active-tab': tabStates[item.id] === tabItem.value }" draggable="true"
                  @dragstart="onTabDragStart($event, tabItem, tabIndex, item.id)"
                  @drop="onDropTab($event, tabIndex, item.id)" @mouseenter="hoverTabDeleteIcon = tabItem.id"
                  @mouseleave="hoverTabDeleteIcon = null">
                  <span class="me-2"><i class="fa-regular fa-user"></i></span> {{ tabItem.title }}
                  <span class="trash-tab-delete-icon" v-if="hoverTabDeleteIcon === tabItem.id"
                    @click="deleteTab(tabIndex, { value: item.tabsList }, { value: tabStates[item.id] })">
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </v-tab>
              </v-tabs>
              <v-window v-model="tabStates[item.id]" :touch="false">
                <v-window-item v-for="(tabItem, tabIndex) in item.tabsList" :key="tabIndex" :value="tabItem.value">
                  <component :is="tabItem.component" />
                </v-window-item>
              </v-window>
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
            <v-btn-toggle v-if="showColumnWidthToggle[item.id]" class="toggle-btns border-thin"
              v-model="toggle_exclusive" small>
              <v-btn @click="setColumnWidth(item.id, 4, 'placeholder')">33%</v-btn>
              <v-btn @click="setColumnWidth(item.id, 6, 'placeholder')">50%</v-btn>
              <v-btn @click="setColumnWidth(item.id, 8, 'placeholder')">66%</v-btn>
              <v-btn @click="setColumnWidth(item.id, 12, 'placeholder')">100%</v-btn>
              <v-btn @click="closeToggleBtns(item.id)">X</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <!-- Tabs Section -->
        <div v-if="section.type === 'tabsList'" class="component-order-row " @mouseenter="hoverTablistRow = true"
          @mouseleave="hoverTablistRow = false">

          <v-tooltip text="Delete entire row" location="top">
            <template v-slot:activator="{ props }">
              <div class="trash-tablist-row" v-if="hoverTablistRow" v-bind="props" @click="deleteTabsSection">
                <i class="fa-solid fa-trash"></i>
              </div>
            </template>
          </v-tooltip>

          <v-tooltip text="Add Placeholder" location="top">
            <template v-slot:activator="{ props }">
              <div class="placeholder-tablist-row" v-if="hoverTablistRow" v-bind="props" @click="drawer = true">
                <i class="fa-solid fa-plus"></i>
              </div>
            </template>
          </v-tooltip>

          <v-tooltip text="Duplicate Row" location="top">
            <template v-slot:activator="{ props }">
              <div class="dublicate-tablist-row" v-if="hoverTablistRow" v-bind="props" @click="addPlaceHolderRow([12])">
                <i class="fa-solid fa-clone"></i>
              </div>
            </template>
          </v-tooltip>

          <v-tooltip text="Drag entire row" location="top">
            <template v-slot:activator="{ props }">
              <div class="grip-tablist-row" v-if="hoverTablistRow" v-bind="props" draggable="true"
                @dragstart="onSectionDragStart($event, section, index)">
                <i class="fa-solid fa-grip-vertical"></i>
              </div>
            </template>
          </v-tooltip>

          <!-- drag all column of tabs -->
          <v-tooltip text="Drag All columns" location="left">
            <template v-slot:activator="{ props }">
              <div class="drag-all-column" v-if="hoverTablistRow" v-bind="props" draggable="true"
                @dragstart="onAllTabsDragStart($event)">
                <i class="fa-solid fa-layer-group"></i>
              </div>
            </template>
          </v-tooltip>

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
  {
    title: "Tabs",
    icon: 'fa-solid fa-eye-slash',
    visibility: false,
    storedTabsList: null,
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
const hoverTablistRow = ref(false)

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

const isDraggingAllTabs = ref(false);

const onMouseEnter = (id) => {
  hoverGrip.value = id;
};

const onMouseLeave = () => {
  hoverGrip.value = null;
};

const onMouseEnterPlaceholder = (id) => {
  hoverGripPlaceHolder.value = id;
  hoverPlaceholder.value = id;
};

const onMouseLeavePlaceholder = () => {
  hoverGripPlaceHolder.value = null;
  hoverPlaceholder.value = null;
};


// function for toggle visibility of component 
const hideShowComponent = (item) => {
  const headingItem = componentHeading.value.find((heading) => heading.component === item.component || heading.title === item.title);
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
        cols: componentOrder.value[componentIndex].cols,
      };
      componentOrder.value[componentIndex] = {
        id: componentOrder.value[componentIndex].id,
        type: 'placeholder',
        cols: componentOrder.value[componentIndex].cols,
      };
    }

    // Check in placeHolderLayout (for components)
    const placeholderIndex = placeHolderLayout.value.findIndex(
      (component) => component.component === item.component && component.type === 'component'
    );
    if (placeholderIndex !== -1) {
      headingItem.storedPlaceholder = {
        component: placeHolderLayout.value[placeholderIndex].component,
        title: placeHolderLayout.value[placeholderIndex].title,
        index: placeholderIndex,
        cols: placeHolderLayout.value[placeholderIndex].cols,
      };
      placeHolderLayout.value[placeholderIndex] = {
        id: placeHolderLayout.value[placeholderIndex].id,
        type: 'placeholder',
        cols: placeHolderLayout.value[placeholderIndex].cols,
      };
    }

    // Check in tabsList (main tabs section)
    const tabIndex = tabsList.value.findIndex((tabItem) => tabItem.component === item.component);
    if (tabIndex !== -1) {
      headingItem.storedTab = {
        title: tabsList.value[tabIndex].title,
        value: tabsList.value[tabIndex].value,
        component: tabsList.value[tabIndex].component,
        index: tabIndex,
        tabsListId: null, // Main tabsList
      };
      const removedTab = tabsList.value[tabIndex];
      tabsList.value.splice(tabIndex, 1);

      if (tab.value === removedTab.value) {
        tab.value = tabsList.value.length > 0 ? tabsList.value[0].value : null;
      }
    }

    // Check in placeHolderLayout's tabsList (cols="12" tabs)
    let tabsListIndex = -1;
    let tabsListId = null;
    placeHolderLayout.value.forEach((layoutItem, layoutIndex) => {
      if (layoutItem.type === 'tabsList') {
        const foundIndex = layoutItem.tabsList.findIndex((tabItem) => tabItem.component === item.component);
        if (foundIndex !== -1) {
          tabsListIndex = foundIndex;
          tabsListId = layoutItem.id;
        }
      }
    });

    if (tabsListIndex !== -1 && tabsListId) {
      const targetTabsList = placeHolderLayout.value.find(item => item.id === tabsListId).tabsList;
      headingItem.storedTab = {
        title: targetTabsList[tabsListIndex].title,
        value: targetTabsList[tabsListIndex].value,
        component: targetTabsList[tabsListIndex].component,
        index: tabsListIndex,
        tabsListId: tabsListId, // Store tabsListId to restore in correct tabsList
      };
      const removedTab = targetTabsList[tabsListIndex];
      targetTabsList.splice(tabsListIndex, 1);

      if (tabStates.value[tabsListId] === removedTab.value) {
        tabStates.value[tabsListId] = targetTabsList.length > 0 ? targetTabsList[0].value : null;
      }

      // If tabsList becomes empty, revert to placeholder
      if (targetTabsList.length === 0) {
        const layoutItem = placeHolderLayout.value.find(item => item.id === tabsListId);
        layoutItem.type = 'placeholder';
        layoutItem.tabsList = [];
        const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
        if (tabsHeading) {
          tabsHeading.visibility = false;
          tabsHeading.icon = 'fa-solid fa-eye-slash';
          tabsHeading.storedTabsList = null;
        }
      }
    }

    headingItem.icon = 'fa-solid fa-eye-slash';
    headingItem.visibility = false;
  } else {
    // Restore to the current or most logical position
    let restored = false;

    // Try to restore to storedComponent (componentOrder)
    if (headingItem.storedComponent) {
      const targetIndex = headingItem.storedComponent.index;
      if (componentOrder.value[targetIndex]?.type === 'placeholder') {
        componentOrder.value[targetIndex] = {
          id: componentOrder.value[targetIndex].id,
          type: 'component',
          component: headingItem.storedComponent.component,
          cols: headingItem.storedComponent.cols,
          title: headingItem.storedComponent.title,
        };
        restored = true;
      }
    }

    // Try to restore to storedPlaceholder (placeHolderLayout)
    if (!restored && headingItem.storedPlaceholder) {
      const targetIndex = headingItem.storedPlaceholder.index;
      if (placeHolderLayout.value[targetIndex]?.type === 'placeholder') {
        placeHolderLayout.value[targetIndex] = {
          id: placeHolderLayout.value[targetIndex].id,
          type: 'component',
          component: headingItem.storedPlaceholder.component,
          cols: headingItem.storedPlaceholder.cols,
          title: headingItem.storedPlaceholder.title,
        };
        restored = true;
      }
    }

    // Try to restore to storedTab (main tabsList or cols="12" tabsList)
    if (!restored && headingItem.storedTab) {
      const { tabsListId, index, title, value, component } = headingItem.storedTab;
      if (tabsListId) {
        // Restore to cols="12" tabsList in placeHolderLayout
        const targetLayoutItem = placeHolderLayout.value.find(item => item.id === tabsListId);
        if (targetLayoutItem && (targetLayoutItem.type === 'tabsList' || targetLayoutItem.type === 'placeholder')) {
          if (targetLayoutItem.type === 'placeholder') {
            targetLayoutItem.type = 'tabsList';
            targetLayoutItem.tabsList = [];
            initializeTabState(tabsListId);
          }
          targetLayoutItem.tabsList.splice(index, 0, {
            id: uuidv4(),
            title,
            value,
            component: markRaw(component),
          });
          if (!tabStates.value[tabsListId]) {
            tabStates.value[tabsListId] = value;
          }
          const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
          if (tabsHeading) {
            tabsHeading.visibility = false;
            tabsHeading.icon = 'fa-solid fa-eye-slash';
            tabsHeading.storedTabsList = {
              tabsList: targetLayoutItem.tabsList.map(tab => ({
                ...tab,
                component: markRaw(tab.component),
              })),
              id: tabsListId,
            };
          }
          restored = true;
        }
      } else {
        // Restore to main tabsList
        tabsList.value.splice(index, 0, {
          id: uuidv4(),
          title,
          value,
          component: markRaw(component),
        });
        if (!tab.value && tabsList.value.length > 0) {
          tab.value = tabsList.value[index].value;
        }
        restored = true;
      }
    }

    // Fallback: Add to componentOrder if not restored
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
const deleteTab = (index, tabsListRef = tabsList, tabStateRef = tab) => {
  const deletedTab = tabsListRef.value[index];
  tabsListRef.value.splice(index, 1);

  const headingItem = componentHeading.value.find(h => h.component === deletedTab.component);
  if (headingItem) {
    headingItem.visibility = false;
    headingItem.icon = 'fa-solid fa-eye-slash';
    headingItem.storedTab = {
      title: deletedTab.title,
      value: deletedTab.value,
      component: deletedTab.component,
      index: index,
    };
  }

  if (tabStateRef.value === deletedTab.value && tabsListRef.value.length > 0) {
    tabStateRef.value = tabsListRef.value[0].value;
  } else if (tabsListRef.value.length === 0) {
    tabStateRef.value = null;
    if (tabsListRef !== tabsList) {
      const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
      if (tabsHeading && tabsHeading.storedTabsList) {
        const targetItem = placeHolderLayout.value.find(item => item.id === tabsHeading.storedTabsList.id);
        if (targetItem) {
          targetItem.type = 'placeholder';
          targetItem.tabsList = [];
        }
        tabsHeading.visibility = false;
        tabsHeading.icon = 'fa-solid fa-eye-slash';
        tabsHeading.storedTabsList = null;
      }
    }
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
const onTabDragStart = (event, tabItem, index, tabsListId = null) => {
  draggedTab.value = tabItem;
  draggedTabIndex.value = index;
  draggedTab.value.tabsListId = tabsListId;
  event.dataTransfer.setData('tabDrag', tabItem.value);
};

// Drag over handler
const onDragOver = (event) => {
  event.preventDefault();
};

// Drop handler for componentOrder
const onDrop = (event, dropIndex) => {
  event.preventDefault();

  // Handle Drag and Drop of Entire tabs lsit
  if (isDraggingAllTabs.value) {
    const targetItem = componentOrder.value[dropIndex];

    // If the target is a placeholder
    if (targetItem.type === 'placeholder') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'tabsList',
        tabsList: tabsList.value.map(tabItem => ({
          ...tabItem,
          component: markRaw(tabItem.component),
        })),
        cols: targetItem.cols,
      };
      tabsList.value = [];
      // Initialize new tab state
      initializeTabState(targetItem.id);
    }
    // If the target is a component
    else if (targetItem.type === 'component') {
      const tempComponent = {
        id: targetItem.id,
        title: targetItem.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(targetItem.component),
        id: uuidv4(),
      };
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'tabsList',
        tabsList: tabsList.value.map(tabItem => ({
          ...tabItem,
          component: markRaw(tabItem.component),
        })),
        cols: targetItem.cols,
      };
      tabsList.value = [tempComponent];
      // Initialize new tab state
      initializeTabState(targetItem.id);

      // Update visibility of the new tab in componentHeading
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === tempComponent.component
      );
      if (headingItem) {
        headingItem.visibility = true;
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.storedTab = null;
        headingItem.storedComponent = null;
      }
    }
    // If the target is a tabsList
    else if (targetItem.type === 'tabsList') {
      const targetTabsList = targetItem.tabsList;
      // There should be only one tab in tabsList (e.g., PersonalDetails)
      if (tabsList.value.length === 1) {
        const singleTab = tabsList.value[0];
        componentOrder.value[dropIndex] = {
          id: targetItem.id,
          type: 'component',
          component: markRaw(singleTab.component),
          cols: targetItem.cols,
          title: singleTab.title,
        };
        tabsList.value = targetTabsList.map(tab => ({
          ...tab,
          component: markRaw(tab.component),
          id: uuidv4(),
        }));
      } else {
        // If there are multiple tabs in tabsList (for safety)
        componentOrder.value[dropIndex] = {
          id: targetItem.id,
          type: 'tabsList',
          tabsList: tabsList.value.map(tabItem => ({
            ...tabItem,
            component: markRaw(tabItem.component),
          })),
          cols: targetItem.cols,
        };
        tabsList.value = targetTabsList.map(tab => ({
          ...tab,
          component: markRaw(tab.component),
          id: uuidv4(),
        }));
        // Initialize new tab state
        initializeTabState(targetItem.id);
      }
    }

    // Update visibility and stored properties of all tabs in componentHeading
    componentHeading.value.forEach(heading => {
      if (tabsList.value.some(tab => tab.component === heading.component)) {
        heading.visibility = true;
        heading.icon = 'fa-solid fa-eye';
        heading.storedTab = null;
        heading.storedComponent = null;
      } else if (
        componentOrder.value[dropIndex].type === 'tabsList' &&
        componentOrder.value[dropIndex].tabsList.some(tab => tab.component === heading.component)
      ) {
        heading.visibility = true;
        heading.icon = 'fa-solid fa-eye';
        heading.storedTab = null;
        heading.storedComponent = null;
      } else if (
        componentOrder.value[dropIndex].type === 'component' &&
        componentOrder.value[dropIndex].component === heading.component
      ) {
        heading.visibility = true;
        heading.icon = 'fa-solid fa-eye';
        heading.storedTab = null;
        heading.storedComponent = null;
      }
    });

    // If tabsList is empty, reset tab
    if (tabsList.value.length === 0) {
      tab.value = null;
    } else if (tabsList.value.length > 0 && !tab.value) {
      tab.value = tabsList.value[0].value;
    }

    isDraggingAllTabs.value = false;
    return;
  }

  // Handle hidden component drop
  if (draggedHiddenComponent.value) {
    const targetItem = componentOrder.value[dropIndex];

    // if the target is placeholder 
    if (targetItem.type === 'placeholder') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(draggedHiddenComponent.value.component),
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
      // componentHeading update 
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === draggedHiddenComponent.value.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedTab = null;
        headingItem.storedComponent = null;
      }
    }
    // if targer is tabsList 
    else if (targetItem.type === 'tabsList') {
      const newTab = {
        id: uuidv4(),
        title: draggedHiddenComponent.value.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(draggedHiddenComponent.value.component),
      };
      componentOrder.value[dropIndex].tabsList.push(newTab);
      // componentHeading update 
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === draggedHiddenComponent.value.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedTab = null;
        headingItem.storedComponent = null;
      }
    }
    // if target is component 
    else if (targetItem.type === 'component') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(draggedHiddenComponent.value.component),
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
      // componentHeading update 
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === draggedHiddenComponent.value.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedTab = null;
        headingItem.storedComponent = null;
      }
      // previous component componentHeading update
      const oldHeadingItem = componentHeading.value.find(
        (heading) => heading.component === targetItem.component
      );
      if (oldHeadingItem) {
        oldHeadingItem.visibility = false;
        oldHeadingItem.icon = 'fa-solid fa-eye-slash';
        oldHeadingItem.storedComponent = {
          id: targetItem.id,
          type: 'component',
          component: markRaw(targetItem.component),
          cols: targetItem.cols,
          title: targetItem.title,
        };
      }
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
        value: `custom-${targetItem.id}-${uuidv4()}`,
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

  // When "Tabs" heading is dropped
  if (draggedHiddenComponent.value && draggedHiddenComponent.value.title === 'Tabs') {
    const targetItem = placeHolderLayout.value[placeholderIndex];
    if (targetItem.cols !== 12 && targetItem.cols !==8) return; // Allow drop only in cols="12"

    placeHolderLayout.value[placeholderIndex] = {
      id: targetItem.id,
      type: 'tabsList',
      tabsList: [],
      cols: 12,
    };

    const headingItem = componentHeading.value.find(h => h.title === 'Tabs');
    if (headingItem) {
      headingItem.visibility = true;
      headingItem.icon = 'fa-solid fa-eye';
    }

    initializeTabState(targetItem.id);
    draggedHiddenComponent.value = null;
    return;
  }

  // Add component to tabsList when dropped
  const targetItem = placeHolderLayout.value[placeholderIndex];
  if (targetItem.type === 'tabsList') {
    if (draggedHiddenComponent.value) {
      const newTab = {
        id: uuidv4(),
        title: draggedHiddenComponent.value.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(draggedHiddenComponent.value.component),
      };
      targetItem.tabsList.push(newTab);
      tabStates.value[targetItem.id] = newTab.value;

      const headingItem = componentHeading.value.find(h => h.component === draggedHiddenComponent.value.component);
      if (headingItem) {
        headingItem.visibility = true;
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.storedComponent = null;
        headingItem.storedPlaceholder = null;
        headingItem.storedTab = null;
      }

      // Remove "Tabs" heading
      const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
      if (tabsHeading && targetItem.tabsList.length > 0) {
        tabsHeading.visibility = false;
        tabsHeading.icon = 'fa-solid fa-eye-slash';
        tabsHeading.storedTabsList = {
          tabsList: targetItem.tabsList.map(tab => ({
            ...tab,
            component: markRaw(tab.component),
          })),
          id: targetItem.id,
        };
      }

      draggedHiddenComponent.value = null;
      return;
    }

    if (draggedItem.value) {
      const dragged = draggedItem.value;
      const fromIndex = draggedIndex.value;
      const newTab = {
        id: uuidv4(),
        title: dragged.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(dragged.component),
      };
      targetItem.tabsList.push(newTab);
      tabStates.value[targetItem.id] = newTab.value;
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });

      // Remove "Tabs" heading
      const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
      if (tabsHeading && targetItem.tabsList.length > 0) {
        tabsHeading.visibility = false;
        tabsHeading.icon = 'fa-solid fa-eye-slash';
        tabsHeading.storedTabsList = {
          tabsList: targetItem.tabsList.map(tab => ({
            ...tab,
            component: markRaw(tab.component),
          })),
          id: targetItem.id,
        };
      }

      draggedItem.value = null;
      draggedIndex.value = null;
      return;
    }

    if (draggedTab.value) {
      const tabItem = draggedTab.value;
      const tabIndex = draggedTabIndex.value;
      const newTab = {
        id: uuidv4(),
        title: tabItem.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(tabItem.component),
      };
      targetItem.tabsList.push(newTab);
      tabStates.value[targetItem.id] = newTab.value;
      tabsList.value.splice(tabIndex, 1);

      if (tab.value === tabItem.value && tabsList.value.length > 0) {
        tab.value = tabsList.value[0].value;
      } else if (tabsList.value.length === 0) {
        tab.value = null;
      }

      // Remove "Tabs" heading
      const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
      if (tabsHeading && targetItem.tabsList.length > 0) {
        tabsHeading.visibility = false;
        tabsHeading.icon = 'fa-solid fa-eye-slash';
        tabsHeading.storedTabsList = {
          tabsList: targetItem.tabsList.map(tab => ({
            ...tab,
            component: markRaw(tab.component),
          })),
          id: targetItem.id,
        };
      }

      draggedTab.value = null;
      draggedTabIndex.value = null;
      return;
    }

    if (draggedPlaceholder.value && draggedPlaceholder.value.type === 'component') {
      const dragged = draggedPlaceholder.value;
      const fromIndex = draggedPlaceholderIndex.value;
      const newTab = {
        id: uuidv4(),
        title: dragged.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(dragged.component),
      };
      targetItem.tabsList.push(newTab);
      tabStates.value[targetItem.id] = newTab.value;
      placeHolderLayout.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });

      // Remove "Tabs" heading
      const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
      if (tabsHeading && targetItem.tabsList.length > 0) {
        tabsHeading.visibility = false;
        tabsHeading.icon = 'fa-solid fa-eye-slash';
        tabsHeading.storedTabsList = {
          tabsList: targetItem.tabsList.map(tab => ({
            ...tab,
            component: markRaw(tab.component),
          })),
          id: targetItem.id,
        };
      }

      draggedPlaceholder.value = null;
      draggedPlaceholderIndex.value = null;
      return;
    }
  }

  // Existing drop logic (for heading components, componentOrder, placeHolderLayout, and tabsList)
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
      const headingItem = componentHeading.value.find((heading) => heading.component === draggedHiddenComponent.value.component);
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
      }
      draggedHiddenComponent.value = null;
      return;
    }
  }

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
    return;
  }

  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    placeHolderLayout.value.splice(fromIndex, 1);
    placeHolderLayout.value.splice(placeholderIndex, 0, dragged);
    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
    return;
  }

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
    return;
  }
};

// Drop handler for reordering tabs
const onDropTab = (event, dropIndex, tabsListId) => {
  event.preventDefault();
  const targetTabsList = tabsListId
    ? placeHolderLayout.value.find(item => item.id === tabsListId)?.tabsList || tabsList.value
    : tabsList.value;

  if (draggedTab.value) {
    const fromIndex = draggedTabIndex.value;
    if (fromIndex === dropIndex) return;
    const dragged = targetTabsList.splice(fromIndex, 1)[0];
    targetTabsList.splice(dropIndex, 0, dragged);
    draggedTab.value = null;
    draggedTabIndex.value = null;
  }

  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    const newTab = {
      id: uuidv4(),
      title: dragged.title,
      value: `custom-${dragged.id}-${uuidv4()}`,
      component: markRaw(dragged.component),
    };
    targetTabsList.splice(dropIndex, 0, newTab);
    componentOrder.value.splice(fromIndex, 1, {
      id: dragged.id,
      type: 'placeholder',
      cols: dragged.cols,
    });

    const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
    if (tabsHeading && targetTabsList.length > 0 && tabsListId) {
      tabsHeading.visibility = false;
      tabsHeading.icon = 'fa-solid fa-eye-slash';
      tabsHeading.storedTabsList = {
        tabsList: targetTabsList.map(tab => ({
          ...tab,
          component: markRaw(tab.component),
        })),
        id: tabsListId,
      };
    }

    draggedItem.value = null;
    draggedIndex.value = null;
  }

  if (draggedHiddenComponent.value) {
    const newTab = {
      id: uuidv4(),
      title: draggedHiddenComponent.value.title,
      value: `custom-${tabsListId || 'tabs'}-${uuidv4()}`,
      component: markRaw(draggedHiddenComponent.value.component),
    };
    targetTabsList.splice(dropIndex, 0, newTab);
    const headingItem = componentHeading.value.find(h => h.component === draggedHiddenComponent.value.component);
    if (headingItem) {
      headingItem.visibility = true;
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.storedComponent = null;
      headingItem.storedPlaceholder = null;
      headingItem.storedTab = null;
    }

    const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
    if (tabsHeading && targetTabsList.length > 0 && tabsListId) {
      tabsHeading.visibility = false;
      tabsHeading.icon = 'fa-solid fa-eye-slash';
      tabsHeading.storedTabsList = {
        tabsList: targetTabsList.map(tab => ({
          ...tab,
          component: markRaw(tab.component),
        })),
        id: tabsListId,
      };
    }

    draggedHiddenComponent.value = null;
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
  console.log("the width is :", width)
  let layout = type === 'component' ? componentOrder.value : placeHolderLayout.value;
  console.log("the layout is :", layout)
  const item = layout.find((item) => item.id === id);
  if (!item) return;

  // Set the new width
  item.cols = width;

  // Calculate total cols in the current row
  let totalCols = layout.reduce((sum, curr) => sum + curr.cols, 0);

  // if cols > 12 add placeholder for remaining space
  if (totalCols > 12) {
    // Find the point where cols exceed 12
    let currentSum = 0;
    let breakIndex = layout.length;
    console.log("the break index is :", breakIndex)
    for (let i = 0; i < layout.length; i++) {
      currentSum += layout[i].cols;
      if (currentSum > 12) {
        breakIndex = i;
        break;
      }
    }

    // if line vreak calculate remaining col in the next row
    if (breakIndex < layout.length) {
      const nextRowCols = layout.slice(breakIndex).reduce((sum, curr) => sum + curr.cols, 0);
      console.log("the next row cols is :", nextRowCols)
      const remainingCols = 12 - (nextRowCols % 12 || nextRowCols);

      // add placeholder in remaining col in the next row
      if (remainingCols > 0) {
        layout.push({
          id: uuidv4(),
          type: 'placeholder',
          cols: remainingCols,
        });
      }
    }
  }
};

// Toggle width options
const toggleWidthOptions = (id, type = 'component') => {
  showColumnWidthToggle.value[id] = !showColumnWidthToggle.value[id];
};

// Reset column width
const closeToggleBtns = (id) => {
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
  const allowedCols = [4, 6, 8, 12];
  const count = placeHolderLayout.value.length;

  if (count === 0) return;

  // Find valid width based on count
  let width;
  if (count === 1) width = 12;
  else if (count === 2) width = 6;
  else if (count === 3) width = 4;
  else {
    // Adjust count to fit allowed widths (max 3 columns)
    width = 4;
    while (placeHolderLayout.value.length > 3) placeHolderLayout.value.pop();
    while (placeHolderLayout.value.length < 3) {
      placeHolderLayout.value.push({ id: uuidv4(), type: 'placeholder', cols: 4 });
    }
  }

  // Apply width to all columns
  placeHolderLayout.value.forEach(item => (item.cols = width));
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

// delete the entire tablist section
const deleteTabsSection = () => {
  tabsList.value.forEach((tabItem, index) => {
    const headingItem = componentHeading.value.find(
      (heading) => heading.component === tabItem.component
    );
    if (headingItem) {
      headingItem.visibility = false;
      headingItem.icon = 'fa-solid fa-eye-slash';
      headingItem.storedTab = {
        title: tabItem.title,
        value: tabItem.value,
        component: tabItem.component,
        index,
      };
    }
  });
  tabsList.value = [];
  tab.value = null; // Reset active tab
  // Optionally remove from sectionOrder
  const tabsSectionIndex = sectionOrder.value.findIndex(
    (section) => section.type === 'tabsList'
  );
  if (tabsSectionIndex !== -1) {
    sectionOrder.value.splice(tabsSectionIndex, 1);
  }
};

const sectionOrder = ref([
  { id: 1, type: 'componentOrder' },
  { id: 2, type: 'tabsList' },
]);

const draggedSection = ref(null);
const draggedSectionIndex = ref(null);

// for drag the entire the component & tablist row 
const onSectionDragStart = (event, section, index) => {
  console.log("the section start is :", section, index)
  draggedSection.value = section;
  draggedSectionIndex.value = index;
  event.dataTransfer.setData('sectionType', section.type);
};

const onSectionDrop = (event, dropIndex) => {
  // console.log("the event and drop index is : " , event ,  dropIndex)
  event.preventDefault();
  if (!draggedSection.value || draggedSectionIndex.value === dropIndex) {
    draggedSection.value = null;
    draggedSectionIndex.value = null;
    return;
  }

  const fromIndex = draggedSectionIndex.value;
  const dragged = sectionOrder.value.splice(fromIndex, 1)[0];
  sectionOrder.value.splice(dropIndex, 0, dragged);
  draggedSection.value = null;
  draggedSectionIndex.value = null;
};

// Handle the entire tabsList when drag starts
const onAllTabsDragStart = (event) => {
  isDraggingAllTabs.value = true;
  event.dataTransfer.setData('allTabsDrag', 'tabsList');
};

// New reference to manage tab state for each tabsList
const tabStates = ref({});

// Function to set default tab for tabsList in componentOrder
const initializeTabState = (tabsListId) => {
  if (!tabStates.value[tabsListId]) {
    const tabsList = placeHolderLayout.value.find(item => item.id === tabsListId)?.tabsList || [];
    tabStates.value[tabsListId] = tabsList.length > 0 ? tabsList[0].value : null;
  }
};

// functions for dublicate the column of the component order and the placeholder column
const duplicateColumn = (componentItem, index) => {
  const totalCols = 12;

  const currentCols = componentItem.cols;
  const newPlaceholder = {
    id: uuidv4(),
    type: 'placeholder',
    cols: currentCols,
  };

  // Insert new placeholder after the current column
  componentOrder.value.splice(index + 1, 0, newPlaceholder);

  // Check total column width in componentOrder
  let currentRowCols = componentOrder.value.reduce((sum, item) => sum + item.cols, 0);

  // If total width exceeds 12, move the last item to placeHolderLayout
  if (currentRowCols > totalCols) {
    let lastItem = componentOrder.value.pop();
    console.log("the last item is : ", lastItem)
    placeHolderLayout.value.unshift(lastItem);

    // Ensure componentOrder is exactly 12 cols (no additional placeholder needed)
    currentRowCols = componentOrder.value.reduce((sum, item) => sum + item.cols, 0); //12 output
    if (currentRowCols < totalCols) {
      // This case shouldn’t occur since we’re popping to reach 12, but included for robustness
      componentOrder.value.push({
        id: uuidv4(),
        type: 'placeholder',

      });
    }
  }


  // Add a placeholder to placeHolderLayout to match desired output
  placeHolderLayout.value.push({
    id: uuidv4(),
    type: 'placeholder',

  });

  console.log("the placeholder layout is:", placeHolderLayout)

};

// function for dublicate placeholder cols 
const duplicatePlaceholderColumn = (componentItem, index) => {
  const totalCols = 12;

  const currentCols = componentItem.cols;
  console.log("the current cols is : ", currentCols)

  // Create a new placeholder with the same width
  const newPlaceholder = {
    id: uuidv4(),
    type: 'placeholder',
    cols: currentCols,
  };

  // Insert new placeholder after the current column
  placeHolderLayout.value.splice(index + 1, 0, newPlaceholder);

  // Calculate total column width in placeHolderLayout
  let currentRowCols = placeHolderLayout.value.reduce((sum, item) => sum + item.cols, 0);

  // Handle overflow if total width exceeds 12
  if (currentRowCols > totalCols) {
    // Pop the last item to keep the current row at 12 cols
    const lastItem = placeHolderLayout.value.pop();

    // Start a new row in placeHolderLayout with the popped item
    placeHolderLayout.value.push({
      id: uuidv4(),
      type: lastItem.type,
      cols: lastItem.cols,
      component: lastItem.component ? markRaw(lastItem.component) : null,
      title: lastItem.title,
    });

    // Recalculate current row cols
    currentRowCols = placeHolderLayout.value.reduce((sum, item) => sum + item.cols, 0);

    // If the current row is still less than 12, add a placeholder
    if (currentRowCols < totalCols) {


      placeHolderLayout.value.push({
        id: uuidv4(),
        type: 'placeholder',

      });
    }
  } else if (currentRowCols < totalCols) {
    // If there's empty space, adjust or add a placeholder

    const existingPlaceholderIndex = placeHolderLayout.value.findIndex(
      (item) => item.type === 'placeholder'
    );

    if (existingPlaceholderIndex !== -1) {
      // Adjust existing placeholder's width

    } else {
      // Add a new placeholder for the remaining space

      placeHolderLayout.value.push({
        id: uuidv4(),
        type: 'placeholder',
      });
    }
  }


};

</script>


<style scoped>
.drag-all-column {
  left: -9px;
  top: -12px;
  z-index: 2;
  cursor: grab;
  font-size: 15px;
  color: red;
  position: absolute;
}

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

.dublicate-component-column {
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 65px;
  color: #555;
}

.drag-component {
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 40px;
  color: #555;
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
  border: red;
}

/* Component Order Row Icons */
.component-order-row {
  position: relative;
  margin-bottom: 20px;
}

.component-order-row:hover {
  border: 1px dashed rgba(136, 198, 213, 1);
}

.trash-row,
.grip-row,
.dublicate-row,
.placeholder-row {
  position: absolute;
  top: -20px;
  /* Position icons at the top of the row */
  z-index: 1;
  cursor: pointer;
  font-size: 15px;
  color: #555;
}

.trash-row {
  left: calc(50% - 60px);
  color: #c03131ed;
}

.grip-row {
  left: calc(50% - 30px);
}

.dublicate-row {
  left: calc(50%);
}

.placeholder-row {
  left: calc(50% + 30px);
}

/* Tabs List Row Icons */
.section-wrapper:has(.v-tabs) {
  position: relative;
  margin-bottom: 20px;
}

.trash-tablist-row,
.grip-tablist-row,
.dublicate-tablist-row,
.placeholder-tablist-row {
  position: absolute;
  top: -20px;
  z-index: 1;
  cursor: pointer;
  font-size: 15px;
  color: #555;
}

.trash-tablist-row {
  left: calc(50% - 60px);
  color: #c03131ed;
}

.grip-tablist-row {
  left: calc(50% - 30px);
}

.dublicate-tablist-row {
  left: calc(50%);
}

.placeholder-tablist-row {
  left: calc(50% + 30px);
}
</style>
