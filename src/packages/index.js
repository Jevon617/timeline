import timeline from './timeline.vue'

const vueTimeline = {
    install(Vue, options) {
        Vue.component('vue-time-line', timeline)
    },
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(timeline)
}

export default vueTimeline
