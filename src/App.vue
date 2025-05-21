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
                  <p class="m-0"><i class="me-3 fa-solid fa-grip-vertical"></i>{{ item.title }}</p>
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

              <!-- components of component order -->
              <div v-if="componentItem.type === 'component'" class="component-container">
                <div v-for="(comp, compIndex) in componentItem.component" :key="compIndex" class="component-wrapper">
                  <!-- Delete component tooltip -->
                  <v-tooltip text="Delete component" location="top">
                    <template v-slot:activator="{ props }">
                      <div class="trash-column"
                        v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'" v-bind="props"
                        @click="deleteColumn(componentItem.id, index, compIndex)">
                        <i class="fa-solid fa-trash"></i>
                      </div>
                    </template>
                  </v-tooltip>

                  <!-- Drag component tooltip -->
                  <v-tooltip text="Drag Component" location="top">
                    <template v-slot:activator="{ props }">
                      <div class="drag-component"
                        v-if="hoverGrip === componentItem.id && componentItem.type !== 'placeholder'" v-bind="props"
                        :draggable="true"
                        @dragstart="onComponentDragStart($event, comp, compIndex, componentItem, index)">
                        <i class="fa-solid fa-layer-group"></i>
                      </div>
                    </template>
                  </v-tooltip>
                  <component :is="comp.component" />
                </div>
              </div>


              <div v-else-if="componentItem.type === 'placeholder'" class="placeholder-cols">
                Drag the item
              </div>

              <!-- show the componet order in the form of tablist -->
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

              <!-- btns toggle of width  -->
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

        <!-- Placeholder Section -->
<div v-if="section.type === 'placeholder'" class="placeholder-section">
  <v-row
    v-for="(row, rowIndex) in placeHolderRows"
    :key="rowIndex"
    class="component-order-row"
    @mouseenter="onMouseEnterPlaceholderRow(rowIndex)"
    @mouseleave="onMouseLeavePlaceholderRow(rowIndex)"
    draggable="true"
    @dragstart="onPlaceholderRowDragStart($event, row, rowIndex, section, index)"
    @dragover="onDragOver($event)"
    @drop="onPlaceholderRowDrop($event, rowIndex, section, index)"
  >
    <v-tooltip text="Add Placeholder" location="top">
      <template v-slot:activator="{ props }">
        <div class="placeholder-row" v-if="hoverPlaceholderRows[rowIndex]" v-bind="props" @click="drawer = true">
          <i class="fa-solid fa-plus"></i>
        </div>
      </template>
    </v-tooltip>
    <v-tooltip text="Drag entire row" location="top">
      <template v-slot:activator="{ props }">
        <div class="grip-row" v-if="hoverPlaceholderRows[rowIndex]" v-bind="props" draggable="true"
          @dragstart="onPlaceholderRowDragStart($event, row, rowIndex, section, index)">
          <i class="fa-solid fa-grip-vertical"></i>
        </div>
      </template>
    </v-tooltip>
    <v-tooltip text="Duplicate Row" location="top">
      <template v-slot:activator="{ props }">
        <div class="dublicate-row" v-if="hoverPlaceholderRows[rowIndex]" v-bind="props" @click="addPlaceHolderRow([4, 4, 4])">
          <i class="fa-solid fa-clone"></i>
        </div>
      </template>
    </v-tooltip>
    <v-tooltip text="Delete entire row" location="top">
      <template v-slot:activator="{ props }">
        <div class="trash-row" v-if="hoverPlaceholderRows[rowIndex]" v-bind="props" @click="deletePlaceholderRow(rowIndex)">
          <i class="fa-solid fa-trash"></i>
        </div>
      </template>
    </v-tooltip>
    <v-col
      v-for="(item, colIndex) in row"
      :key="item.id"
      :cols="item.cols"
      @dragover="onDragOver($event)"
      @drop="onDropToPlaceholder($event, item.id, colIndex)"
      @mouseenter="onMouseEnterPlaceholder(item.id)"
      @mouseleave="onMouseLeavePlaceholder"
      class="position-relative"
    >
      <!-- Existing v-col content remains unchanged -->
      <v-tooltip text="Delete column" location="right">
        <template v-slot:activator="{ props }">
          <div class="trash-column" v-if="hoverPlaceholder === item.id" v-bind="props"
            @click="deletePlaceholderColumn(item.id, colIndex)">
            <i class="fa-solid fa-trash"></i>
          </div>
        </template>
      </v-tooltip>
      <v-tooltip text="Duplicate column" location="right">
        <template v-slot:activator="{ props }">
          <div class="dublicate-component-column"
            v-if="hoverGripPlaceHolder === item.id && item.type !== 'placeholder'" v-bind="props">
            <i class="fa-solid fa-clone" @click="duplicatePlaceholderColumn(item, colIndex)"></i>
          </div>
        </template>
      </v-tooltip>
      <v-tooltip text="Drag column" location="right">
        <template v-slot:activator="{ props }">
          <div v-if="hoverGripPlaceHolder === item.id" class="hover-grip-placeholder" v-bind="props" :draggable="true"
            @dragstart="onPlaceholderDragStart($event, item, colIndex)">
            <i class="fa-solid fa-grip-vertical"></i>
          </div>
        </template>
      </v-tooltip>
      <div v-if="item.type === 'component'" class="component-container">
        <component :is="item.component" />
      </div>
      <div v-else-if="item.type === 'tabsList'" class="component-container">
        <v-tabs v-model="tabStates[item.id]" background-color="primary" dark class="mb-3">
          <v-tab v-if="item.tabsList.length === 0" value="default-tabs" class="default-tab">
            <span class="me-2"><i class="fa-solid fa-grip-vertical"></i></span> Tabs
          </v-tab>
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
      <v-btn v-if="hoverGripPlaceHolder === item.id" color="warning" variant="tonal" class="width-btn" small
        @click="toggleWidthOptions(item.id, 'placeholder')">
        Column width
      </v-btn>
      <v-btn-toggle v-if="showColumnWidthToggle[item.id]" class="toggle-btns border-thin" v-model="toggle_exclusive" small>
        <v-btn @click="setColumnWidth(item.id, 4, 'placeholder')">33%</v-btn>
        <v-btn @click="setColumnWidth(item.id, 6, 'placeholder')">50%</v-btn>
        <v-btn @click="setColumnWidth(item.id, 8, 'placeholder')">66%</v-btn>
        <v-btn @click="setColumnWidth(item.id, 12, 'placeholder')">100%</v-btn>
        <v-btn @click="closeToggleBtns(item.id)">X</v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</div>

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

          <!-- Conditionally render tabsList as tabs or single component -->
          <div v-if="tabsList.length > 1">
            <v-tabs v-model="tab" background-color="primary" dark class="mb-3" @dragover="onDragOver($event)"
              @drop="onDropToTabs($event)">
              <v-tab v-for="(tabItem, index) in tabsList" :key="index" :value="tabItem.value"
                :class="{ 'active-tab': tab === tabItem.value }" draggable="true" class="tablist-tab"
                @dragstart="onTabDragStart($event, tabItem, index)" @drop="onDropTab($event, index)"
                @mouseenter="hoverTabDeleteIcon = tabItem.id" @mouseleave="hoverTabDeleteIcon = null">
                <span class="me-2"><i class="fa-regular fa-user"></i></span> {{ tabItem.title }}
                <span class="trash-tab-delete-icon" v-if="hoverTabDeleteIcon === tabItem.id" @click="deleteTab(index)">
                  <i class="fa-solid fa-trash"></i>
                </span>
              </v-tab>
            </v-tabs>
            <v-window v-model="tab" :touch="false">
              <v-window-item v-for="(tabItem, index) in tabsList" :key="index" :value="tabItem.value">
                <component :is="tabItem.component" />
              </v-window-item>
            </v-window>
          </div>

          <div v-else-if="tabsList.length === 1">
            <v-row>
              <v-col cols="12">
                <component :is="tabsList[0].component" />
              </v-col>
            </v-row>
          </div>
        </div>

      </div>

      <!-- show the dialog box when click on delete entire row of component order  -->
      <v-dialog v-model="showDeleteConfirm" max-width="450">
        <v-card class="delete-dialog">
          <v-card-title class="d-flex align-items-center justify-content-center exclamation-container">
            <div class="exclamation"><i class="fa-solid fa-exclamation"></i></div>
          </v-card-title>
          <v-card-text class="dialog-text">
            Are you sure you want to delete this {{
              deleteContext === 'tabsSection' ? 'tabs section' : deleteContext === 'placeholderRow' ? 'placeholder section' : 'section'
            }}? It contains components that will be removed.
          </v-card-text>
          <v-card-actions class="d-flex align-items-center justify-content-center">
            <v-btn @click="showDeleteConfirm = false">No</v-btn>
            <v-btn color="error" @click="confirmDelete">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-main>
  </v-app>
