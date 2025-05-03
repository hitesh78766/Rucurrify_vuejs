<template>
    <v-tabs-items v-model="tab">
        <v-tab-item>
            <v-data-table class="table-main" :headers="headers" :items="items" item-value="invoice_id" show-select>

                <template #top >
                    <div class="ps-3  w-100 d-flex justify-content-between align-items-center"  style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
                        <h5 class="action-log-history mb-4 mt-3">Action Log History</h5>
                    </div>
                </template>

                <thead>
                    <tr style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
                        <th v-for="(header, index) in headers" :key="index" class="text-uppercase header-name">
                            {{ header.text }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items" :key="index"
                        style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
                        <td>{{ item.s_no }}</td>
                        <td>{{ item.action }}</td>
                        <td>{{ item.trigger }}</td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.upadateBy }}</td>
                        
                    </tr>
                </tbody>
            </v-data-table>
        </v-tab-item>
    </v-tabs-items>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref(0)

const headers = [
    { text: 'S No.', align: 'start', key: 's_no' },
    { text: 'Action', align: 'start', key: 'action' },
    { text: 'Trigger', align: 'start', key: 'trigger' },
    { text: 'Date', align: 'start', key: 'date' },
    { text: 'Updated By', align: 'start', key: 'upadate_by' },
    
]

const items = [
    {
        s_no: 1,
        action: '	Marketing Reservation',
        trigger: 'Unreserved: - EMAIL Comment - Custumer reserved updated from existsing before Block:loss/kreditt',
        date: '11.03.2025 08:04:04',
        upadateBy: 'Admin'
    },
    {
        s_no: 2,
        action: '	Normal',
        trigger: 'Block: Loss to Reactivate',
        date: '	11.03.2025 08:03:33',
        upadateBy: 'Admin'
    },
    {
        s_no: 3,
        action: 'Marketing Reservation',
        trigger: 'Reserved: - SMS - EMAIL - TM - DM Comment - Custumer reserved due to Block: Loss',
        date: '04.12.2024 09:41:16',
        upadateBy: 'Bot'
    },
    {
        s_no: 4,
        action: 'Sale | Customer Service',
        trigger: 'Failed | (Abo Exist with status Active)',
        date: '04.12.2024 09:40:52',
        upadateBy: 'CS'
    },
    {
        s_no: 5,
        action: 'Normal',
        trigger: 'Cancelled to Block: Loss',
        date: '26.11.2024 11:56:42',
        upadateBy: 'Customer'
    },
]

</script>

<style scoped>
.action-log-history {
    color: rgba(225, 222, 245, 0.9);
    font-size: 1.125rem !important;
    font-weight: 500;
    line-height: 1.75rem;
}

.table-main {
    background: rgba(47, 51, 73, 1);
    color: rgba(225, 222, 245, 0.7);
    box-shadow: 0 3px 12px rgba(19, 17, 32, 1), 0 0 transparent, 0 0 transparent;
    border-radius: 8px;
    padding: 16px;
}

.header-name {
    color: rgba(225, 222, 245, 0.9);
    font-size: 13px;
    letter-spacing: 0.2px;
}

.invoice-id {
    color: rgba(136, 198, 213, 1);
}

.v-data-table th {
    text-align: left;
}
</style>