import axios from "axios";
import router from "./router";

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

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status === 401) {
    localStorage.removeItem("csrfToken");
    router.push('/login');
  }
  return Promise.reject(error)
})

const getChartsData = (spaceId) => {
  return axios.get("/api/charts", { params: { spaceId } });
}

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

//da modificare
const getTransactions = async (pageSize, page, space, categoryName, search) => {
  const { data } = await axios.get("/api/transactions", {
    params: { pageSize, page, space, categoryName, search },
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
  getChartsData
};
