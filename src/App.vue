<template>
    <div id="app">
        <time-line
            ref="timeline"
            :timeBlocksProp="timeBlocks"
            @arrive-left="onArriveLeft"
            @arrive-right="onArriveRight"
        ></time-line>

        <div @click="scroll">滚动到00:00:00</div>
    </div>
</template>

<script>
import timeLine from '@/packages/timeline.vue'

export default {
    name: 'App',
    components: {
        timeLine,
    },
    data() {
        return {
            timeBlocks: [
                { startTime: '2020-08-23 07:00:00', endTime: '2020-08-23 08:00:00' },
                { startTime: '2020-08-23 11:00:00', endTime: '2020-08-23 12:00:00' },
                { startTime: '2020-08-23 15:00:00', endTime: '2020-08-23 19:30:00' },
                { startTime: '2020-08-24 11:00:00', endTime: '2020-08-24 12:00:00' },
                { startTime: '2020-08-24 07:00:00', endTime: '2020-08-24 08:00:00' },
                { startTime: '2020-08-24 15:00:00', endTime: '2020-08-24 19:30:00' },
                { startTime: '2020-08-25 08:00:00', endTime: '2020-08-25 09:00:00' },
                { startTime: '2020-08-25 11:00:00', endTime: '2020-08-25 12:00:00' },
                { startTime: '2020-08-25 15:00:00', endTime: '2020-08-25 19:30:00' },
            ],
        }
    },
    methods: {
        onArriveLeft(datetime) {
            // let timeBlocks = [
            //     { startTime: '2020-08-22 07:00:00', endTime: '2020-08-23 08:00:00' },
            //     { startTime: '2020-08-22 11:00:00', endTime: '2020-08-23 12:00:00' },
            //     { startTime: '2020-08-22 15:00:00', endTime: '2020-08-23 19:30:00' },
            // ];
            // this.timeBlocks = [...new Set([...timeBlocks, ...this.timeBlocks])];
        },
        onArriveRight(datetime) {
            // let timeBlocks = [
            //     { startTime: '2020-08-26 08:00:00', endTime: '2020-08-25 09:00:00' },
            //     { startTime: '2020-08-26 11:00:00', endTime: '2020-08-25 12:00:00' },
            //     { startTime: '2020-08-26 15:00:00', endTime: '2020-08-25 19:30:00' },
            // ];
            // this.timeBlocks = [...new Set([...this.timeBlocks, ...timeBlocks])];
        },
        scroll() {
            this.$refs.timeline.scrollTo('00:00:00')
        },
    },
}
</script>



<style>
</style>
