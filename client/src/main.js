"use strict";

import Vue from 'vue'
import App from './App.vue'
import store from "./store/store"
import SVGIcon from "./components/SVGIcon"

Vue.component('SVGIcon', SVGIcon);

Vue.config.productionTip = false



new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')