</template>



<script setup>
import { ref, computed, markRaw } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const drawer = ref(false);
const tabs = ref('one');
const showDeleteConfirm = ref(false); //variable for show the diaglog 
const deleteContext = ref(null); // this will track the which row should be deleted component order row or tablist row 
const deleteRowIndex = ref(null); // New ref to store the row index for deletion

// Add new reactive variables for placeholder row dragging
const draggedPlaceholderRow = ref(null);
const draggedPlaceholderRowIndex = ref(null);
const draggedPlaceholderSection = ref(null);
const draggedPlaceholderSectionIndex = ref(null);

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
  { id: 1, type: 'component', component: [{ component: markRaw(PersonalDetails) }], title: 'Personal Details', cols: 4, },
  { id: 2, type: 'component', component: [{ component: markRaw(PurchasingDetails) }], title: 'Purchasing Details', cols: 4, },
  { id: 3, type: 'component', component: [{ component: markRaw(CustomerNote) }], title: 'Customer Note', cols: 4, },
]);

const hoverGrip = ref(null);
const hoverPlaceholder = ref(null);
const hoverGripPlaceHolder = ref(null);
const showColumnWidthToggle = ref({});
const hoverTabDeleteIcon = ref(null);
const hoverRow = ref(false);
const hoverTablistRow = ref(false)
// In <script setup>
const hoverPlaceholderRows = ref({}); // Object to track hover state for each row

// Update hover event handlers
const onMouseEnterPlaceholderRow = (rowIndex) => {
  hoverPlaceholderRows.value[rowIndex] = true;
};

const onMouseLeavePlaceholderRow = (rowIndex) => {
  hoverPlaceholderRows.value[rowIndex] = false;
};

const draggedItem = ref(null);
const draggedIndex = ref(null);
const draggedTab = ref(null);
const draggedTabIndex = ref(null);
const draggedPlaceholder = ref(null);
const draggedPlaceholderIndex = ref(null);
const draggedHiddenComponent = ref(null);

// variable for set the section order and drag and drop section order 
const sectionOrder = ref([
  { id: 1, type: 'componentOrder' },
  { id: 2, type: 'placeholder' },
  { id: 3, type: 'tabsList' },
]);
const draggedSection = ref(null);
const draggedSectionIndex = ref(null);

// variable for components drag into column
const draggedComponent = ref(null);
const draggedComponentIndex = ref(null);
const draggedComponentParent = ref(null);

// New reference to manage tab state for each tabsList
const tabStates = ref({});
const isDraggingAllTabs = ref(false); // variable for drag the entire tab section into the column

// Tabs list with component field for dynamic content
const tab = ref('orders');

