<template>
    <v-card class="main-section">
        <v-card-text class="mt-3">
            <v-row>
                <v-col v-for="(item, index) in stats" :key="index" cols="6" class="d-flex align-items-center gap-3">
                    <div>
                        <div class="d-flex align-items-center justify-content-center sign-container">
                            <i :class="`fa-solid ${item.icon} text-primary`"></i>
                        </div>
                    </div>
                    <div>
                        <h6 class="m-0 selected-title">{{ item.title }}</h6>
                        <p class="m-0 selected-total">{{ item.value }}</p>
                    </div>
                </v-col>

                <div class="plus-icon d-flex align-center justify-center">
                    <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="addNewRow">
                        <i class="fa-solid fa-plus"></i>
                    </v-btn>
                </div>
            </v-row>


            <v-row v-for="(extraRow, rowIndex) in extraRows" :key="rowIndex" @mouseenter="rowHover = rowIndex"
                @mouseleave="rowHover = null" class="position-relative align-center">
                <v-col cols="6" v-for="(field, fieldIndex) in [0, 1]" :key="fieldIndex">
                    <!-- Show + button if not selected -->
                    <div v-if="!extraRow.selectedStats[fieldIndex]">
                        <v-menu v-model="extraRow.menuOpen[fieldIndex]" offset-y :close-on-content-click="false">
                            <template #activator="{ props }">
                                <div v-bind="props" class="menu-container">+</div>
                            </template>

                            <v-card class="menu-list">
                                <v-card-title>Add Detail</v-card-title>
                                <v-list class="px-2 menu-list-item">
                                    <v-list-item v-for="(item, index) in filteredMenuList(extraRow)" :key="index"
                                        @click="extraRow.tempSelection[fieldIndex] = item" :class="{
                                            'selected-menu-item': extraRow.tempSelection[fieldIndex]?.title === item.title
                                        }" class="rounded">
                                        <v-list-item-title>
                                            <i :class="`fa-solid ${item.icon} me-2`"></i>
                                            {{ item.title }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>

                                <v-card-actions class="justify-end">
                                    <v-btn variant="text" @click="cancelSelection(extraRow, fieldIndex)">Cancel</v-btn>
                                    <v-btn variant="flat" class="selected-menu-item"
                                        @click="applySelection(extraRow, fieldIndex)">
                                        Apply
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </div>

                    <!-- Show selected item -->

                    <div v-else class="d-flex align-items-center gap-3" @click="openMenu(extraRow, fieldIndex)">
                        <div class="d-flex align-items-center justify-content-center sign-container">
                            <i :class="`fa-solid ${extraRow.selectedStats[fieldIndex]?.icon} text-primary`"></i>
                        </div>
                        <div>
                            <h6 class="m-0 selected-title">{{ extraRow.selectedStats[fieldIndex]?.title }}</h6>
                            <p class="m-0 selected-total">{{ extraRow.selectedStats[fieldIndex]?.value }}</p>
                        </div>

                        <v-menu v-model="extraRow.menuOpen[fieldIndex]" offset-y :close-on-content-click="false">
                            <v-card class="menu-list">
                                <v-card-title>Edit Details menu List </v-card-title>
                                <v-list class="px-2 menu-list-item">
                                    <v-list-item v-for="(item, index) in filteredMenuList(extraRow)" :key="index"
                                        @click="selectEditData(extraRow, fieldIndex, item)" :class="{
                                            'selected-menu-item': extraRow.selectedStats[fieldIndex]?.title === item.title
                                        }" class="rounded">

                                        <v-list-item-title>
                                            <i :class="`fa-solid ${item.icon} me-2`"></i>
                                            {{ item.title }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>

                                <v-card-actions class="justify-end">
                                    <v-btn variant="text" @click="cancelSelection(extraRow, fieldIndex)">Cancel</v-btn>
                                    <v-btn variant="flat" @click="applySelection(extraRow, fieldIndex)">Apply</v-btn>
                                </v-card-actions>

                            </v-card>
                        </v-menu>

                    </div>
                </v-col>

                <!-- Delete Button -->
                <div v-if="rowHover === rowIndex"
                    class="delete-icon d-flex align-center justify-center position-absolute">
                    <v-btn icon class="pa-0 ma-0" height="100%" width="100%" @click="deleteRow(rowIndex)" color="red">
                        <i class="fa-solid fa-trash delete-list-icon"></i>
                    </v-btn>
                </div>
            </v-row>

            <div class="d-flex align-items-center justify-content-between mt-4">
                <h5 class="person-name m-0">Daniel P-Johansen</h5>
                <!-- <i class="fa-solid fa-pen-to-square" @click="toggleEditMode"></i> -->
            </div>

            <v-row class="mt-3">
                <v-col cols="12">
                    <div class="customer-details-container">
                        <VueDraggableNext v-model="customerDetails" item-key="title" :animation="200">
                            <div class="customer-details-grid" v-for="(customer, index) in customerDetails" :key="index"
                                @mouseenter="rowHoverCustomerDetails = index"
                                @mouseleave="rowHoverCustomerDetails = null">
                                <div class="detail-title">{{ customer.title }}</div>
                                <div class="detail-value">{{ customer.value }}</div>
                                <i v-if="rowHoverCustomerDetails === index"
                                    class="fa-solid fa-trash mt-3 delete-list-icon" @click="deleteCustomer(index)"></i>
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
                                <v-btn variant="flat" class="selected-menu-item" @click="applyLastRowSelections">
                                    Apply
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>

                </v-col>
            </v-row>


        </v-card-text>
    </v-card>
</template>


<script setup>
import { ref, computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'


const selectedStats = ref([null, null])
const extraRows = ref([]) // made for the make the extra row   
const editMode = ref(false)

const rowHover = ref(null);
const rowHoverCustomerDetails = ref(null)



const dataList = ref([
    { icon: 'fa-wallet', title: 'Account Balance', value: '9800 NOK' },
    { icon: 'fa-cart-shopping', title: 'Total Orders', value: '1200 NOK' },
    { icon: 'fa-money-bills', title: 'Total Revenue', value: '800 NOK' },
    { icon: 'fa-credit-card', title: 'Pending Payments', value: '900 NOK' },
    { icon: 'fa-arrows-rotate', title: 'Refunds Processed', value: '700 NOK' },
    { icon: 'fa-user', title: 'Active Subscription', value: '1500 NOK' },
    { icon: 'fa-phone', title: 'Phone', value: '2000 NOK' },
    { icon: 'fa-envelope', title: 'Email', value: '300 NOK' },
    { icon: 'fa-address-book', title: 'Address', value: '800 NOK' }
])

const stats = ref(dataList.value.slice(0, 2))

// shows that value that is not choosen yet 
const menuList = computed(() => {
    // Collect all selected stats from stats, selectedStats, and extraRows
    const usedItems = [
        ...stats.value,
        ...selectedStats.value,
        ...extraRows.value.map(row => row.selectedStats)
    ]

    // Return items from dataList that are not in usedItems
    return dataList.value.filter(item => {
        // Check if the item is already used in any of the selected stats
        return !usedItems.some(stat => stat && stat.title === item.title)
    })
})


// Add a new row each time the button is clicked
const addNewRow = () => {
    const newRow = {
        selectedStats: [null, null],// used for store select stat select by use by default it null 
        tempSelection: [null, null], //used to temp hold the selection before comfirmed
        menuOpen: [false, false]
    }
    extraRows.value.push(newRow)
}

// open the menu for the specific field when we edit the item 
const openMenu = (row, fieldIndex) => {
    row.menuOpen[fieldIndex] = true
}

// select and save the edit data here 
const selectEditData = (row, fieldIndex, item) => {
    // console.log("the console is :" , fieldIndex , item)
    row.tempSelection[fieldIndex] = item
}

// Apply selection to a specific row
const applySelection = (row, fieldIndex) => {
    if (row.tempSelection[fieldIndex]) {
        row.selectedStats[fieldIndex] = row.tempSelection[fieldIndex]; // Apply the selection
        row.tempSelection[fieldIndex] = null; // Clear temporary selection
    }
    // Close the menu after applying selection
    row.menuOpen[fieldIndex] = false;
}


// Cancel selection for a specific row
const cancelSelection = (row, fieldIndex) => {
    row.tempSelection[fieldIndex] = null; // Reset temporary selection
    row.menuOpen[fieldIndex] = false; // Close the menu
}

//made for avoid existing items in teh menu list
const filteredMenuList = (row) => {
    const usedItems = [
        ...stats.value,
        ...selectedStats.value,
        ...extraRows.value.flatMap(r => r.selectedStats)
    ];

    return dataList.value.filter(item => {
        return !usedItems.some(stat => stat && stat.title === item.title);
    });
}


// delete the extra row 
const deleteRow = (index) => {
    extraRows.value.splice(index, 1)
}
const customerDetails = ref([
    { title: 'Phone', value: '83838382' },
    { title: 'Email', value: 'Danielpjohansen92@gmail.com' },
    { title: 'Address', value: 'Bekkeveien 161, 3173, Bergen' },
    { title: 'Gender', value: 'Male' },
    { title: 'Date of birth', value: '14.08.1992' },
    { title: 'Market value', value: '89' }
])

const lastRowMenuOpen = ref(false)
const rowTempSelections = ref([]) // select multiple items

const filteredMenuListForLastRow = computed(() => {
    return menuList.value.filter(item => {
        return !customerDetails.value.some(detail => detail.title === item.title);
    });
});

// Toggle selection of items for the last row
const toggleLastRowSelection = (item) => {
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
        if (!customerDetails.value.find(detail => detail.title === item.title)) {
            customerDetails.value.push({ title: item.title, value: item.value });
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


const toggleEditMode = () => {
    editMode.value = !editMode.value
}

// Delete customer detail
const deleteCustomer = (index) => {
    customerDetails.value.splice(index, 1)
}

</script>



<style scoped>
.sign-container {
    width: 40px;
    height: 40px;
    background: rgba(136, 198, 213, 1);
    border-radius: 6px;
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
    background: rgba(136, 198, 213, 1) !important;
    color: rgba(225, 222, 245, 0.9) !important;
}

.plus-icon {
    position: absolute;
    right: 15px;
    top: px;
    height: 25px;
    width: 25px;
    border-radius: 50%;
}

.plus-icon button {
    color: rgba(225, 222, 245, 0.9);
    background: rgba(136, 198, 213, 1);
}

.delete-icon {
    right: 0px;
}

.delete-list-icon {
    position: absolute;
    right: 5px;
    cursor: pointer;
}
</style>
