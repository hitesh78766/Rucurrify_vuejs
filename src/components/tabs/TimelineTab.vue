<template>
    <v-tabs-items v-model="tab">
        <v-tab-item>
            <div class="table-main" >
                <h5 class="order-placed">Customer Activity Timeline</h5>
                <ul class="timeline">
                <li class="timeline-item mb-3 mt-3" v-for="(timeline , index) in timelineItems" :key="index">
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 class="app-timeline-title">{{timeline.title}}</h5>
                        <p class="app-timeline-meta m-0 mb-2 ">{{timeline.time}}</p>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <p class="timeline-app m-0">
                       {{ timeline.description }}
                        </p>
                        <p class="app-timeline-meta m-0 mb-2 ">{{timeline.month}}</p>
                    </div>
                    
                </li>
            </ul>
        </div>
        </v-tab-item>
    </v-tabs-items>
</template>

<script setup>
import { ref } from 'vue'


const timelineItems = ref([
  {
    title: 'Failed | (Abo Exist with status Active)',
    time: '21-01-2025 ',
    description: 'Status updated to Unapproved return trial (NOT Paid post) | Order ID: 128523',
    month: '1 month ago',
  },
  {
    title: 'Active to Cancelled(E-post | Annet | Med dette sier jeg opp min avtale av leveranse av Svartsurbær+) | 26.07.2023',
    time: '27-01-2025',
    description: 'Invoices have been paid to the company',
    month: '1 month ago',
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

.order-placed {
    color: rgba(225, 222, 245, 0.9);
    font-size: 1.125rem !important;
    font-weight: 500;
    line-height: 1.75rem;
}

.notebook-icon-container {
    height: 32px;
    width: 32px;
    border-radius: 6px;
    background: rgba(136, 198, 213, 1);
}

.customer-note {
    font-size: 1.125rem !important;
    font-weight: 500;
    line-height: 1.75rem;
    color: rgba(225, 222, 245, 0.9);
}

.plus-icon {
    height: 2.25rem;
    width: 2.25rem;
    border-radius: 50%;
}

.plus-icon button {
    color: rgba(225, 222, 245, 0.9);
    background: rgba(136, 198, 213, 1);
}

.timeline {
    border-left: 1px solid hsl(0, 0%, 90%);
    position: relative;
    list-style: none;
}

.timeline .timeline-item {
    position: relative;
}

.timeline .timeline-item:after {
    position: absolute;
    display: block;
    top: 0;
}

.timeline .timeline-item:after {
    background-color: rgba(136, 198, 213, 1);
    left: -38px;
    border-radius: 50%;
    height: 11px;
    width: 11px;
    content: "";
}

.app-timeline-title {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: .025rem;
    line-height: 1.125rem;
    color: rgba(225, 222, 245, 0.9);
}

.app-timeline-meta {
    font-size: .8125rem;
    font-weight: 400;
    letter-spacing: .025rem;
    line-height: 1.125rem;
    color: rgba(225, 222, 245, 0.4);
}

.timeline-app {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.375rem;
    color: rgba(225, 222, 245, 0.7);
}

</style>