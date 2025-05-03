<template>
    <v-card class="main-section">
        <v-card-text >

            <!-- Tabs Header -->
            <v-tabs v-model="activeTab" class="tabs-row" grow>
                <v-tab class="h-100 ashwagandha-text">
                    <div class="d-flex flex-column justify-center align-center">
                        <v-img src="https://dev.recurrify.io/build/assets/ashw-CN2evbIM.png" width="32" height="32"
                            class="rounded-pill mb-1" cover style="min-width: 32px; min-height: 32px;" />
                        <span style="color: rgba(136, 198, 213, 1);">Ashwagandha</span>
                    </div>
                </v-tab>

                <v-tab class="h-100">
                    <div class="d-flex flex-column justify-center align-center">
                        <v-img src="https://dev.recurrify.io/build/assets/life-xMk_groY.png" width="32" height="32"
                            class="rounded-pill mb-1" cover style="min-width: 32px; min-height: 32px;" />
                        <span style="color: rgba(136, 198, 213, 1);">Life Lab</span>
                    </div>
                </v-tab>

                <!-- <i class="fa-solid fa-pen-to-square" @click="toggleEditMode"></i> -->
            </v-tabs>

            <v-tabs-window v-model="activeTab" class="mt-4">
                <!-- Ashwagandha Tab -->
                <v-tabs-window-item :value="0">
                    <!-- Stats -->
                    <v-row>
                        <v-col v-for="(item, index) in stats" :key="index" cols="6"
                            class="d-flex align-items-center gap-3">
                            <div class="d-flex align-items-center justify-content-center sign-container">
                                <i :class="`fa-solid ${item.icon} text-primary`"></i>
                            </div>
                            <div>
                                <h6 class="m-0 selected-title">{{ item.title }}</h6>
                                <p class="m-0 selected-total">{{ item.value }}</p>
                            </div>
                            <!-- add row plus icon -->
                            <div class="ashwagandha-plus-icon d-flex align-center justify-center">
                                <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="addNewRow">
                                    <i class="fa-solid fa-plus"></i>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>


                    <v-row v-for="(extraRow, rowIndex) in extraRows" :key="rowIndex"
                        @mouseenter="ashwagandhaRowHover = rowIndex" @mouseleave="ashwagandhaRowHover = null"
                        class="align-center">
                        <v-col cols="6" v-for="(field, fieldIndex) in [0, 1]" :key="fieldIndex">

                            <!-- Show + button if not selected -->
                            <div v-if="!extraRow.selectedStats[fieldIndex]">
                                <v-menu v-model="extraRow.menuOpen[fieldIndex]" offset-y
                                    :close-on-content-click="false">
                                    <template #activator="{ props }">
                                        <div v-bind="props" class="menu-container">+</div>
                                    </template>

                                    <v-card class="menu-list">
                                        <v-card-title>Add or Replace Details</v-card-title>
                                        <v-list class="px-2 menu-list-item">
                                            <v-list-item v-for="(item, index) in filteredMenuList(extraRow)"
                                                :key="index" @click="extraRow.tempSelection[fieldIndex] = item" :class="{
                                                    'selected-menu-item': extraRow.tempSelection[fieldIndex]?.title === item.title
                                                }" class="rounded">
                                                <v-list-item-title>
                                                    <i :class="`fa-solid ${item.icon} me-2`"></i>
                                                    {{ item.title }}
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>

                                        <v-card-actions class="justify-end">
                                            <v-btn variant="text"
                                                @click="cancelSelection(extraRow, fieldIndex)">Cancel</v-btn>
                                            <v-btn variant="flat" class="selected-menu-item"
                                                @click="applySelection(extraRow, fieldIndex)">
                                                Apply
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </div>

                            <!-- Show selected item -->
                            <div v-else class="d-flex align-items-center gap-3"
                                @click="openAshwagandhaEditMenu(extraRow, fieldIndex)">
                                <div class="d-flex align-items-center justify-content-center sign-container">
                                    <i :class="`fa-solid ${extraRow.selectedStats[fieldIndex].icon} text-primary`"></i>
                                </div>
                                <div>
                                    <h6 class="m-0 selected-title">{{ extraRow.selectedStats[fieldIndex].title }}</h6>
                                    <p class="m-0 selected-total">{{ extraRow.selectedStats[fieldIndex].value }}</p>
                                </div>

                                <v-menu v-model="extraRow.menuOpen[fieldIndex]" offset-y
                                    :close-on-content-click="false">
                                    <v-card class="menu-list">
                                        <v-card-title>Edit Details menu List </v-card-title>
                                        <v-list class="px-2 menu-list-item">
                                            <v-list-item v-for="(item, index) in filteredMenuList(extraRow)"
                                                :key="index" @click="selectEditAshwagandhaData(extraRow, fieldIndex, item)" :class="{
                                                    'selected-menu-item': extraRow.selectedStats[fieldIndex]?.title === item.title
                                                }" class="rounded">

                                                <v-list-item-title>
                                                    <i :class="`fa-solid ${item.icon} me-2`"></i>
                                                    {{ item.title }}
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>

                                        <v-card-actions class="justify-end">
                                            <v-btn variant="text"
                                                @click="cancelSelection(extraRow, fieldIndex)">Cancel</v-btn>
                                            <v-btn variant="flat"
                                                @click="applySelection(extraRow, fieldIndex)">Apply</v-btn>
                                        </v-card-actions>

                                    </v-card>
                                </v-menu>

                            </div>
                        </v-col>

                        <!-- Delete Button -->
                        <div v-if="ashwagandhaRowHover === rowIndex"
                            class="delete-icon d-flex align-center justify-center position-absolute">
                            <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="deleteRow(rowIndex)"
                                color="red">
                                <i class="fa-solid fa-trash delete-list-icon"></i>
                            </v-btn>
                        </div>
                    </v-row>

                    <!-- ashwagandha customer details -->
                    <v-row class="mt-3">
                        <v-col cols="12">
                            <div class="customer-details-container">
                                <VueDraggableNext v-model="ashwagandhaDetails" :animation="200">
                                    <div class="customer-details-grid" v-for="(customer, index) in ashwagandhaDetails"
                                        :key="index" @mouseenter="ashwagandhaCustomerDetailsHover = index"
                                        @mouseleave="ashwagandhaCustomerDetailsHover = null">
                                        <div class="detail-title">{{ customer.title }}</div>
                                        <div class="detail-value">{{ customer.value }}</div>
                                        <i v-if="ashwagandhaCustomerDetailsHover === index"
                                            class="fa-solid fa-trash mt-3 delete-list-icon"
                                            @click="deleteCustomer(index)"></i>
                                    </div>
                                </VueDraggableNext>
                            </div>
                        </v-col>

                        <v-col cols="12">
                            <v-menu v-model="lastRowMenuOpen" offset-y :close-on-content-click="false">
                                <template #activator="{ props }">
                                    <div v-bind="props" class="menu-container">+</div>
                                </template>

                                <v-card class="menu-list">
                                    <v-card-title>Select Details</v-card-title>
                                    <v-list class="px-2 menu-list-item">
                                        <v-list-item v-for="(item, index) in filteredMenuListForLastRow" :key="index"
                                            @click="toggleLastRowSelection(item)"
                                            :class="{ 'selected-menu-item': isSelected(item) }" class="rounded">
                                            <v-list-item-title>
                                                <i :class="`fa-solid ${item.icon} me-2`"></i>
                                                {{ item.title }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>

                                    <v-card-actions class="justify-end">
                                        <v-btn variant="text" @click="cancelLastRowSelections">Cancel</v-btn>
                                        <v-btn variant="flat" class="selected-menu-item"
                                            @click="applyLastRowSelections">Apply</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-col>
                    </v-row>
                </v-tabs-window-item>

                <!-- Life Lab Tab -->
                <v-tabs-window-item :value="1">
                    <v-row>
                        <v-col v-for="(item, index) in lifeLabStatsList" :key="index" cols="6"
                            class="d-flex align-items-center gap-3">
                            <div class="d-flex align-items-center justify-content-center sign-container">
                                <i :class="`fa-solid ${item.icon} text-primary`"></i>
                            </div>
                            <div>
                                <h6 class="m-0 selected-title">{{ item.title }}</h6>
                                <p class="m-0 selected-total">{{ item.value }}</p>
                            </div>

                            <div class="life-lab-plus-icon d-flex align-center justify-center">
                                <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="addLifeLabNewRow">
                                    <i class="fa-solid fa-plus"></i>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>

                    <!-- Extra Rows Dynamic  -->
                    <v-row v-for="(extraRow, rowIndex) in lifeLabExtraRows" :key="rowIndex"
                        @mouseenter="LifeLabRowHover = rowIndex" @mouseleave="LifeLabRowHover = null"
                        class="align-center">
                        <v-col cols="6" v-for="(field, fieldIndex) in [0, 1]" :key="fieldIndex">
                            <!-- Show + button if not selected -->
                            <div v-if="!extraRow.selectedStats[fieldIndex]">
                                <v-menu v-model="extraRow.menuOpen[fieldIndex]" offset-y
                                    :close-on-content-click="false">
                                    <template #activator="{ props }">
                                        <div v-bind="props" class="menu-container">+</div>
                                    </template>
                                    <v-card class="menu-list">
                                        <v-card-title>Add or Replace Details</v-card-title>
                                        <v-list class="px-2 menu-list-item">
                                            <v-list-item v-for="(item, index) in filteredLifeLabMenuList(extraRow)"
                                                :key="index" @click="extraRow.tempSelection[fieldIndex] = item" :class="{
                                                    'selected-menu-item': extraRow.tempSelection[fieldIndex]?.title === item.title
                                                }" class="rounded">
                                                <v-list-item-title>
                                                    <i :class="`fa-solid ${item.icon} me-2`"></i>
                                                    {{ item.title }}
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                        <v-card-actions class="justify-end">
                                            <v-btn variant="text"
                                                @click="cancelLifeLabSelection(extraRow, fieldIndex)">Cancel</v-btn>
                                            <v-btn variant="flat" class="selected-menu-item"
                                                @click="applyLifeLabSelection(extraRow, fieldIndex)">Apply</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </div>

                            <!-- Show selected item -->
                            <div v-else class="d-flex align-items-center gap-3"  @click="openLifeLabEditMenu(extraRow, fieldIndex)">
                                <div class="d-flex align-items-center justify-content-center sign-container">
                                    <i :class="`fa-solid ${extraRow.selectedStats[fieldIndex].icon} text-primary`"></i>
                                </div>
                                <div>
                                    <h6 class="m-0 selected-title">{{ extraRow.selectedStats[fieldIndex].title }}</h6>
                                    <p class="m-0 selected-total">{{ extraRow.selectedStats[fieldIndex].value }}</p>
                                </div>

                                <v-menu v-model="extraRow.menuOpen[fieldIndex]" offset-y
                                    :close-on-content-click="false">
                                    <v-card class="menu-list">
                                        <v-card-title>Edit Details menu List </v-card-title>
                                        <v-list class="px-2 menu-list-item">
                                            <v-list-item v-for="(item, index) in filteredLifeLabMenuList(extraRow)"
                                                :key="index" @click="selectLifeLabEditData(extraRow, fieldIndex, item)" :class="{
                                                    'selected-menu-item': extraRow.selectedStats[fieldIndex]?.title === item.title
                                                }" class="rounded">

                                                <v-list-item-title>
                                                    <i :class="`fa-solid ${item.icon} me-2`"></i>
                                                    {{ item.title }}
                                                </v-list-item-title>
                                            </v-list-item>
                                        </v-list>

                                        <v-card-actions class="justify-end">
                                            <v-btn variant="text"
                                                @click="cancelSelection(extraRow, fieldIndex)">Cancel</v-btn>
                                            <v-btn variant="flat"
                                                @click="applySelection(extraRow, fieldIndex)">Apply</v-btn>
                                        </v-card-actions>

                                    </v-card>
                                </v-menu>

                            </div>
                        </v-col>

                        <!-- Delete Button -->
                        <div v-if="LifeLabRowHover === rowIndex"
                            class="delete-icon d-flex align-center justify-center position-absolute">
                            <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="deleteLifeLabRow(rowIndex)"
                                color="red">
                                <i class="fa-solid fa-trash delete-list-icon"></i>
                            </v-btn>
                        </div>
                    </v-row>

                    <!-- LifeLab Customer Details -->
                    <v-row class="mt-3">
                        <v-col cols="12">
                            <div class="customer-details-container">
                                <VueDraggableNext v-model="lifeLabDetails" :animation="200">
                                    <div class="customer-details-grid" v-for="(customer, index) in lifeLabDetails"
                                        :key="index" @mouseenter="LifeLabCustomerDetailsHover = index"
                                        @mouseleave="LifeLabCustomerDetailsHover = null">
                                        <div class="detail-title">{{ customer.title }}</div>
                                        <div class="detail-value">{{ customer.value }}</div>
                                        <i v-if="LifeLabCustomerDetailsHover === index"
                                            class="fa-solid fa-trash mt-3 delete-list-icon"
                                            @click="deleteLifeLabCustomer(index)"></i>
                                    </div>
                                </VueDraggableNext>
                            </div>
                        </v-col>

                        <!-- Add Row for Customer Details -->
                        <v-col cols="12">
                            <v-menu v-model="lastLifeLabRowMenuOpen" offset-y :close-on-content-click="false">
                                <template #activator="{ props }">
                                    <div v-bind="props" class="menu-container">+</div>
                                </template>
                                <v-card class="menu-list">
                                    <v-card-title>Select Details</v-card-title>
                                    <v-list class="px-2 menu-list-item">
                                        <v-list-item v-for="(item, index) in filteredLifeLabMenuListForLastRow"
                                            :key="index" @click="toggleLastLifeLabRowSelection(item)"
                                            :class="{ 'selected-menu-item': isLifeLabSelected(item) }" class="rounded">
                                            <v-list-item-title>
                                                <i :class="`fa-solid ${item.icon} me-2`"></i>
                                                {{ item.title }}
                                            </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                    <v-card-actions class="justify-end">
                                        <v-btn variant="text" @click="cancelLastLifeLabRowSelections">Cancel</v-btn>
                                        <v-btn variant="flat" class="selected-menu-item"
                                            @click="applyLastLifeLabRowSelections">Apply</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </v-col>
                    </v-row>

                </v-tabs-window-item>


            </v-tabs-window>

        </v-card-text>
    </v-card>
