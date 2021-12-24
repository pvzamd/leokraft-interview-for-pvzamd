import { createStore } from 'vuex'

export default createStore({
  state: {
    page_no_url: 1,
    start_date_url: '',
    end_date_url: '',
    launch_status_url: ''
  },
  mutations: {
    store_page_no_url_fn (state, payload) {
      state.page_no_url = payload
    },
    store_start_date_url_fn (state, payload) {
      state.start_date_url = payload
    },
    store_end_date_url_fn (state, payload) {
      state.end_date_url = payload
    },
    store_launch_status_url_fn (state, payload) {
      state.launch_status_url = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