const tabsList = ref([
  { title: 'Orders', value: 'orders', component: markRaw(OrderTab), id: 1, },
  { title: 'Timeline', value: 'timeline', component: markRaw(TimelineTab), id: 2, },
  { title: 'Billing', value: 'billing', component: markRaw(BillingTab), id: 3, },
  { title: 'Notifications', value: 'notifications', component: markRaw(Notification), id: 4, },
  { title: 'Email', value: 'email', component: markRaw(EmailTab), id: 5, },
]);


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
  const headingItem = componentHeading.value.find(
    (heading) => heading.component === item.component || heading.title === item.title
  );
  if (!headingItem) return;

  if (headingItem.visibility) {
    // Clear previous stored positions
    headingItem.storedComponent = null;
    headingItem.storedPlaceholder = null;
    headingItem.storedTab = null;

    // Check in componentOrder
    const componentIndex = componentOrder.value.findIndex(
      (col) => col.type === 'component' && col.component.some(c => c.component === item.component)
    );
    if (componentIndex !== -1) {
      const col = componentOrder.value[componentIndex];
      const compIndex = col.component.findIndex(c => c.component === item.component);
      if (compIndex !== -1) {
        // Store the component's position for restoration
        headingItem.storedComponent = {
          component: [col.component[compIndex]],
          title: col.component[compIndex].title,
          index: componentIndex,
          cols: col.cols,
        };
        // Remove the specific component
        col.component.splice(compIndex, 1);
        // If no components remain, convert to placeholder
        if (col.component.length === 0) {
          componentOrder.value[componentIndex] = {
            id: col.id,
            type: 'placeholder',
            cols: col.cols,
          };
        }
        headingItem.icon = 'fa-solid fa-eye-slash';
        headingItem.visibility = false;
        return;
      }
    }

    // Check in placeHolderLayout (for components)
    const placeholderIndex = placeHolderLayout.value.findIndex(
      (col) => col.type === 'component' && col.component === item.component
    );
    if (placeholderIndex !== -1) {
      headingItem.storedPlaceholder = {
        component: placeHolderLayout.value[placeholderIndex].component,
        title: placeHolderLayout.value[placeholderIndex].title,
        colIndex: placeholderIndex,
        cols: placeHolderLayout.value[placeholderIndex].cols,
      };
      placeHolderLayout.value[placeholderIndex] = {
        id: placeHolderLayout.value[placeholderIndex].id,
        type: 'placeholder',
        cols: placeHolderLayout.value[placeholderIndex].cols,
      };
      headingItem.icon = 'fa-solid fa-eye-slash';
      headingItem.visibility = false;
      return;
    }

    // Check in tabsList (main tabs section)
    const tabIndex = tabsList.value.findIndex((tabItem) => tabItem.component === item.component);
    if (tabIndex !== -1) {
      headingItem.storedTab = {
        title: tabsList.value[tabIndex].title,
        value: tabsList.value[tabIndex].value,
        component: tabsList.value[tabIndex].component,
        index: tabIndex,
        tabsListId: null,
      };
      tabsList.value.splice(tabIndex, 1);
      if (tab.value === headingItem.storedTab.value) {
        tab.value = tabsList.value.length > 0 ? tabsList.value[0].value : null;
      }
      headingItem.icon = 'fa-solid fa-eye-slash';
      headingItem.visibility = false;
      return;
    }

    // Check in placeHolderLayout's tabsList
    const targetLayoutItem = placeHolderLayout.value.find((layoutItem) =>
      layoutItem.type === 'tabsList' && layoutItem.tabsList.some(tab => tab.component === item.component)
    );
    if (targetLayoutItem) {
      const tabsListIndex = targetLayoutItem.tabsList.findIndex(tab => tab.component === item.component);
      headingItem.storedTab = {
        title: targetLayoutItem.tabsList[tabsListIndex].title,
        value: targetLayoutItem.tabsList[tabsListIndex].value,
        component: targetLayoutItem.tabsList[tabsListIndex].component,
        index: tabsListIndex,
        tabsListId: targetLayoutItem.id,
      };
      targetLayoutItem.tabsList.splice(tabsListIndex, 1);
      if (tabStates.value[targetLayoutItem.id] === headingItem.storedTab.value) {
        tabStates.value[targetLayoutItem.id] = targetLayoutItem.tabsList.length > 0
          ? targetLayoutItem.tabsList[0].value
          : null;
      }
      if (targetLayoutItem.tabsList.length === 0) {
        targetLayoutItem.type = 'placeholder';
        targetLayoutItem.tabsList = [];
        delete tabStates.value[targetLayoutItem.id];
        const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
        if (tabsHeading) {
          tabsHeading.visibility = false;
          tabsHeading.icon = 'fa-solid fa-eye-slash';
          tabsHeading.storedTabsList = null;
        }
      }
      headingItem.icon = 'fa-solid fa-eye-slash';
      headingItem.visibility = false;
      return;
    }
  } else {
    // Restore component
    let restored = false;

    // Restore to storedComponent (componentOrder)
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
      } else if (componentOrder.value[targetIndex]?.type === 'component') {
        componentOrder.value[targetIndex].component.push(...headingItem.storedComponent.component);
        restored = true;
      } else {
        const placeholderIndex = componentOrder.value.findIndex(item => item.type === 'placeholder');
        if (placeholderIndex !== -1) {
          componentOrder.value[placeholderIndex] = {
            id: componentOrder.value[placeholderIndex].id,
            type: 'component',
            component: headingItem.storedComponent.component,
            cols: headingItem.storedComponent.cols,
            title: headingItem.storedComponent.title,
          };
          restored = true;
        }
      }
    }

    // Restore to storedPlaceholder (placeHolderLayout)
    if (!restored && headingItem.storedPlaceholder) {
      const targetIndex = headingItem.storedPlaceholder.colIndex;
      if (placeHolderLayout.value[targetIndex]?.type === 'placeholder') {
        placeHolderLayout.value[targetIndex] = {
          id: placeHolderLayout.value[targetIndex].id,
          type: 'component',
          component: markRaw(headingItem.storedPlaceholder.component),
          cols: headingItem.storedPlaceholder.cols,
          title: headingItem.storedPlaceholder.title,
        };
        restored = true;
      } else {
        const placeholderIndex = placeHolderLayout.value.findIndex(item => item.type === 'placeholder');
        if (placeholderIndex !== -1) {
          placeHolderLayout.value[placeholderIndex] = {
            id: placeHolderLayout.value[placeholderIndex].id,
            type: 'component',
            component: markRaw(headingItem.storedPlaceholder.component),
            cols: headingItem.storedPlaceholder.cols,
            title: headingItem.storedPlaceholder.title,
          };
          restored = true;
        }
      }
    }

    // Restore to storedTab (main tabsList or nested tabsList)
    if (!restored && headingItem.storedTab) {
      const { tabsListId, index, title, value, component } = headingItem.storedTab;
      if (tabsListId) {
        const targetLayoutItem = placeHolderLayout.value.find(item => item.id === tabsListId);
        if (targetLayoutItem) {
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
          restored = true;
        }
      } else {
        tabsList.value.splice(index, 0, {
          id: uuidv4(),
          title,
          value,
          component: markRaw(component),
        });
        if (!tab.value) {
          tab.value = value;
        }
        restored = true;
      }
    }

    // Fallback: Add to first available placeholder or end of placeHolderLayout
    if (!restored) {
      const placeholderIndex = placeHolderLayout.value.findIndex(item => item.type === 'placeholder');
      if (placeholderIndex !== -1) {
        placeHolderLayout.value[placeholderIndex] = {
          id: placeHolderLayout.value[placeholderIndex].id,
          type: 'component',
          component: markRaw(item.component),
          cols: placeHolderLayout.value[placeholderIndex].cols,
          title: item.title,
        };
      } else {
        placeHolderLayout.value.push({
          id: uuidv4(),
          type: 'component',
          component: markRaw(item.component),
          cols: 4,
          title: item.title,
        });
      }
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
const deleteColumn = (id, index, compIndex) => {
  const column = componentOrder.value[index];
  if (!column || column.id !== id || column.type !== 'component') return;

  // Ensure the component index is valid
  if (compIndex < 0 || compIndex >= column.component.length) return;

  // Get the specific component to delete
  const deletedComponent = column.component[compIndex];

  // Update visibility in componentHeading
  const headingItem = componentHeading.value.find(
    (heading) => heading.component === deletedComponent.component
  );
  if (headingItem) {
    headingItem.visibility = false;
    headingItem.icon = 'fa-solid fa-eye-slash';
    headingItem.storedComponent = {
      component: [deletedComponent],
      title: deletedComponent.title,
      index: index,
      cols: column.cols,
    };
  }

  // Remove the specific component
  column.component.splice(compIndex, 1);

  // If no components remain, convert the column to a placeholder
  if (column.component.length === 0) {
    componentOrder.value[index] = {
      id: column.id,
      type: 'placeholder',
      cols: column.cols,
    };
  }
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

  // Handle component drag and drop into column
  if (draggedComponent.value && draggedComponentParent.value) {
    const targetItem = componentOrder.value[dropIndex];
    const sourceItem = draggedComponentParent.value.item;
    const sourceIndex = draggedComponentParent.value.index;
    const compIndex = draggedComponentIndex.value;

    // If target is a placeholder
    if (targetItem.type === 'placeholder') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: [{ component: markRaw(draggedComponent.value.component), title: draggedComponent.value.title }],
        cols: targetItem.cols,
      };
    }
    // If target is a component
    else if (targetItem.type === 'component') {
      targetItem.component.push({
        component: markRaw(draggedComponent.value.component),
        title: draggedComponent.value.title,
      });
    }
    // If target is a tabsList
    else if (targetItem.type === 'tabsList') {
      const newTab = {
        id: uuidv4(),
        title: draggedComponent.value.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(draggedComponent.value.component),
      };
      targetItem.tabsList.push(newTab);
      initializeTabState(targetItem.id);
    }

    // Remove the dragged component from the source column
    sourceItem.component.splice(compIndex, 1);

    // If source column has no components left, convert it to placeholder
    if (sourceItem.component.length === 0) {
      componentOrder.value[sourceIndex] = {
        id: sourceItem.id,
        type: 'placeholder',
        cols: sourceItem.cols,
      };
    }

    // Update componentHeading visibility
    const headingItem = componentHeading.value.find(
      (heading) => heading.component === draggedComponent.value.component
    );
    if (headingItem) {
      headingItem.visibility = true;
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.storedComponent = null;
    }

    draggedComponent.value = null;
    draggedComponentIndex.value = null;
    draggedComponentParent.valuels = null;
    return;
  }

  // Handle Drag and Drop of Entire tabs list
  if (isDraggingAllTabs.value) {
    const targetItem = componentOrder.value[dropIndex];

    // If the target is a placeholder
    if (targetItem.type === 'placeholder') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: tabsList.value.length > 1 ? 'tabsList' : 'component',
        tabsList: tabsList.value.length > 1 ? tabsList.value.map(tabItem => ({
          ...tabItem,
          component: markRaw(tabItem.component),
        })) : undefined,
        component: tabsList.value.length === 1 ? [{
          component: markRaw(tabsList.value[0].component),
          title: tabsList.value[0].title,
        }] : undefined,
        cols: targetItem.cols,
      };
      tabsList.value = [];
      if (tabsList.value.length > 1) {
        initializeTabState(targetItem.id);
      }
    }
    // If the target is a component
    else if (targetItem.type === 'component') {
      const newTab = {
        id: uuidv4(),
        title: targetItem.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(targetItem.component[0].component),
      };
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: tabsList.value.length > 1 ? 'tabsList' : 'component',
        tabsList: tabsList.value.length > 1 ? tabsList.value.map(tabItem => ({
          ...tabItem,
          component: markRaw(tabItem.component),
        })) : undefined,
        component: tabsList.value.length === 1 ? [{
          component: markRaw(tabsList.value[0].component),
          title: tabsList.value[0].title,
        }] : undefined,
        cols: targetItem.cols,
      };
      tabsList.value = [newTab];
      if (tabsList.value.length > 1) {
        initializeTabState(targetItem.id);
      }
      tab.value = tabsList.value[0].value;

      const headingItem = componentHeading.value.find(
        (heading) => heading.component === newTab.component
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
      if (tabsList.value.length === 1) {
        componentOrder.value[dropIndex] = {
          id: targetItem.id,
          type: 'component',
          component: [{
            component: markRaw(tabsList.value[0].component),
            title: tabsList.value[0].title,
          }],
          cols: targetItem.cols,
        };
        tabsList.value = targetTabsList.map(tab => ({
          ...tab,
          component: markRaw(tab.component),
          id: uuidv4(),
        }));
        if (tabsList.value.length > 1) {
          initializeTabState(targetItem.id);
        } else {
          tab.value = tabsList.value[0].value;
        }
      } else {
        componentOrder.value[dropIndex] = {
          id: targetItem.id,
          type: 'tabsList',
          tabsList: [
            ...targetTabsList,
            ...tabsList.value.map(tabItem => ({
              ...tabItem,
              component: markRaw(tabItem.component),
            })),
          ],
          cols: targetItem.cols,
        };
        tabsList.value = [];
        initializeTabState(targetItem.id);
      }
    }

    componentHeading.value.forEach(heading => {
      if (tabsList.value.some(tab => tab.component === heading.component)) {
        heading.visibility = true;
        heading.icon = 'fa-solid fa-eye';
        heading.storedTab = null;
        heading.storedComponent = null;
      } else if (
        componentOrder.value[dropIndex].type === 'tabsList' &&
        componentOrder.value[dropIndex].tabsList?.some(tab => tab.component === heading.component)
      ) {
        heading.visibility = true;
        heading.icon = 'fa-solid fa-eye';
        heading.storedTab = null;
        heading.storedComponent = null;
      } else if (
        componentOrder.value[dropIndex].type === 'component' &&
        componentOrder.value[dropIndex].component?.[0].component === heading.component
      ) {
        heading.visibility = true;
        heading.icon = 'fa-solid fa-eye';
        heading.storedTab = null;
        heading.storedComponent = null;
      }
    });

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

    if (targetItem.type === 'placeholder') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: [{ component: markRaw(draggedHiddenComponent.value.component) }],
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === draggedHiddenComponent.value.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedTab = null;
        headingItem.storedComponent = null;
        headingItem.storedPlaceholder = null;
      }
    }
    else if (targetItem.type === 'tabsList') {
      const newTab = {
        id: uuidv4(),
        title: draggedHiddenComponent.value.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(draggedHiddenComponent.value.component),
      };
      targetItem.tabsList.push(newTab);
      initializeTabState(targetItem.id);
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === draggedHiddenComponent.value.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedTab = null;
        headingItem.storedComponent = null;
        headingItem.storedPlaceholder = null;
      }
    }
    else if (targetItem.type === 'component') {
      const newTab = {
        id: uuidv4(),
        title: targetItem.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(targetItem.component[0].component),
      };
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: [{ component: markRaw(draggedHiddenComponent.value.component) }],
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
      tabsList.value.push(newTab);
      tab.value = newTab.value;

      const headingItem = componentHeading.value.find(
        (heading) => heading.component === draggedHiddenComponent.value.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedTab = null;
        headingItem.storedComponent = null;
        headingItem.storedPlaceholder = null;
      }

      const oldHeadingItem = componentHeading.value.find(
        (heading) => heading.component === newTab.component
      );
      if (oldHeadingItem) {
        oldHeadingItem.visibility = true;
        oldHeadingItem.icon = 'fa-solid fa-eye';
        oldHeadingItem.storedTab = null;
        oldHeadingItem.storedComponent = null;
      }
    }

    draggedHiddenComponent.value = null;
    return;
  }

  // Handle component or placeholder drop from componentOrder
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;
    const targetItem = componentOrder.value[dropIndex];

    if (targetItem.type === 'tabsList') {
      // Create a tab for each component in the dragged column
      dragged.component?.forEach((comp) => {
        const newTab = {
          id: uuidv4(),
          title: comp.title || dragged.title,
          value: `custom-${targetItem.id}-${uuidv4()}`,
          component: markRaw(comp.component),
        };
        targetItem.tabsList.push(newTab);
      });
      initializeTabState(targetItem.id);

      // Remove the dragged item and replace with placeholder
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });

      // Update visibility for all components in the dragged column
      dragged.component?.forEach((comp) => {
        const headingItem = componentHeading.value.find(
          (heading) => heading.component === comp.component
        );
        if (headingItem) {
          headingItem.visibility = true;
          headingItem.icon = 'fa-solid fa-eye';
          headingItem.storedComponent = null;
          headingItem.storedTab = null;
        }
      });

      draggedItem.value = null;
      draggedIndex.value = null;
      return;
    }

    componentOrder.value.splice(fromIndex, 1);
    componentOrder.value.splice(dropIndex, 0, dragged);
    draggedItem.value = null;
    draggedIndex.value = null;
    return;
  }

  // Handle placeholder drop from placeHolderLayout
  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    const targetItem = componentOrder.value[dropIndex];

    // Handle swap when both source and target are components and dragged.cols === 12
    if (dragged.type === 'component' && targetItem.type === 'component' && dragged.cols === 12) {
      // Swap components between componentOrder and placeHolderLayout
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: [{ component: markRaw(dragged.component), title: dragged.title }],
        cols: targetItem.cols,
        title: dragged.title,
      };
      placeHolderLayout.value[fromIndex] = {
        id: dragged.id,
        type: 'component',
        component: markRaw(targetItem.component[0].component),
        cols: dragged.cols,
        title: targetItem.component[0].title,
      };

      // Update visibility in componentHeading for both components
      const draggedHeading = componentHeading.value.find(h => h.component === dragged.component);
      const targetHeading = componentHeading.value.find(h => h.component === targetItem.component[0].component);
      if (draggedHeading) {
        draggedHeading.visibility = true;
        draggedHeading.icon = 'fa-solid fa-eye';
        draggedHeading.storedComponent = null;
        draggedHeading.storedPlaceholder = null;
        draggedHeading.storedTab = null;
      }
      if (targetHeading) {
        targetHeading.visibility = true;
        targetHeading.icon = 'fa-solid fa-eye';
        targetHeading.storedComponent = null;
        targetHeading.storedPlaceholder = null;
        targetHeading.storedTab = null;
      }
    } else if (dragged.type === 'component') {
      // Original logic for non-swap cases
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: [{ component: markRaw(dragged.component), title: dragged.title }],
        cols: targetItem.cols,
        title: dragged.title,
      };
      placeHolderLayout.value[fromIndex] = {
        id: dragged.id,
        type: targetItem.type,
        component: targetItem.type === 'component' ? markRaw(targetItem.component[0]?.component) : null,
        cols: dragged.cols,
        title: targetItem.title,
      };
    } else {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'placeholder',
        cols: targetItem.cols,
      };
      placeHolderLayout.value[fromIndex] = {
        id: dragged.id,
        type: targetItem.type,
        component: targetItem.type === 'component' ? markRaw(targetItem.component[0]?.component) : null,
        cols: dragged.cols,
        title: targetItem.title,
      };
    }

    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
    return;
  }

  // Handle tab drop from tabsList to componentOrder
  if (draggedTab.value) {
    const tabItem = draggedTab.value;
    const tabIndex = draggedTabIndex.value;
    const tabsListId = draggedTab.value.tabsListId;
    const targetItem = componentOrder.value[dropIndex];

    let sourceTabsList = tabsListId
      ? placeHolderLayout.value.find(item => item.id === tabsListId)?.tabsList
      : tabsList.value;

    if (!sourceTabsList) {
      console.error("Source tabsList not found");
      draggedTab.value = null;
      draggedTabIndex.value = null;
      return;
    }

    // If target is a placeholder
    if (targetItem.type === 'placeholder') {
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: [{ component: markRaw(tabItem.component), title: tabItem.title }],
        cols: targetItem.cols,
        title: tabItem.title,
      };
    }
    // If target is a component
    else if (targetItem.type === 'component') {
      const newTab = {
        id: uuidv4(),
        title: targetItem.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(targetItem.component[0].component),
      };
      componentOrder.value[dropIndex] = {
        id: targetItem.id,
        type: 'component',
        component: [{ component: markRaw(tabItem.component), title: tabItem.title }],
        cols: targetItem.cols,
        title: tabItem.title,
      };
      tabsList.value.push(newTab);
      tab.value = newTab.value;

      const oldHeadingItem = componentHeading.value.find(
        (heading) => heading.component === newTab.component
      );
      if (oldHeadingItem) {
        oldHeadingItem.visibility = true;
        oldHeadingItem.icon = 'fa-solid fa-eye';
        oldHeadingItem.storedTab = null;
        oldHeadingItem.storedComponent = null;
      }
    }
    // If target is a tabsList
    else if (targetItem.type === 'tabsList') {
      const newTab = {
        id: uuidv4(),
        title: tabItem.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(tabItem.component),
      };
      targetItem.tabsList.push(newTab);
      initializeTabState(targetItem.id);
    }

    // Remove tab from source tabsList
    sourceTabsList.splice(tabIndex, 1);

    // If source tabsList is empty and in placeHolderLayout
    if (sourceTabsList.length === 0 && tabsListId) {
      const targetItem = placeHolderLayout.value.find(item => item.id === tabsListId);
      if (targetItem) {
        targetItem.type = 'placeholder';
        targetItem.tabsList = [];
        delete tabStates.value[tabsListId];
        const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
        if (tabsHeading) {
          tabsHeading.visibility = false;
          tabsHeading.icon = 'fa-solid fa-eye-slash';
          tabsHeading.storedTabsList = null;
        }
      }
    }

    // If main tabsList is empty
    if (sourceTabsList === tabsList.value && tabsList.value.length === 0) {
      tab.value = null;
    } else if (sourceTabsList === tabsList.value && tab.value === tabItem.value) {
      tab.value = tabsList.value.length > 0 ? tabsList.value[0].value : null;
    }

    // Update componentHeading
    const headingItem = componentHeading.value.find(h => h.component === tabItem.component);
    if (headingItem) {
      headingItem.visibility = true;
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.storedTab = null;
      headingItem.storedComponent = null;
    }

    draggedTab.value = null;
    draggedTabIndex.value = null;
    return;
  }
};

