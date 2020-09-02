<template>
    <div class="cursor">
        <!-- current-time  start-->
        <div
            class="current-time-container"
            @click="onClickThenScroll"
            @mousemove="onMousemove"
            @mouseout="onMouseout"
        >
            <canvas
                class="hue-block-container"
                ref="hueBlockContainer"
                id="canvas"
                height="60"
            ></canvas>
            <div class="current-time">
                <span>{{ datetime }}</span>
                <div class="current-time-line"></div>
            </div>

            <div
                class="hover-time"
                v-show="showHoverTime"
                :style="{ left: hoverTimeContainerLeft + 'px' }"
            >
                <span>{{ hoverTime }}</span>
            </div>
        </div>
        <!-- current-time end-->

        <!-- timeline start -->
        <div class="timeline" ref="scroll">
            <div class="timeline-content">
                <div
                    class="timeline-block"
                    v-for="(item, index) in markPoints"
                    :style="{ width: width + 'px' }"
                    :key="index"
                >
                    <div class="line-wrapper">
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                    <div class="time-wrapper" :ref="'zero' + index">
                        <span>{{ item }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--timeline end -->
    </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import { toStandardDatetime, toStandardDate, toStandardTime, getType, toTimeStamp } from '@/utils'
const oneDayMs = 24 * 60 * 60 * 1000

export default {
    props: {
        step: {
            type: Number,
            default: 60,
        },
        initialTime: {
            type: Date | String,
            default: () => {
                return new Date()
            },
        },
        fillStyle: {
            type: String,
            default: '#3a8ee6',
        },
        timeBlocksProp: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            // time-scroll
            scroll: null,
            markPoints: [],
            datetime: '', // current time
            startX: '',
            curDate: '',
            containerWidth: 0, // container width
            scrollWidth: 0,
            pxToMs: 0,
            width: 0, // cell width
            hoverTime: '',
            showHoverTime: false,
            timer: null,
            hoverTimeContainerLeft: 0,

            // hue-block-scroll
            ctx: null,
            timeBlocks: [],
            times: [],
            hueBlockScroll: null,
            count: 0,
            count1: 0,
        }
    },
    watch: {
        initialTime: {
            handler(val) {
                console.log('123')
                this.datetime = toStandardDatetime(val)
                this.curDate = toStandardDate(val)
            },
            immediate: true,
        },
        step: {
            handler(val) {
                this.width = val * 2
            },
            immediate: true,
        },
        'timeBlocksProp.length': {
            handler(val) {
                this.timeBlocks = this.timeBlocksProp
            },
            immediate: true,
        },
    },
    created() {
        this.generateMarkPonits()
        this.calcOnePxToMs()
    },
    mounted() {
        this.initScroll()
    },
    methods: {
        /**
         * @description generate markpoints
         * @returns {String[]}
         * this.generateMarkPonits()
         * @example
         * // return ['00:00'...'00:00'...'00:00']
         */
        generateMarkPonits() {
            // 00:00, 02:00, 04:00, 06:00... 22:00, 00:00
            let res = []
            let start = '00:00'
            this.generateMarkPonit(start, res)
            this.markPoints = res
        },

        /**
         * @description generate markpoint
         * @returns {String}
         */
        generateMarkPonit(start = '00:00', res) {
            // start==='00:00' and start repeat twice then return
            let isEnd =
                res.indexOf('00:00') !== -1 &&
                res.indexOf('00:00') !== res.lastIndexOf('00:00') &&
                start === '00:00'
            if (isEnd) {
                res.push(start)
                return
            }

            res.push(start)
            let next = this.generateNext(start, this.step)
            this.generateMarkPonit(next, res)
        },

        /**
         * @description generate next markpoint
         * @returns {String}
         */
        generateNext(start, step) {
            let toIncreasedHour = Math.floor(step / 60)
            let toIncreasedMin = step % 60
            let startTimes = start.split(':')
            let startHour = Number(startTimes[0])
            let startMin = Number(startTimes[1])
            let resMin = toIncreasedMin + startMin

            // min exceed 60 then hour++
            if (resMin >= 60) {
                resMin = resMin % 60
                toIncreasedHour++
            }

            let resHour = toIncreasedHour + startHour

            // hour exceed 24 then hour = 0
            if (resHour >= 24) {
                resHour = 0
            }

            return `${String(resHour).padStart(2, 0)}:${String(resMin).padStart(2, 0)}`
        },

        /**
         * @description How many ms is 1px equals to
         * @returns {String}
         */
        calcOnePxToMs() {
            this.scrollWidth = this.markPoints.length * this.width

            // (2 day + 1 section)'s ms
            let totalMs = 2 * 24 * 60 * 60 * 1000 + this.step * 60 * 1000
            this.pxToMs = totalMs / this.scrollWidth
        },

        /**
         * @description transform datetime to position
         * @returns {String}
         */
        datetimeToPos(datetime) {
            let currentTimeStamp = toTimeStamp(datetime)

            // current day's 00:00
            let currentZeroTimeStamp = toTimeStamp(toStandardDate(currentTimeStamp) + ' 00:00:00')
            let startTimeStamp = currentZeroTimeStamp - oneDayMs - (this.step / 2) * 60 * 1000
            return -(currentTimeStamp - startTimeStamp) / this.pxToMs + this.containerWidth / 2
        },

        /**
         * @description init time Scroll
         */
        initScroll() {
            if (this.scroll) {
                this.scroll.destroy()
            }
            this.containerWidth = Number(
                getComputedStyle(this.$refs.scroll).width.replace(/px/, '')
            )

            // calc the scroll start postion
            this.startX = -(this.scrollWidth / 2 - this.containerWidth / 2)

            this.scroll = new BScroll('.timeline', {
                scrollX: true,
                startX: this.startX, // start position
                bounce: false,
                probeType: 2, // listening scroll hook
                momentum: false,
                momentumLimitTime: 0,
                momentumLimitDistance: 0,
            })
            this.scroll.on('scroll', e => {
                this.onScroll(e.x)
            })

            // scroll to the initial postion
            this.initialPos = this.datetimeToPos(this.datetime)
            this.scroll.scrollTo(this.initialPos, 0, 0)

            this.ininHueBlockScroll()
        },

        /**
         * @description listening scroll hook, when arrive at 00:00, scorll to the container middle
         */
        onScroll(x) {
            this.calcCurrentTime(x)

            // fllow the time scroll
            if (this.hueBlockScroll) this.hueBlockScroll.scrollTo(x, 0, 0)

            if (x >= -this.width / 2) {
                let exceedDis = -this.width / 2 - x
                let toScrollDis = this.startX - this.containerWidth / 2 - exceedDis
                this.scroll.scrollTo(toScrollDis, 0, 0)
                this.onArriveLeft()
            } else if (x <= -(this.scrollWidth - this.width / 2 - this.containerWidth)) {
                let exceedDis = x + (this.scrollWidth - this.width - this.containerWidth)
                let toScrollDis = this.startX + this.containerWidth / 2 + exceedDis + this.width / 2
                this.scroll.scrollTo(toScrollDis, 0, 0)
                this.onArriveRight()
            }
        },

        /**
         * @description when scrolled, calc this.curDate
         */
        calcCurrentDate(sign) {
            if (sign === 'arriveRightZero') {
                let nextDay = toStandardDate(toTimeStamp(this.curDate + ' 00:00') + oneDayMs)
                this.curDate = nextDay
            } else {
                let prevDay = toStandardDate(toTimeStamp(this.curDate + ' 00:00') - oneDayMs)
                this.curDate = prevDay
            }
        },

        /**
         * @description when scrolled, calc this.datetime
         */
        calcCurrentTime(x) {
            let distance = Math.ceil(this.startX - x)
            let zeroTimeStamp = toTimeStamp(this.curDate + ' 00:00:00')
            let curTimeStamp = distance * this.pxToMs + zeroTimeStamp
            this.datetime = toStandardDatetime(curTimeStamp)
        },

        /**
         * @description listen mouse move, show hover time
         */
        onMousemove(e) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
                this.showHoverTime = true
                this.hoverTimeContainerLeft = e.clientX <= 50 ? 50 : e.clientX
                this.hoverTime = this.calcHoverTime(e.clientX)
            }, 100)
        },

        /**
         * @description listen mouse out, hide hovertime container
         */
        onMouseout() {
            clearTimeout(this.timer)
            this.showHoverTime = false
        },

        /**
         * @description calc the hoverTime
         */
        calcHoverTime(clientX) {
            let hoverTimeContainerLeft = clientX
            let middleLineLeft = this.containerWidth / 2
            let dis = hoverTimeContainerLeft - middleLineLeft
            let disMs = dis * this.pxToMs
            return toStandardDatetime(toTimeStamp(this.datetime) + disMs)
        },

        /**
         * @description when click, scroll 30px
         */
        onClickThenScroll() {
            this.scroll.scrollBy(-30, 0, 0)
        },

        /**
         * @description parent component can use this function to scrollTo anyWhere
         * @param {String} '00:00:00'
         */
        scrollTo(time) {
            let pos = this.datetimeToPos(this.curDate + ' 00:00:00')
            this.scroll.scrollTo(pos, 0, 0)
        },

        /**
         * @description init scroll container
         */
        ininHueBlockScroll() {
            if (this.hueBlockScroll) {
                this.hueBlockScroll.destroy()
            }

            this.$refs.hueBlockContainer.style.width = this.$refs.scroll.scrollWidth + 'px'
            this.$refs.hueBlockContainer.width = this.$refs.scroll.scrollWidth

            this.hueBlockScroll = new BScroll('.current-time-container', {
                scrollX: true,
                startX: this.startX, // start position
                bounce: false,
                // probeType: 2, // listening scroll hook
                disableTouch: false,
                disableMouse: false,
                momentum: false,
                momentumLimitTime: 0,
                momentumLimitDistance: 0,
            })

            // scroll to the initial postion
            this.hueBlockScroll.scrollTo(this.initialPos, 0, 0)

            this.initCanvas()
        },

        /**
         * @description init canvas
         */
        initCanvas() {
            var canvas = document.getElementById('canvas')
            this.ctx = canvas.getContext('2d')
            this.ctx.fillStyle = this.fillStyle
            this.drawBlocks()
        },

        /**
         * @description when arrive left 00:00 or arrive right 00:00, reDrawCanvas
         */
        reDrawCanvas() {
            this.$nextTick(() => {
                this.ctx.clearRect(0, 0, this.scrollWidth, 60)
                this.drawBlocks()
            })
        },

        /**
         * @description draw time blocks in anvas
         */
        drawBlocks() {
            this.timeBlocks.forEach(item => {
                let startTimeTimeStamp = toTimeStamp(item.startTime)
                let todayTimeStamp = toTimeStamp(this.curDate + ' 00:00:00')
                let startPosTimeStamp =
                    todayTimeStamp - 24 * 60 * 60 * 1000 - (this.step / 2) * 60 * 1000
                let startPos = (startTimeTimeStamp - startPosTimeStamp) / this.pxToMs
                let length = (toTimeStamp(item.endTime) - toTimeStamp(item.startTime)) / this.pxToMs
                this.drawRect(startPos, length)
            })
        },

        /**
         * @description draw time block
         */
        drawRect(startPos, length) {
            this.ctx.fillRect(startPos, 0, length, 60)
        },

        /**
         * @description when arrive left 00:00
         */
        onArriveLeft() {
            this.calcCurrentDate('arriveLeftZero')
            this.$emit('arrive-left', this.curDate + ' 00:00:00')
            this.reDrawCanvas()
        },

        /**
         * @description when arrive right 00:00
         */
        onArriveRight() {
            this.calcCurrentDate('arriveRightZero')
            this.$emit('arrive-right', this.curDate + ' 00:00:00')
            this.reDrawCanvas()
        },
    },
}
</script>

