<template>
    <v-tabs-items v-model="tab">
        <v-tab-item>
            <v-data-table class="table-main" :headers="headers" :items="items" item-value="invoice_id" show-select>

                <template #top >
                    <div class="ps-3  w-100 d-flex justify-content-between align-items-center"  style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
                        <h5 class="order-placed">Orders placed</h5>
                        <div style="width: 300px;">
                            <v-text-field label="Search Order" placeholder="search order" type="text" outlined dense
                            class="email-input"></v-text-field >
                        </div>
                    </div>
                </template>

                <thead>
                    <tr style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
                        <td><input type="checkbox" /></td>
                        <th v-for="(header, index) in headers" :key="index" class="text-uppercase header-name">
                            {{ header.text }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                   
                    <tr v-for="(item, index) in items" :key="index"
                        style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
                        <td><input type="checkbox" /></td>
                        <td><a href="#" class="text-decoration-none invoice-id">{{ item.invoice_id }}</a></td>
                        <td>{{ item.date }}</td>
                        <td>{{ item.due }}</td>
                        <td>{{ item.subscription }}</td>
                        <td>{{ item.campaign }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ item.sum }}</td>
                        <td>{{ item.credit }}</td>
                        <td>{{ item.amount }}</td>
                        <td>{{ item.paid }}</td>
                        <td>{{ item.balance }}</td>
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
    { text: 'Invoice ID', align: 'start', key: 'invoice_id' },
    { text: 'Date', align: 'start', key: 'date' },
    { text: 'Due', align: 'start', key: 'due' },
    { text: 'Subscription', align: 'start', key: 'subscription' },
    { text: 'Campaign', align: 'start', key: 'campaign' },
    { text: 'Status', align: 'start', key: 'status' },
    { text: 'Sum', align: 'start', key: 'sum' },
    { text: 'Credit', align: 'start', key: 'credit' },
    { text: 'Amount', align: 'start', key: 'amount' },
    { text: 'Paid', align: 'start', key: 'paid' },
    { text: 'Balance', align: 'start', key: 'balance' }
]

const items = [
    {
        invoice_id: '#9042',
        date: '14-01-2024',
        due: '10-01-25',
        subscription: 'Ashwagandha standard 4 months',
        campaign: 'N/A',
        status: 'Pending',
        sum: 'Kr 1,500',
        credit: 'Kr-500',
        amount: 'Kr 1,000',
        paid: 'Kr 1,000',
        balance: 'Kr-1,000'
    },
    {
        invoice_id: '#7189',
        date: '22-06-2023',
        due: '10-01-25',
        subscription: 'N/A',
        campaign: 'Wellness Booster',
        status: 'Overdue',
        sum: 'Kr 2,000',
        credit: 'Kr 0',
        amount: 'Kr 2,000',
        paid: 'Kr 0',
        balance: 'Kr 0'
    },
    {
        invoice_id: '#8114',
        date: '02-01-2023',
        due: '10-01-25',
        subscription: 'Svartsurbær standard 4 months',
        campaign: 'N/A',
        status: 'Setteled',
        sum: 'Kr 1,300',
        credit: 'Kr-300',
        amount: 'Kr 1,000',
        paid: 'Kr 0',
        balance: 'Kr 0'
    }
]
</script>

<style scoped>
.order-placed {
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