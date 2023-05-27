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


const getChartsData = (spaceId, fromDate, toDate) => {
  const params = { spaceId };

  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  return axios.get("/api/charts", { params });
}

const logout = () => {
  return axios.post("/api/auth/logout");
};

const login = async (email, password) => {
  const { data } = await axios.post("/api/auth/signin", { email, password });
  return data;
};

const getCurrentUser = () => {
  return axios.get("/api/auth/currentUser");
};

const getSpaces = async () => {
  const { data } = await axios.get("/api/spaces");
  return data.value;
};

const getCategories = async () => {
  const { data } = await axios.get("/api/categories");
  return data.value;
};

// non prende 0 come valore di amount e amount2
const getTransactions = async (page = 0, pageSize = 10, filters = {}, sortColumn, asc) => {
  const query = {
    page,
    pageSize
  }

  Object.entries(filters).forEach(e => {
    if (e[1] && e[1] != "") {
      query[e[0]] = e[1];
    }
  });
  if (sortColumn && asc) {
    query.sortColumn = sortColumn;
    query.asc = asc;
  }

  const { data } = await axios.get("/api/transactions", {
    params: query,
  });
  return data;
};

const createTransaction = async (payload) => {
  const { data } = await axios.post("/api/transactions", payload);
  return data;
};

const deleteTransaction = async(id) => {
  await axios.delete(`/api/transactions/${id}`, id);
}

// TO DO
const updateTransaction = async(payload) => {
  const { data } = await axios.put(`/api/transactions/${payload.id}`, payload)
  return data;
}

const createSpace = async (name) => {
  const { data } = await axios.post("/api/spaces", { name });
  return data;
};

export {
  getCurrentUser,
  getSpaces,
  getCategories,
  getTransactions,
  login,
  logout,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  createSpace,
  getChartsData
};
