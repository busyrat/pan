// @ts-nocheck

import axios from "axios";
// import process from 'process'
// const args = process.argv.slice(3)
// console.log(args);

export class BaseClient {
  constructor(maxRetries = 1) {
    this.maxRetries = maxRetries;
    this.token = null;
    this.axiosInstance = axios.create({
      timeout: 2000,
      headers: {
        "Content-Type": "application/json",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      },
    });

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      // 成功
      (config) => {
        if (this.token) {
          config.headers["Authorization"] = `Bearer ${this.token}`;
        }
        return config;
      },
      // 失败
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      // 成功
      (response) => response,
      // 失败
      async (error) => {        
        const originalRequest = error.config;        
        if (
          error.response &&
          (
            error.response.status === 401 ||
            error.response.status === 403
          ) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const token = await this.handleUnauthorized();
          
          if (token) {
            this.token = token
            originalRequest.headers["Authorization"] = `Bearer ${this.token}`;
            originalRequest.headers["X-Access-Token"] = `${this.token}`;
            return this.axiosInstance(originalRequest);
          }
          // return { data: `AuthorizationError: ${error.message}`, error }
          return { data: null }
        }
        return Promise.reject(error);
      }
    );
  }

  async request(config) {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const response = await this.axiosInstance(config);                                                        
        return response.data;
      } catch (error) {
        retries++;        
        // console.log(1323,error);
        // console.warn(`Retrying request... (${retries}/${this.maxRetries})`);
        if (retries >= this.maxRetries) {
          // console.error('Error sending request', config.url, error.message);
          // return error
        }
      }
    }
  }

  // 抽象方法，子类需要实现
  async handleUnauthorized() {
    throw new Error(
      "handleUnauthorized method must be implemented by subclass. return token"
    );
  }

  _formatTime (timestamp) {
    const timestampStr = timestamp.toString();

    let date;
    if (timestampStr.length === 13) {
      // 如果时间戳长度为13位，则包含毫秒
      date = new Date(parseInt(timestampStr, 10));
    } else if (timestampStr.length === 10) {
      // 如果时间戳长度为10位，则不包含毫秒
      date = new Date(parseInt(timestampStr, 10) * 1000);
    } else {
      throw new Error('Invalid timestamp format');
    }

    return `[${date.toISOString().slice(0, 10)}]`
  }

  _formatBytes(bytes, decimals = 0) {
    if (bytes === 0) return '0KB';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
  }
}
