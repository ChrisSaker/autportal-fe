import axios from 'axios';

export const PublicJsonApiCall = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'content-type' : 'application/json'
    }
  });

  export const PrivateMultipartDataApiCall = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'content-type' : 'multipart/data'
    }
  });

  export const PrivateJsonDataApiCall = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'content-type' : 'application/json'
    }
  });

  PrivateMultipartDataApiCall.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`; 
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  PrivateJsonDataApiCall.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );