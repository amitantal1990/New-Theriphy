import axios from 'axios';
import axiosRetryInterceptor from 'axios-retry-interceptor';
import { NetInfo } from 'react-native'
import { retrieveData } from './index'

const axiosInstance = axios.create();

axiosRetryInterceptor(axiosInstance, {
    maxAttempts: 3,
    waitTime: 1000,
    errorCodes: [],
});

var ApiCalling = {
    getApi: async (url, successCallback, errorCallback) => {
        const token = await retrieveData('token');
        console.log('get token value', token);
        const header = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axiosInstance.get(url, header)
            .then((response) => {
                // PrintLog("GET api Response >> ", response);
                successCallback(response);
            })
            .catch((error) => {
                errorCallback(error);
            });
    },

    postApi: async (urlStr, params, successCallback, errorCallback) => {
        const token = await retrieveData('token');
        console.log('get token value', token);
        
        const header = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axiosInstance.post(urlStr, params, header)
            .then((response) => {
               // PrintLog("POST api Response >> ", response);
                successCallback(response);
            })
            .catch((error) => {
               // PrintLog("POST api Error Response >> ", response);
                errorCallback(error);
            });
    },

    getApiWithoutHeader: async (urlStr, successCallback, errorCallback) => {
        axiosInstance.get(urlStr)
            .then((response) => {
                successCallback(response);
            })
            .catch((error) => {
                errorCallback(error);
            });
    },

    postApiWithoutHeader: async (urlStr, params, successCallback, errorCallback) => {
        axiosInstance.post(urlStr, params)
            .then((response) => {
                successCallback(response);
            })
            .catch((error) => {
                errorCallback(error);
            });
    },     
          
    checkInternetConnection: () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            // console.log('First, is ' + (isConnected ? 'online' : 'offline'));
            return isConnected ? true : false
        });
    },

};

module.exports = ApiCalling;