// Drop handler for placeholder layout
const onDropToPlaceholder = (event, placeholderId, dropIndex) => {
  event.preventDefault();
  const placeholderIndex = placeHolderLayout.value.findIndex(item => item.id === placeholderId);
  if (placeholderIndex === -1) {
    console.error('Placeholder not found:', placeholderId);
    return;
  }

  const targetItem = placeHolderLayout.value[placeholderIndex];

  // Handle hidden component drop
  if (draggedHiddenComponent.value) {
    // If dropping 'Tabs' component into cols 12
    if (draggedHiddenComponent.value.title === 'Tabs' && targetItem.cols === 12) {
      // If the target placeholder already has a component, move it to main tabsList
      if (targetItem.type === 'component') {
        const existingComponent = targetItem;
        tabsList.value.push({
          id: uuidv4(),
          title: existingComponent.title,
          value: `custom-${existingComponent.id}-${uuidv4()}`,
          component: markRaw(existingComponent.component),
        });
        if (!tab.value && tabsList.value.length > 0) {
          tab.value = tabsList.value[0].value;
        }
        // Update visibility of the moved component in componentHeading
        const existingHeading = componentHeading.value.find(h => h.component === existingComponent.component);
        if (existingHeading) {
          existingHeading.visibility = true;
          existingHeading.icon = 'fa-solid fa-eye';
          existingHeading.storedComponent = null;
          existingHeading.storedPlaceholder = null;
          existingHeading.storedTab = null;
        }
      }
      // Create a new tabsList in the placeholder
      placeHolderLayout.value[placeholderIndex] = {
        id: targetItem.id,
        type: 'tabsList',
        tabsList: [],
        cols: 12,
      };
      initializeTabState(targetItem.id);
      const headingItem = componentHeading.value.find(h => h.title === 'Tabs');
      if (headingItem) {
        headingItem.visibility = true;
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.storedTabsList = { tabsList: [], id: targetItem.id };
      }
      draggedHiddenComponent.value = null;
      return;
    }
    // телеви If dropping other components
    if (targetItem.type === 'tabsList' && targetItem.cols === 12) {
      // Add to existing tabsList
      const newTab = {
        id: uuidv4(),
        title: draggedHiddenComponent.value.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(draggedHiddenComponent.value.component),
      };
      placeHolderLayout.value[placeholderIndex].tabsList.push(newTab);
      initializeTabState(targetItem.id);
    } else if (targetItem.type === 'component' && targetItem.cols === 12) {
      // Swap with existing component
      const existingComponent = targetItem;
      const newComponent = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(draggedHiddenComponent.value.component),
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
      // Move existing component to tabsList
      tabsList.value.push({
        id: uuidv4(),
        title: existingComponent.title,
        value: `custom-${existingComponent.id}-${uuidv4()}`,
        component: markRaw(existingComponent.component),
      });
      if (!tab.value && tabsList.value.length > 0) {
        tab.value = tabsList.value[0].value;
      }
      // Update visibility of the moved component
      const existingHeading = componentHeading.value.find(h => h.component === existingComponent.component);
      if (existingHeading) {
        existingHeading.visibility = true;
        existingHeading.icon = 'fa-solid fa-eye';
        existingHeading.storedComponent = null;
        existingHeading.storedPlaceholder = null;
        existingHeading.storedTab = null;
      }
      placeHolderLayout.value[placeholderIndex] = newComponent;
    } else {
      // Place as component for all other cases
      placeHolderLayout.value[placeholderIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(draggedHiddenComponent.value.component),
        cols: targetItem.cols,
        title: draggedHiddenComponent.value.title,
      };
    }
    const headingItem = componentHeading.value.find(h => h.component === draggedHiddenComponent.value.component);
    if (headingItem) {
      headingItem.visibility = true;
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.storedComponent = null;
      headingItem.storedPlaceholder = null;
      headingItem.storedTab = null;
    }
    draggedHiddenComponent.value = null;
    return;
  }

  // Handle component drop from componentOrder
  if (draggedItem.value) {
    const dragged = draggedItem.value;
    const fromIndex = draggedIndex.value;

    if (targetItem.type === 'tabsList' && targetItem.cols === 12) {
      // Add each component as a separate tab
      dragged.component?.forEach((comp) => {
        const newTab = {
          id: uuidv4(),
          title: comp.title || dragged.title,
          value: `custom-${targetItem.id}-${uuidv4()}`,
          component: markRaw(comp.component),
        };
        placeHolderLayout.value[placeholderIndex].tabsList.push(newTab);
      });
      initializeTabState(targetItem.id);
      // Remove from componentOrder and replace with placeholder
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });
      // Update visibility for all components
      dragged.component?.forEach((comp) => {
        const headingItem = componentHeading.value.find(
          (heading) => heading.component === comp.component
        );
        if (headingItem) {
          headingItem.visibility = true;
          headingItem.icon = 'fa-solid fa-eye';
          headingItem.storedComponent = null;
          headingItem.storedTab = null;
        }
      });
      draggedItem.value = null;
      draggedIndex.value = null;
      return;
    } else if (targetItem.type === 'component' && targetItem.cols === 12) {
      // Swap with existing component
      const existingComponent = targetItem;
      const newComponent = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(dragged.component[0].component),
        cols: targetItem.cols,
        title: dragged.title,
      };
      // Move existing component to componentOrder
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'component',
        component: [{ component: markRaw(existingComponent.component), title: existingComponent.title }],
        cols: dragged.cols,
        title: existingComponent.title,
      });
      // Update visibility of the moved component
      const existingHeading = componentHeading.value.find(h => h.component === existingComponent.component);
      if (existingHeading) {
        existingHeading.visibility = true;
        existingHeading.icon = 'fa-solid fa-eye';
        existingHeading.storedComponent = null;
        existingHeading.storedPlaceholder = null;
        existingHeading.storedTab = null;
      }
      placeHolderLayout.value[placeholderIndex] = newComponent;
    } else {
      // Place as component for all other cases
      placeHolderLayout.value[placeholderIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(dragged.component[0].component),
        cols: targetItem.cols,
        title: dragged.title,
      };
      componentOrder.value.splice(fromIndex, 1, {
        id: dragged.id,
        type: 'placeholder',
        cols: dragged.cols,
      });
    }
    const headingItem = componentHeading.value.find(h => h.component === dragged.component[0].component);
    if (headingItem) {
      headingItem.visibility = true;
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.storedComponent = null;
      headingItem.storedTab = null;
    }
    draggedItem.value = null;
    draggedIndex.value = null;
    return;
  }

  // Handle placeholder drop
  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    if (targetItem.type === 'component' && targetItem.cols === 12 && dragged.cols === 12) {
      // Swap components between placeholders
      placeHolderLayout.value[placeholderIndex] = {
        id: targetItem.id,
        type: dragged.type,
        component: dragged.type === 'component' ? markRaw(dragged.component) : null,
        tabsList: dragged.type === 'tabsList' ? dragged.tabsList : [],
        cols: targetItem.cols,
        title: dragged.title,
      };
      placeHolderLayout.value[fromIndex] = {
        id: dragged.id,
        type: 'component',
        component: markRaw(targetItem.component),
        cols: dragged.cols,
        title: targetItem.title,
      };
      if (dragged.type === 'tabsList') {
        initializeTabState(targetItem.id);
      }
      // Update visibility of the moved component
      const existingHeading = componentHeading.value.find(h => h.component === targetItem.component);
      if (existingHeading) {
        existingHeading.visibility = true;
        existingHeading.icon = 'fa-solid fa-eye';
        existingHeading.storedComponent = null;
        existingHeading.storedPlaceholder = null;
        existingHeading.storedTab = null;
      }
    } else {
      placeHolderLayout.value.splice(fromIndex, 1);
      placeHolderLayout.value.splice(placeholderIndex, 0, dragged);
    }
    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
    return;
  }

  // Handle tab drop
  if (draggedTab.value) {
    const tabItem = draggedTab.value;
    const tabIndex = draggedTabIndex.value;
    const tabsListId = draggedTab.value.tabsListId;
    let sourceTabsList = tabsListId
      ? placeHolderLayout.value.find(item => item.id === tabsListId)?.tabsList
      : tabsList.value;

    if (!sourceTabsList) {
      console.error("Source tabsList not found");
      draggedTab.value = null;
      draggedTabIndex.value = null;
      return;
    }

    if (targetItem.type === 'tabsList' && targetItem.cols === 12) {
      // Add to existing tabsList
      const newTab = {
        id: uuidv4(),
        title: tabItem.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(tabItem.component),
      };
      placeHolderLayout.value[placeholderIndex].tabsList.push(newTab);
      initializeTabState(targetItem.id);
    } else if (targetItem.type === 'component' && targetItem.cols === 12) {
      // Swap with existing component
      const existingComponent = targetItem;
      placeHolderLayout.value[placeholderIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
      // Move existing component to tabsList
      tabsList.value.push({
        id: uuidv4(),
        title: existingComponent.title,
        value: `custom-${existingComponent.id}-${uuidv4()}`,
        component: markRaw(existingComponent.component),
      });
      if (!tab.value && tabsList.value.length > 0) {
        tab.value = tabsList.value[0].value;
      }
      // Update visibility of the moved component
      const existingHeading = componentHeading.value.find(h => h.component === existingComponent.component);
      if (existingHeading) {
        existingHeading.visibility = true;
        existingHeading.icon = 'fa-solid fa-eye';
        existingHeading.storedComponent = null;
        existingHeading.storedPlaceholder = null;
        existingHeading.storedTab = null;
      }
    } else {
      // Place as component for all other cases
      placeHolderLayout.value[placeholderIndex] = {
        id: targetItem.id,
        type: 'component',
        component: markRaw(tabItem.component),
        cols: targetItem.cols,
        title: tabItem.title,
      };
    }

    sourceTabsList.splice(tabIndex, 1);

    if (sourceTabsList.length === 0 && tabsListId) {
      const sourceItem = placeHolderLayout.value.find(item => item.id === tabsListId);
      if (sourceItem) {
        sourceItem.type = 'placeholder';
        sourceItem.tabsList = [];
        delete tabStates.value[tabsListId];
        const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
        if (tabsHeading) {
          tabsHeading.visibility = false;
          tabsHeading.icon = 'fa-solid fa-eye-slash';
          tabsHeading.storedTabsList = null;
        }
      }
    }

    if (sourceTabsList === tabsList.value && tabsList.value.length === 0) {
      tab.value = null;
    } else if (sourceTabsList === tabsList.value && tab.value === tabItem.value) {
      tab.value = tabsList.value.length > 0 ? tabsList.value[0].value : null;
    }

    const headingItem = componentHeading.value.find(h => h.component === tabItem.component);
    if (headingItem) {
      headingItem.visibility = true;
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.storedTab = null;
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
      id: uuidv4(),
    });
    tab.value = tabValue;

    // Update visibility and icon in componentHeading
    const headingItem = componentHeading.value.find(
      (heading) => heading.component === draggedHiddenComponent.value.component
    );
    if (headingItem) {
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.visibility = true;
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

    // Add each component as a separate tab
    dragged.component?.forEach((comp) => {
      const tabValue = `custom-${uuidv4()}`;
      tabsList.value.push({
        title: comp.title || dragged.title,
        value: tabValue,
        component: markRaw(comp.component),
        id: uuidv4(),
      });
      tab.value = tabValue; // Set to the last added tab
    });

    // Replace dragged item with placeholder
    componentOrder.value.splice(fromIndex, 1, {
      id: dragged.id,
      type: 'placeholder',
      cols: dragged.cols,
    });

    // Update visibility for all components
    dragged.component?.forEach((comp) => {
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === comp.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedComponent = null;
        headingItem.storedPlaceholder = null;
        headingItem.storedTab = null;
      }
    });

    draggedItem.value = null;
    draggedIndex.value = null;
    return;
  }

  if (draggedPlaceholder.value) {
    const dragged = draggedPlaceholder.value;
    const fromIndex = draggedPlaceholderIndex.value;
    const tabValue = `custom-${uuidv4()}`;
    if (dragged.type === 'component') {
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
      tabsList.value.push({
        title: 'Placeholder',
        value: tabValue,
        component: null,
        id: uuidv4(),
      });
      placeHolderLayout.value.splice(fromIndex, 1);
    }
    tab.value = tabValue;

    // Update visibility and icon in componentHeading for component type
    if (dragged.type === 'component') {
      const headingItem = componentHeading.value.find(
        (heading) => heading.component === dragged.component
      );
      if (headingItem) {
        headingItem.icon = 'fa-solid fa-eye';
        headingItem.visibility = true;
        headingItem.storedComponent = null;
        headingItem.storedPlaceholder = null;
        headingItem.storedTab = null;
      }
    }

    draggedPlaceholder.value = null;
    draggedPlaceholderIndex.value = null;
    return;
  }

  if (draggedTab.value) {
    const tabItem = draggedTab.value;
    const tabIndex = draggedTabIndex.value;
    const tabsListId = draggedTab.value.tabsListId;
    const tabValue = `custom-${uuidv4()}`;

    let sourceTabsList = tabsListId
      ? placeHolderLayout.value.find(item => item.id === tabsListId)?.tabsList
      : tabsList.value;

    if (!sourceTabsList) {
      console.error("Source tabsList not found");
      draggedTab.value = null;
      draggedTabIndex.value = null;
      return;
    }

    tabsList.value.push({
      title: tabItem.title,
      value: tabValue,
      component: markRaw(tabItem.component),
      id: uuidv4(),
    });
    tab.value = tabValue;

    sourceTabsList.splice(tabIndex, 1);

    if (sourceTabsList.length === 0 && tabsListId) {
      const targetItem = placeHolderLayout.value.find(item => item.id === tabsListId);
      if (targetItem) {
        targetItem.type = 'placeholder';
        targetItem.tabsList = [];
        delete tabStates.value[tabsListId];
        const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
        if (tabsHeading) {
          tabsHeading.visibility = false;
          tabsHeading.icon = 'fa-solid fa-eye-slash';
          tabsHeading.storedTabsList = null;
        }
      }
    }

    if (sourceTabsList === tabsList.value && tabsList.value.length === 0) {
      tab.value = null;
    } else if (sourceTabsList === tabsList.value && tab.value === tabItem.value) {
      tab.value = tabsList.value.length > 0 ? tabsList.value[0].value : null;
    }

    const headingItem = componentHeading.value.find(h => h.component === tabItem.component);
    if (headingItem) {
      headingItem.icon = 'fa-solid fa-eye';
      headingItem.visibility = true;
      headingItem.storedComponent = null;
      headingItem.storedPlaceholder = null;
      headingItem.storedTab = null;
    }

    draggedTab.value = null;
    draggedTabIndex.value = null;
    return;
  }
};