<style scoped lang="scss">
@import '../sass/_mixin.scss';
.cursor {
    width: 100%;
    height: 120px;

    .current-time-container {
        width: 100%;
        height: 60px;
        color: white;
        text-align: center;
        position: relative;
        line-height: 60px;
        user-select: none;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;

        .hue-block-container {
            background: black;
            width: 100%;
            height: 60px;
            display: inline-block;
        }

        .current-time {
            height: 60px;
            line-height: 60px;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
        }

        .current-time-line {
            width: 0;
            height: 100%;
            border-left: 1px solid yellow;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        .hover-time {
            position: absolute;
            top: 80%;
            left: 0;
            transform: translate(-50%, -50%);
            color: white;
            width: 100px;
            text-align: center;
            font-size: 5px;
            pointer-events: none;
            height: 100%;
        }
    }

    .timeline {
        background-color: #fff;
        height: 60px;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        -moz-user-select: none; /*mozilar*/
        -webkit-user-select: none; /*webkit*/
        -ms-user-select: none; /*IE*/
        user-select: none;

        .timeline-content {
            display: inline-block;
        }

        .timeline-block {
            width: 120px;
            height: 50px;
            display: inline-block;
        }

        .line-wrapper {
            height: 15px;
            @include flex;
            .line {
                width: 50%;
                height: 100%;
                border-left: 1px solid #ccc;
            }
        }

        .time-wrapper {
            height: 35px;
            line-height: 45px;
            text-align: center;
        }
    }
}
</style>
