import { Store } from "vuex";

const state = {
  user: null,
  spaces: [],
  categories: [],
  isLogged: false
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
    },
    isLogged: (state) => {
      return state.isLogged;
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
    },
    isLogged(state, isLogged) {
      state.isLogged = isLogged;
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
    },
    isLogged(context, isLogged) {
      context.commit("isLogged", isLogged);
    }
  },
});

export default store;