</template>


<script setup>
import { ref, computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

const selectedStats = ref([null, null])
const extraRows = ref([]) // made for the make the extra row   
const editMode = ref(false)

const ashwagandhaRowHover = ref(null);
const ashwagandhaCustomerDetailsHover = ref(null)

const activeTab = ref(0)

const ashwagandhaStats = ref([
    { icon: 'fa-dollar-sign', title: 'Active', value: 'Subscription' },
    { icon: 'fa-cart-shopping', title: '0', value: 'Reactivations', editIcon: ' fa-ellipsis-vertical' },
    { icon: 'fa-dollar-sign', title: 'N/A', value: 'Campaign' },
    { icon: 'fa-cart-shopping', title: '08.01.2024', value: 'Next shipment' },
    { icon: 'fa-wallet', title: 'Status', value: 'Active' },
    { icon: 'fa-wallet', title: 'Interval', value: '4 mnd' },
    { icon: 'fa-wallet', title: 'Next shipment', value: '28.12.24' },
    { title: 'Subscription Id', value: '2344' },
    { title: 'Source', value: 'Ashwagandha.no' },
    { title: 'Purchase date', value: '24.01.2024' },
    { title: 'Type', value: 'Standard' },
    { title: 'Start Date', value: '12.12.2024' },
    { title: 'Last shipment', value: '25.09.2023' },
])

const ashwagandhaDetails = ref([
    { title: "Source", value: "Ashwagandha.no" },
    { title: "Purchase date", value: "24.01.2024" },
    { title: "Type", value: "Standard" },
    { title: "Interval", value: "4 months" },
    { title: "Start date", value: "12.12.2024" },
    { title: "Last shipment", value: "25.12.2024" },
])
 
const stats = ref(ashwagandhaStats.value.slice(0, 2))

// shows that value that is not choosen yet 
const menuList = computed(() => {
    // Collect all selected stats from stats, selectedStats, and extraRows
    const usedItems = [
        ...stats.value,
        ...selectedStats.value,
        ...extraRows.value.map(row => row.selectedStats)
    ]

    // Return items from ashwagandhaStats that are not in usedItems
    return ashwagandhaStats.value.filter(item => {
        // Check if the item is already used in any of the selected stats
        return !usedItems.some(stat => stat && stat.title === item.title)
    })
})

// Add a new row each time the button is clicked
const addNewRow = () => {
    const newRow = {
        selectedStats: [null, null],// used for store select stat select by use by default it null 
        tempSelection: [null, null],//used to temp hold the selection before comfirmed
        menuOpen: [false, false]
    }
    extraRows.value.push(newRow)
}

// Apply selection to a specific row
const applySelection = (row, index) => {
    if (row.tempSelection[index]) {
        row.selectedStats[index] = row.tempSelection[index]
        row.tempSelection[index] = null
        row.menuOpen[index] = false
    }
}

// Cancel selection for a specific row
const cancelSelection = (row, index) => {
    row.tempSelection[index] = null
    row.menuOpen[index] = false
}

//made for avoid existing items in teh menu list
const filteredMenuList = (row) => {
    const usedItems = [
        ...stats.value,
        ...selectedStats.value.filter(stat => stat !== null && stat !== undefined),
        ...extraRows.value.flatMap(r => r.selectedStats).filter(stat => stat !== null && stat !== undefined)
    ]

    return ashwagandhaStats.value.filter(item => {
        return !usedItems.some(stat => stat.title === item.title);
    });
}
// delete the extra row 
const deleteRow = (index) => {
    extraRows.value.splice(index, 1)
}

const toggleEditMode = () => {
    editMode.value = !editMode.value
}

// Delete customer detail
const deleteCustomer = (index) => {
    ashwagandhaDetails.value.splice(index, 1)
}

const openAshwagandhaEditMenu = (row, fieldIndex) => {
    row.menuOpen[fieldIndex] = true
}

const selectEditAshwagandhaData = (row , fieldIndex , item) =>{
    row.tempSelection[fieldIndex] = item
}

// code of last row ashwagandha selection
const lastRowMenuOpen = ref(false)
const rowTempSelections = ref([]) // select multiple items

const filteredMenuListForLastRow = computed(() => {
    return menuList.value.filter(item => {
        return !ashwagandhaDetails.value.some(detail => detail.title === item.title);
    });
});

// Toggle selection of items for the last row
const toggleLastRowSelection = (item) => {
    // console.log("the items is :", item)
    const index = rowTempSelections.value.findIndex(i => i.title === item.title);
    if (index > -1) {
        rowTempSelections.value.splice(index, 1); // Remove if already selected
    } else {
        rowTempSelections.value.push(item); // Add if not selected
    }
};

// Check if item is selected
const isSelected = (item) => {
    return rowTempSelections.value.some(i => i.title === item.title);
};

// Apply selected items to the customer details
const applyLastRowSelections = () => {
    rowTempSelections.value.forEach(item => {
        // Ensure that the item isn't already in customerDetails to avoid duplicates
        if (!ashwagandhaDetails.value.find(detail => detail.title === item.title)) {
            ashwagandhaDetails.value.push({ title: item.title, value: item.value });
        }
    });

    // Reset temp selections and close the menu
    rowTempSelections.value = [];
    lastRowMenuOpen.value = false;
};

// Cancel selections and reset
const cancelLastRowSelections = () => {
    rowTempSelections.value = [];
    lastRowMenuOpen.value = false;
};


// life lab sctipt code

const lifeLabStats = ref([
    { icon: 'fa-heart', title: 'Completed', value: 'Membership' },
    { icon: 'fa-truck-fast', title: '2', value: 'Deliveries', editIcon: ' fa-ellipsis-vertical' },
    { icon: 'fa-star', title: 'N/A', value: 'Feedback' },
    { icon: 'fa-calendar-days', title: '15.03.2024', value: 'Renewal date' },
    { title: "Source", value: "LifeLab.com" },
    { title: "Purchase date", value: "15.02.2024" },
    { title: "Type", value: "Premium" },
    { title: "Interval", value: "6 months" },
    { title: "Start date", value: "01.03.2024" },
    { title: "Last shipment", value: "10.04.2024" },
])

const lifeLabDetails = ref([
    { title: "Source", value: "LifeLab.com" },
    { title: "Purchase date", value: "15.02.2024" },
    { title: "Type", value: "Premium" },
    { title: "Interval", value: "6 months" },
    { title: "Start date", value: "01.03.2024" },
    { title: "Last shipment", value: "10.04.2024" },
])

const lifeLabExtraRows = ref([]);
const selectedLifeLabStats = ref([null, null]);

const LifeLabRowHover = ref(null);
const LifeLabCustomerDetailsHover = ref(null)

const lifeLabStatsList = ref(lifeLabStats.value.slice(0, 2));

const lifeLabMenuList = computed(() => {
    const usedItems = [
        ...lifeLabStatsList.value,
        ...selectedLifeLabStats.value,
        ...lifeLabExtraRows.value.map(row => row.selectedStats)
    ];

    return lifeLabStats.value.filter(item => {
        return !usedItems.some(stat => stat && stat.title === item.title)
    });
});

const addLifeLabNewRow = () => {
    const newRow = {
        selectedStats: [null, null],
        tempSelection: [null, null],
        menuOpen: [false, false]
    };
    lifeLabExtraRows.value.push(newRow);
};

const applyLifeLabSelection = (row, index) => {
    if (row.tempSelection[index]) {
        row.selectedStats[index] = row.tempSelection[index];
        row.tempSelection[index] = null;
        row.menuOpen[index] = false;
    }
};

const cancelLifeLabSelection = (row, index) => {
    row.tempSelection[index] = null;
    row.menuOpen[index] = false;
};

const filteredLifeLabMenuList = (row) => {
    const usedItems = [
        ...lifeLabStatsList.value,
        ...selectedLifeLabStats.value.filter(stat => stat !== null && stat !== undefined),
        ...lifeLabExtraRows.value.flatMap(r => r.selectedStats).filter(stat => stat !== null && stat !== undefined)
    ];

    return lifeLabStats.value.filter(item => {
        return !usedItems.some(stat => stat.title === item.title);
    });
};

const deleteLifeLabRow = (index) => {
    lifeLabExtraRows.value.splice(index, 1);
};

const openLifeLabEditMenu = (row , fieldIndex) =>{
    row.menuOpen[fieldIndex] = true
}

// select and save the edit data here 
const selectLifeLabEditData = (row , fieldIndex , item) => {
    // console.log("the console is :" , fieldIndex , item)
    row.tempSelection[fieldIndex] = item
}

const toggleLifeLabEditMode = () => {
    editMode.value = !editMode.value;
};

const deleteLifeLabCustomer = (index) => {
    lifeLabDetails.value.splice(index, 1);
};

const lastLifeLabRowMenuOpen = ref(false);

const lifeLabRowTempSelections = ref([]); // select multiple items

const filteredLifeLabMenuListForLastRow = computed(() => {
    return lifeLabMenuList.value.filter(item => {
        return !lifeLabDetails.value.some(detail => detail.title === item.title);
    });
});

const toggleLastLifeLabRowSelection = (item) => {
    const index = lifeLabRowTempSelections.value.findIndex(i => i.title === item.title);
    if (index > -1) {
        lifeLabRowTempSelections.value.splice(index, 1); // Remove if already selected
    } else {
        lifeLabRowTempSelections.value.push(item); // Add if not selected
    }
};

const isLifeLabSelected = (item) => {
    return lifeLabRowTempSelections.value.some(i => i.title === item.title);
};

const applyLastLifeLabRowSelections = () => {
    lifeLabRowTempSelections.value.forEach(item => {
        if (!lifeLabDetails.value.find(detail => detail.title === item.title)) {
            lifeLabDetails.value.push({ title: item.title, value: item.value });
        }
    });

    lifeLabRowTempSelections.value = [];
    lastLifeLabRowMenuOpen.value = false;
};

const cancelLastLifeLabRowSelections = () => {
    lifeLabRowTempSelections.value = [];
    lastLifeLabRowMenuOpen.value = false;
};
</script>


<style scoped>
.tabs-row {
    height: 85px !important;
    border-bottom: 1px solid rgba(225, 222, 245, 0.12);
}

.ashwagandha-text {
    border-bottom: 2px solid rgba(136, 198, 213, 1);
}

.sign-container {
    width: 40px;
    height: 40px;
    background: rgba(136, 198, 213, 1);
    border-radius: 6px;
}

.edit-icon {
    position: absolute;
    right: 15px;
    top: 20px;
    font-size: 20px;
    cursor: pointer;
}

.selected-title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(225, 222, 245, 0.9);
}