// Set column width
const setColumnWidth = (id, width, type = 'component') => {
  const layout = type === 'component' ? componentOrder.value : placeHolderLayout.value;
  const item = layout.find((item) => item.id === id);
  if (!item) return;

  item.cols = width;
  const totalCols = 12;
  let currentRowCols = 0;
  let currentRow = [];
  const newRows = [];

  layout.forEach((item) => {
    if (currentRowCols + item.cols <= totalCols) {
      currentRow.push(item);
      currentRowCols += item.cols;
    } else {
      if (currentRow.length > 0) {
        newRows.push([...currentRow]);
      }
      currentRow = [item];
      currentRowCols = item.cols;
    }
  });

  if (currentRow.length > 0) {
    newRows.push([...currentRow]);
  }

  const lastRow = newRows[newRows.length - 1];
  const lastRowCols = lastRow.reduce((sum, curr) => sum + curr.cols, 0);
  if (lastRowCols < totalCols) {
    lastRow.push({
      id: uuidv4(),
      type: 'placeholder',
      cols: totalCols - lastRowCols,
    });
  }

  if (type === 'placeholder') {
    placeHolderLayout.value = newRows.flat();
    // Reset hover states for all rows
    hoverPlaceholderRows.value = {};
  } else {
    componentOrder.value = newRows.flat();
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

// Updated function to delete component or tabsList in placeholder without removing the placeholder column
const deletePlaceholderColumn = (id, index) => {
  const itemIndex = placeHolderLayout.value.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    console.error('Placeholder not found:', id);
    return;
  }

  const targetItem = placeHolderLayout.value[itemIndex];

  // Handle component deletion
  if (targetItem.type === 'component') {
    const headingItem = componentHeading.value.find(
      (heading) => heading.component === targetItem.component
    );
    if (headingItem) {
      // Update visibility and icon
      headingItem.visibility = false;
      headingItem.icon = 'fa-solid fa-eye-slash';
      // Store the component for restoration
      headingItem.storedComponent = {
        component: markRaw(targetItem.component),
        title: targetItem.title,
      };
      headingItem.storedPlaceholder = null;
      headingItem.storedTab = null;
    }
    // Reset placeholder to empty state
    placeHolderLayout.value[itemIndex] = {
      id: targetItem.id,
      type: 'placeholder',
      cols: targetItem.cols,
    };
    return;
  }

  // Handle tabsList deletion
  if (targetItem.type === 'tabsList') {
    const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
    if (tabsHeading) {
      // Update visibility and icon
      tabsHeading.visibility = false;
      tabsHeading.icon = 'fa-solid fa-eye-slash';
      // Store the tabsList for restoration
      tabsHeading.storedTabsList = {
        tabsList: targetItem.tabsList,
        id: targetItem.id,
      };
    }
    // Move tabs to main tabsList
    targetItem.tabsList.forEach(tab => {
      tabsList.value.push({
        id: uuidv4(),
        title: tab.title,
        value: `custom-${targetItem.id}-${uuidv4()}`,
        component: markRaw(tab.component),
      });
    });
    if (!tab.value && tabsList.value.length > 0) {
      tab.value = tabsList.value[0].value;
    }
    // Reset placeholder to empty state
    placeHolderLayout.value[itemIndex] = {
      id: targetItem.id,
      type: 'placeholder',
      cols: targetItem.cols,
    };
    // Clean up tabStates
    delete tabStates.value[targetItem.id];
    return;
  }

  // If placeholder is already empty, no action needed
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

// show the dialog box and delete entire component order section 
const deleteComponentRow = () => {
  deleteContext.value = 'componentRow'; // Set context to componentRow
  showDeleteConfirm.value = true;
};

// delete the entire tablist section
const deleteTabsSection = () => {
  deleteContext.value = 'tabsSection'; // Set context to tabsSection
  showDeleteConfirm.value = true;
};

// Delete the entire components orders and tablist section and hide those deleted components form drawer
const confirmDelete = () => {
  if (deleteContext.value === 'componentRow') {
    componentOrder.value.forEach((item, index) => {
      if (item.type === 'component') {
        item.component.forEach((comp) => {
          const headingItem = componentHeading.value.find(
            (heading) => heading.component === comp.component
          );
          if (headingItem) {
            headingItem.visibility = false;
            headingItem.icon = 'fa-solid fa-eye-slash';
            headingItem.storedComponent = { component: [comp], title: comp.title, index, cols: item.cols };
          }
        });
      }
    });
    componentOrder.value = [];
  } else if (deleteContext.value === 'tabsSection') {
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
    tab.value = null;
    const tabsSectionIndex = sectionOrder.value.findIndex(
      (section) => section.type === 'tabsList'
    );
    if (tabsSectionIndex !== -1) {
      sectionOrder.value.splice(tabsSectionIndex, 1);
    }
  } else if (deleteContext.value === 'placeholderRow') {
    deletePlaceholderRowConfirmed(deleteRowIndex.value);
  }
  showDeleteConfirm.value = false;
  deleteContext.value = null;
  deleteRowIndex.value = null;
};

// for drag the entire the component & tablist row 
const onSectionDragStart = (event, section, index) => {
  console.log("the section start is :", section, index)
  draggedSection.value = section;
  draggedSectionIndex.value = index;
  event.dataTransfer.setData('sectionType', section.type);
};

// drop the entire sectoin for swaping the row or section 
const onSectionDrop = (event, dropIndex) => {
  event.preventDefault();
  if (!draggedSection.value && !draggedPlaceholderRow.value) return;

  if (draggedSection.value) {
    const fromIndex = draggedSectionIndex.value;
    if (fromIndex === dropIndex) {
      draggedSection.value = null;
      draggedSectionIndex.value = null;
      return;
    }

    const dragged = sectionOrder.value.splice(fromIndex, 1)[0];
    sectionOrder.value.splice(dropIndex, 0, dragged);
    draggedSection.value = null;
    draggedSectionIndex.value = null;
    return;
  }

  if (draggedPlaceholderRow.value && draggedPlaceholderSection.value) {
    const fromSectionIndex = draggedPlaceholderSectionIndex.value;
    const fromRowIndex = draggedPlaceholderRowIndex.value;

    // If dropping into a placeholder section
    const targetSection = sectionOrder.value[dropIndex];
    if (targetSection.type === 'placeholder') {
      // Remove the dragged row's items from placeHolderLayout
      const rowItemIds = draggedPlaceholderRow.value.map(item => item.id);
      placeHolderLayout.value = placeHolderLayout.value.filter(item => !rowItemIds.includes(item.id));

      // Insert the dragged row's items into placeHolderLayout (at the end for simplicity)
      placeHolderLayout.value.push(...draggedPlaceholderRow.value);

      // If the source section is now empty, remove it
      if (placeHolderLayout.value.length === 0 && sectionOrder.value[fromSectionIndex].type === 'placeholder') {
        sectionOrder.value.splice(fromSectionIndex, 1);
      }

      // Ensure a placeholder section exists in sectionOrder
      if (!sectionOrder.value.some(section => section.type === 'placeholder')) {
        sectionOrder.value.push({ id: uuidv4(), type: 'placeholder' });
      }
    } else {
      // If dropping into a non-placeholder section, swap sections
      const dragged = sectionOrder.value.splice(fromSectionIndex, 1)[0];
      sectionOrder.value.splice(dropIndex, 0, dragged);
    }

    // Clean up
    draggedPlaceholderRow.value = null;
    draggedPlaceholderRowIndex.value = null;
    draggedPlaceholderSection.value = null;
    draggedPlaceholderSectionIndex.value = null;
  }
};

// Handle the entire tabsList when drag starts
const onAllTabsDragStart = (event) => {
  isDraggingAllTabs.value = true;
  event.dataTransfer.setData('allTabsDrag', 'tabsList');
};

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

    // Transform lastItem for placeHolderLayout if it's a component
    if (lastItem.type === 'component') {
      lastItem = {
        id: lastItem.id,
        type: 'component',
        component: lastItem.component[0]?.component ? markRaw(lastItem.component[0].component) : null,
        cols: lastItem.cols,
        title: lastItem.title,
      };
    }

    // Add the transformed item to placeHolderLayout
    placeHolderLayout.value.unshift(lastItem);

    // Ensure componentOrder is exactly 12 cols
    currentRowCols = componentOrder.value.reduce((sum, item) => sum + item.cols, 0);
    if (currentRowCols < totalCols) {
      componentOrder.value.push({
        id: uuidv4(),
        type: 'placeholder',
        cols: totalCols - currentRowCols,
      });
    }
  }

  // Add a placeholder to placeHolderLayout to match desired output
  placeHolderLayout.value.push({
    id: uuidv4(),
    type: 'placeholder',
    cols: currentCols, // Use same cols as duplicated item for consistency
  });

  // Adjust widths in placeHolderLayout
  adjustPlaceholderWidth();

  console.log("the placeholder layout is:", placeHolderLayout.value);
};

