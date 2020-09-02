# vueTimeline
    A component relate to video playback

## Setup vueTimeline
    import vueTimeLine from '@curry30/vue-time-line'
    Vue.use(vueTimeLine)

## Useage
    // template
    <vue-time-line
        ref="timeline"
        :timeBlocksProp="timeBlocks"
        @arrive-left="onArriveLeft"
        @arrive-right="onArriveRight"
    ></vue-time-line>
    
    // js
    data() {
        return {
            timeBlocks: [],
        }
    },
    methods: {
        /**
         * @description when child component arrive left 00:00, you need push new times to timeBlocks
         */
        onArriveLeft(datetime) {},
         /**
         * @description when child component arrive right 00:00, you need push new times to timeBlocks
         */
        onArriveRight(datetime) {},
    },
    
## Constructor options
 |key|descriptions|default|options|
 |:---|---|---|---|
 |`timeBlocksProp`|time blocks|[]|[]|
 |`scrollTo`|method:scrollTo, scrollTo current day's any time|none|none|


## License
[The MIT License](https://opensource.org/licenses/MIT)

