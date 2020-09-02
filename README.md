# vueTimeline

> A component relate to video playback

## Setup vueTimeline
    import vueTimeline from 'vue-timeline'

## Useage
    // template
    <vue-timeline
        ref="timeline"
        :timeBlocksProp="timeBlocks"
        @arrive-left="onArriveLeft"
        @arrive-right="onArriveRight"
    ></vue-timeline>
    
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

