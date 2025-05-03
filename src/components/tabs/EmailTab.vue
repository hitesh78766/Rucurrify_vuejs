<template>
    <v-tabs-items v-model="tab">
        <v-tab-item>
            <v-data-table class="table-main" :headers="headers" :items="items" item-value="invoice_id" show-select>

                <template #top >
                    <div class="ps-3  w-100 d-flex justify-content-between align-items-center"  style="border-bottom: 2px solid rgba(0, 0, 0, 0.12);">
                        <h5 class="order-placed">Email Logs</h5>
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
                        <td>{{ item.id }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.alert_type }}</td>
                        <td>{{ item.send_to }}</td>
                        <td>{{ item.order_status }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ item.date }}</td>
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
  { text: 'ID', value: 'id' },
  { text: 'Type', value: 'type' },
  { text: 'Type of alert', value: 'alert_type' },
  { text: 'Send to', value: 'send_to' },
  { text: 'Order status', value: 'order_status' },
  { text: 'Status', value: 'status' },
  { text: 'Date', value: 'date' },
]


const items = [
  {
    id: '124937',
    type: 'Email',
    alert_type: 'Abo exist with status Active',
    send_to: 'premthakur@eligocs.com',
    order_status: 'Block: Loss',
    status: 'Sent',
    date: '26.11.2024'
  },
  {
    id: '124937',
    type: 'Email',
    alert_type: 'Abo exist with status Active',
    send_to: 'premthakur@eligocs.com',
    order_status: 'Block: Loss',
    status: 'Sent',
    date: '26.11.2024'
  },
  {
    id: '124937',
    type: 'Email',
    alert_type: 'Restart canceled subscription (CS)',
    send_to: 'premthakur@eligocs.com',
    order_status: 'Block: Loss',
    status: 'Sent',
    date: '11.11.2024'
  },
  {
    id: '124937',
    type: 'Email',
    alert_type: 'Resend order (No Fee)',
    send_to: 'premthakur@eligocs.com',
    order_status: 'Block: Loss',
    status: 'Sent',
    date: '	23.07.2024'
  },
  {
    id: '124937',
    type: 'Email',
    alert_type: 'Avluttet abonnement: godkjent',
    send_to: 'himani@eligocs.com',
    order_status: 'Completed',
    status: 'Sent',
    date: '	23.07.2024'
  },
  {
    id: '124937',
    type: 'Email',
    alert_type: 'REACTIVATE_CANCEL_ABO_CS',
    send_to: 'himani@eligocs.com',
    order_status: 'Completed',
    status: 'Sent',
    date: '16.07.2024'
  },
  {
    id: '124937',
    type: 'Email',
    alert_type: 'Resend order (No Fee)',
    send_to: 'himani@eligocs.com',
    order_status: 'Completed',
    status: 'Sent',
    date: '02.07.2024'
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