import { Store } from "vuex";

const state = {
  user: null,
  spaces: [],
  selectedSpace: null
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
    selectedSpace: (state) => {
      return state.selectedSpace;
    }
  },
  actions: {
    user(context, user) {
      context.commit("user", user);
    },
    spaces(context, spaces) {
      context.commit("spaces", spaces);
    },
    selectedSpace(context, selectedSpace) {
      context.commit("selectedSpace", selectedSpace);
    }
  },
  mutations: {
    user(state, user) {
      state.user = user;
    },
    spaces(state, spaces) {
      state.spaces = spaces;
    },
    selectedSpace(state, selectedSpace) {
      state.selectedSpace = selectedSpace;
    }
  }
});

export default store;