// function for dublicate placeholder cols 
const duplicatePlaceholderColumn = (componentItem, index) => {
  const totalCols = 12;
  const currentCols = componentItem.cols;

  const newPlaceholder = {
    id: uuidv4(),
    type: 'placeholder',
    cols: currentCols,
  };

  placeHolderLayout.value.splice(index + 1, 0, newPlaceholder);

  let currentRowCols = 0;
  let currentRow = [];
  const newRows = [];

  placeHolderLayout.value.forEach((item) => {
    if (currentRowCols + item.cols <= totalCols) {
      currentRow.push(item);
      currentRowCols += item.cols;
    } else {
      if (currentRow.length > 0) {
        newRows.push([...currentRow]);
      }
      currentRow = [item];
      currentRowCols = item.cols;
    }
  });

  if (currentRow.length > 0) {
    newRows.push([...currentRow]);
  }

  const lastRow = newRows[newRows.length - 1];
  const lastRowCols = lastRow.reduce((sum, curr) => sum + curr.cols, 0);
  if (lastRowCols < totalCols) {
    lastRow.push({
      id: uuidv4(),
      type: 'placeholder',
      cols: totalCols - lastRowCols,
    });
  }

  placeHolderLayout.value = newRows.flat();
  // Reset hover states for all rows
  hoverPlaceholderRows.value = {};
};

