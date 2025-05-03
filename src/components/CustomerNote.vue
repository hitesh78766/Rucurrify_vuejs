<template>
    <v-card class="main-section">
        <v-card-title class="card-title mt-3">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-center">
                    <div
                        class="notebook-icon-container d-flex align-items-center justify-content-center text-primary me-2">
                        <i class="fa-solid fa-book"></i>
                    </div>
                    <h5 class="customer-note m-0">Customer Note</h5>
                </div>
                <div class="plus-icon d-flex align-center justify-center">
                    <v-btn icon class="pa-0 ma-0" height="100%" width="100%">
                        <i class="fa-solid fa-plus"></i>
                    </v-btn>
                </div>
            </div>
        </v-card-title>

        <v-card-text>
            <ul class="timeline">
                <li class="timeline-item mb-3 mt-3" v-for="(timeline , index) in timelineItems" :key="index">
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 class="app-timeline-title">{{timeline.title}}</h5>
                        <p class="app-timeline-meta m-0 mb-2 ">{{timeline.time}}</p>
                    </div>
                    <p class="timeline-app m-0">
                       {{ timeline.description }}
                    </p>
                </li>
            </ul>
        </v-card-text>
    </v-card>
</template>



<script setup>
import { ref } from 'vue';
// Sample data for timeline items
const timelineItems = ref([
  {
    title: 'Other',
    time: '12 min ago',
    description: 'Status updated to Unapproved return trial (NOT Paid post) | Order ID: 128523'
  },
  {
    title: 'Phone',
    time: '1 hour ago by CS',
    description: 'Status updated to Unapproved return trial (NOT Paid post) | Order ID: 129745'
  },
  {
    title: 'Other',
    time: '12 min ago by admin',
    description: 'Status updated to Unapproved return trial (NOT Paid post) | Order ID: 128523'
  },
  {
    title: 'Phone',
    time: '1 hour ago by CS',
    description: 'Status updated to Unapproved return trial (NOT Paid post) | Order ID: 129745'
  },
  {
    title: 'Other',
    time: '12 min ago by admin',
    description: 'Status updated to Unapproved return trial (NOT Paid post) | Order ID: 128523'
  }
  
])

</script>


<style scoped>
.card-title {
    border-bottom: 1px solid rgba(225, 222, 245, 0.12);
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