.selected-total {
    font-size: 14px;
    color: rgba(128, 131, 144, 1);
}

.person-name {
    color: rgba(225, 222, 245, 0.9);
    font-size: 1.125rem !important;
    font-weight: 500;
    line-height: 1.75rem;
}

.customer-details-grid {
    display: grid;
    grid-template-columns: 222px 1fr;
    border-bottom: 1px solid rgba(225, 222, 245, 0.12);
     cursor: grab;
}

.detail-title {
    font-weight: 600;
    color: rgba(225, 222, 245, 0.7);
    padding: 10px 19px;
}

.detail-value {
    color: rgba(225, 222, 245, 0.7);
    padding: 10px;
    font-size: 14px;
}

.ashwagandha-plus-icon,
.life-lab-plus-icon {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
}

.ashwagandha-plus-icon button,
.life-lab-plus-icon button {
    color: rgba(225, 222, 245, 0.9);
    background: rgba(136, 198, 213, 1);
}

.menu-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px 12px;
    border: 1px dashed rgba(225, 222, 245, 0.3);
    font-size: 20px;
    cursor: pointer;
    border-radius: 6px;
}


.menu-list-item {
    background-color: rgba(47, 51, 73, 1) !important;
    color: rgba(255, 222, 245, 0.9) !important;
}

.menu-list {
    background-color: rgba(47, 51, 73, 1) !important;
    color: rgba(255, 222, 245, 0.9) !important;
    box-shadow: 0 3px 12px rgba(19, 17, 32, 1);
    width: 300px;
}

.selected-menu-item {
    background: rgba(136, 198, 213, 1);
    color: rgba(225, 222, 245, 0.9);
}

.plus-icon {
    position: absolute;
    right: 15px;
    top: 20px;
    height: 25px;
    width: 25px;
    border-radius: 50%;
}

.plus-icon button {
    color: rgba(225, 222, 245, 0.9);
    background: rgba(136, 198, 213, 1);
}

.delete-icon {
    right: 5px;
}

.delete-list-icon {
    position: absolute;
    right: 5px;
    cursor: pointer;
}
</style>