// function for component drag and drop into column and Updated onComponentDragStart to ensure the correct component is tracked for deletion
const onComponentDragStart = (event, comp, compIndex, parentItem, parentIndex) => {
  draggedComponent.value = comp;
  draggedComponentIndex.value = compIndex;
  draggedComponentParent.value = { item: parentItem, index: parentIndex };
  event.dataTransfer.setData('componentDrag', comp.title);
};

// this will make the new section of the placeholder roe if the placeholder row column exceeds with 12 cols 
const placeHolderRows = computed(() => {
  const totalCols = 12;
  let currentRowCols = 0;
  let currentRow = [];
  const rows = [];

  placeHolderLayout.value.forEach((item) => {
    if (currentRowCols + item.cols <= totalCols) {
      currentRow.push(item);
      currentRowCols += item.cols;
    } else {
      rows.push([...currentRow]);
      currentRow = [item];
      currentRowCols = item.cols;
    }
  });

  if (currentRow.length > 0) {
    rows.push([...currentRow]);
  }

  return rows.map((row) => {
    const rowCols = row.reduce((sum, item) => sum + item.cols, 0);
    if (rowCols < totalCols) {
      row.push({
        id: uuidv4(),
        type: 'placeholder',
        cols: totalCols - rowCols,
      });
    }
    return row;
  });
});

