import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem("csrfToken");
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const logout = () => {
  return axios.post("/api/auth/logout");
};

const getCurrentUser = async () => {
  const { data } = await axios.get("/api/auth/currentUser");
  return data;
};

const getSpaces = async () => {
  const { data } = await axios.get("/api/spaces");
  return data.value;
};

const getCategories = async () => {
  const { data } = await axios.get("/api/categories");
  return data.value;
};

const getTransactions = async (pageSize, page, space, categoryName, search, amount, operator, amount2) => {
  const { data } = await axios.get("/api/transactions", {
    params: { pageSize, page, space, categoryName, search, amount, operator, amount2 },
  });
  return data;
};

const createTransaction = async (payload) => {
  const { data } = await axios.post("/api/transactions", payload);
  return data;
};

const createSpace = async (name) => {
  const { data } = await axios.post("/api/spaces", { name });
  return data;
};

export {
  getCurrentUser,
  getSpaces,
  getCategories,
  getTransactions,
  logout,
  createTransaction,
  createSpace,
};
