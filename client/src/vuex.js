import { Store } from "vuex";

const state = {
  user: null,
  spaces: [],
  categories: [],
};

const store = new Store({
  state,
  getters: {
    user: (state) => {
      return state.user;
    },
    spaces: (state) => {
      return state.spaces;
    },
    categories: (state) => {
      return state.categories;
    }
  },
  actions: {
    user(context, user) {
      context.commit("user", user);
    },
    spaces(context, spaces) {
      context.commit("spaces", spaces);
    },
    categories(context, categories) {
      context.commit("categories", categories);
    }
  },
  mutations: {
    user(state, user) {
      state.user = user;
    },
    spaces(state, spaces) {
      state.spaces = spaces;
    },
    categories(state, categories) {
      state.categories = categories;
    }
  }
});

export default store;