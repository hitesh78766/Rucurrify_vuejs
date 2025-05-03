<template>
    <v-tabs-items v-model="tab">
        <v-tab-item>
            <div class="table-main">
                <div class="mb-4 d-flex align-items-center justify-content-between">
                    <h5 class="billing-heading-main">Address Book</h5>
                    <v-btn type="button" class="add-address-btn text-white">Add New Adderss</v-btn>
                </div>

                <v-expansion-panels class="expansion-panel">
                    <v-expansion-panel v-for="(address, index) in addresses" :key="index">
                        <v-expansion-panel-title>
                            {{ address.title }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            {{ address.details }}
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>


            </div>


        </v-tab-item>
    </v-tabs-items>
</template>

<script setup>
import { ref } from 'vue'

const addresses = ref([
    {
        title: 'Default Address',
        details: '512 Fjord Road,Trondheim,Trøndelag, 7010, Norway',
    },
    {
        title: 'Updated by CS',
        details: 'No address set',
    },
    {
        title: 'Datafactory',
        details: '45 Bryggen,Bergen,Vestland, 5003, Norway',
    },
])


</script>

<style scoped>
.table-main {
    background: rgba(47, 51, 73, 1);
    color: rgba(225, 222, 245, 0.7);
    box-shadow: 0 3px 12px rgba(19, 17, 32, 1), 0 0 transparent, 0 0 transparent;
    border-radius: 8px;
    padding: 16px;
}

.billing-heading-main {
    color: rgba(225, 222, 245, 0.9);
    font-size: 1.125rem !important;
    font-weight: 500;
    line-height: 1.75rem;
}

.add-address-btn {
    border-radius: 4px;
    line-height: 1.125rem;
    background: rgba(136, 198, 213, 1);
    font-size: 12px;
    /* color: rgba(136, 198, 213,  1); */
}

:deep(.v-expansion-panels) {
    background-color: rgba(47, 51, 73, 1);
}

:deep(.v-expansion-panel) {
    background-color: rgba(47, 51, 73, 1);
    color: rgba(225, 222, 245, 0.7);
}
</style>