import axios from 'axios';
import {getHeadersWithToken} from '../utils/getHeadersWithToken';
// const API_BASE_URL = " https://1cb9-103-211-190-130.ngrok-free.app"; 
// const API_BASE_URL = "http://192.168.238.96:8080" 
// const API_BASE_URL =  "https://b5b1-2409-40c2-2a-d6ea-601c-5234-a2d2-9366.ngrok-free.app"
// const API_BASE_URL = "https://dbb3-2409-40c2-1019-286-b9a8-7ff2-379c-97c8.ngrok-free.app"
const API_BASE_URL = "https://3573-103-121-153-151.ngrok-free.app"
import StorageUtils from '../utils/storage_utils';

const apiClient = axios.create({
    baseURL: API_BASE_URL,  // Replace with your API base URL
});

// Common API call function 
export const apiCall = async <T>(url: string, method: string, data?: any,customHeaders?: any): Promise<T> => {
    try {
      const isAuthRoute = url.includes("signIn") || url.includes("signUp");
      let token = await StorageUtils.getAPIToken();
     
      let headers: any = {
        "Content-Type": "application/json",
      };

      if (customHeaders?.["x-fcm-token"]) {
        headers = {
          ...headers,
          ...customHeaders, // Merge custom headers into the default headers
        };
      }

      if (!isAuthRoute) {
        headers = {
          ...headers,
          "x-auth-token" : token, // Get headers with token for all other requests
        };
      }

      
      const response = await apiClient({
        url,
        method,
        data,
        headers,  // Ensure headers are included here
      });

      
      return response.data;
      
    } catch (error) {
      console.log("Error is", error.message)
      throw new Error(error?.response?.data?.message || 'Something went wrong');
    }
};

export default apiClient;