// this function is for delete the entire row of placeholder 
const deletePlaceholderRow = (rowIndex) => {
  const row = placeHolderRows.value[rowIndex];
  if (!row) {
    return;
  }

  // Check if the row contains any components or tabsList
  const containsComponent = row.some(
    (item) => item.type === 'component' || item.type === 'tabsList'
  );

  if (containsComponent) {
    // Show confirmation dialog if row contains components or tabs
    deleteContext.value = 'placeholderRow';
    deleteRowIndex.value = rowIndex;
    showDeleteConfirm.value = true;
  } else {
    // Directly delete the row if empty placeholder 
    deletePlaceholderRowConfirmed(rowIndex);
  }
};

// delte the entire row of placeholder and open the drawer if placeholder contains any components
const deletePlaceholderRowConfirmed = (rowIndex) => {
  const row = placeHolderRows.value[rowIndex];
  if (!row) {
    return;
  }

  // Process each item in the row to hide components
  row.forEach((item) => {
    if (item.type === 'component') {
      const component = componentHeading.value.find((comp) => comp.component === item.component);
      if (component) {
        component.visibility = false;
        component.icon = 'fa-solid fa-eye-slash';
        component.storedComponent = {
          component: markRaw(item.component),
          title: item.title,
          cols: item.cols,
          index: placeHolderLayout.value.findIndex(i => i.id === item.id),
        };
        component.storedPlaceholder = null;
        component.storedTab = null;
      }
    } else if (item.type === 'tabsList') {
      item.tabsList.forEach((tab) => {
        const tabComponent = componentHeading.value.find((comp) => comp.component === tab.component);
        if (tabComponent) {
          tabComponent.visibility = false;
          tabComponent.icon = 'fa-solid fa-eye-slash';
          tabComponent.storedTab = {
            title: tab.title,
            value: tab.value,
            component: markRaw(tab.component),
            index: item.tabsList.findIndex(t => t.id === tab.id),
            tabsListId: item.id,
          };
          tabComponent.storedComponent = null;
          tabComponent.storedPlaceholder = null;
        }
      });
      delete tabStates.value[item.id];
      const tabsHeading = componentHeading.value.find(h => h.title === 'Tabs');
      if (tabsHeading) {
        tabsHeading.visibility = false;
        tabsHeading.icon = 'fa-solid fa-eye-slash';
        tabsHeading.storedTabsList = null;
      }
    }
  });

  // Remove the items in this row from placeHolderLayout
  const rowItemIds = row.map(item => item.id);
  placeHolderLayout.value = placeHolderLayout.value.filter(item => !rowItemIds.includes(item.id));

  // Clean up hover state
  delete hoverPlaceholderRows.value[rowIndex];

  // If placeHolderLayout is empty, remove the placeholder section from sectionOrder
  if (placeHolderLayout.value.length === 0) {
    const placeholderSectionIndex = sectionOrder.value.findIndex(section => section.type === 'placeholder');
    if (placeholderSectionIndex !== -1) {
      sectionOrder.value.splice(placeholderSectionIndex, 1);
    }
  }
};

// Drag start handler for placeholder rows
const onPlaceholderRowDragStart = (event, row, rowIndex, section, sectionIndex) => {
  draggedPlaceholderRow.value = row;
  draggedPlaceholderRowIndex.value = rowIndex;
  draggedPlaceholderSection.value = section;
  draggedPlaceholderSectionIndex.value = sectionIndex;
  event.dataTransfer.setData('sectionType', 'placeholderRow');
};

// Drop handler for placeholder rows
const onPlaceholderRowDrop = (event, dropRowIndex, section, sectionIndex) => {
  event.preventDefault();

  // Handle placeholder row drop
  if (draggedPlaceholderRow.value && draggedPlaceholderSection.value) {
    const fromRowIndex = draggedPlaceholderRowIndex.value;
    const fromSectionIndex = draggedPlaceholderSectionIndex.value;

    // If dropping within the same placeholder section
    if (section.id === draggedPlaceholderSection.value.id && fromRowIndex === dropRowIndex) {
      draggedPlaceholderRow.value = null;
      draggedPlaceholderRowIndex.value = null;
      draggedPlaceholderSection.value = null;
      draggedPlaceholderSectionIndex.value = null;
      return;
    }

    // Remove the dragged row's items from placeHolderLayout
    const rowItemIds = draggedPlaceholderRow.value.map(item => item.id);
    placeHolderLayout.value = placeHolderLayout.value.filter(item => !rowItemIds.includes(item.id));

    // Insert the dragged row's items at the drop position
    const dropPosition = placeHolderRows.value.slice(0, dropRowIndex).reduce((sum, row) => sum + row.length, 0);
    placeHolderLayout.value.splice(dropPosition, 0, ...draggedPlaceholderRow.value);

    // Clean up
    draggedPlaceholderRow.value = null;
    draggedPlaceholderRowIndex.value = null;
    draggedPlaceholderSection.value = null;
    draggedPlaceholderSectionIndex.value = null;
    return;
  }

  // Handle section drop (componentOrder or tabsList) into placeholder section
  if (draggedSection.value) {
    const fromSectionIndex = draggedSectionIndex.value;
    const dragged = sectionOrder.value.splice(fromSectionIndex, 1)[0];

    // Insert the dragged section at the drop section index
    sectionOrder.value.splice(sectionIndex, 0, dragged);

    // Clean up
    draggedSection.value = null;
    draggedSectionIndex.value = null;
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

.tablist-tab:hover {
  background-color: rgba(136, 198, 213, 0.16);
}

.default-tab {
  background: rgba(136, 198, 213, 1);
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
  top: -11px;
  left: 10px;
  color: #c03131ed;
}

.dublicate-component-column {
  position: absolute;
  z-index: 1;
  top: 2px;
  left: 65px;
  color: #555;
}

/* css for drag componant */
.component-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.component-container {
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drag-component {
  position: absolute;
  z-index: 2;
  top: -10px;
  left: 30px;
  color: #555;
  cursor: grab;
}

/* css fo hover placeholder  */

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
  bottom: 28px;
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

.delete-dialog {
  background: rgba(47, 51, 73, 1);
  color: rgba(255, 222, 245, 0.7);
}

.dialog-text {
  text-align: center;
  font-size: 17px !important;
  color: rgba(225, 222, 245, 0.7);
  font-weight: 600;
}

.exclamation {
  border: thin solid rgba(255, 76, 81, 1);
  color: rgba(255, 2, 2, 1);
  font-size: 30px;
  width: 60px;
  border-radius: 50%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
