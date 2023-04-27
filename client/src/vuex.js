import { Store } from "vuex";

const state = {
  user: null
};

const store = new Store({
  state,
  getters: {
    user: (state) => {
      return state.user;
    }
  },
  actions: {
    user(context, user) {
      context.commit("user", user);
    }
  },
  mutations: {
    user(state, user) {
      state.user = user;
    }
  }
});

export default store;