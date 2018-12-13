import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
import router from '../router';


let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;
axios.defaults.baseURL = '/api'

axios.defaults.withCredentials = true;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //发起请求时，取消掉当前正在进行的相同请求
    // console.log(config)
    if (promiseArr[config.url]) {
        promiseArr[config.url]('操作取消')
        promiseArr[config.url] = cancel
    } else {
        promiseArr[config.url] = cancel
    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.code == 412) {
        router.push("/Login")
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    // console.log(error)
    return Promise.reject(error);
});

// axios.defaults.timeout = 10000

// var instance = axios.create({ 
//     baseURL: 'https://some-domain.com/api/',
//     timeout: 1000,
//     headers: {'X-Custom-Header': 'foobar'}
//   }); 

export default {
    //get请求
    get(url, param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params: param,
                headers: { 'Token': TOKEN },
                // cancelToken: new CancelToken(function (c) {
                //     cancel = c  // 记录当前请求的取消方法
                // })
            }).then(res => {
                resolve(res)
            }).catch(function (error) {
                console.log(error);
                });
        })
    },


    //post请求
    post(url, param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                transformRequest: [
                    function (data) {
                        // 对 data 进行任意转换处理
                        // console.log(Qs.stringify(data))
                        // console.log(JSON.stringify(data))
                        return Qs.stringify(data)
                    }
                ],
                data: param,
                headers: { 'Token': TOKEN },
                cancelToken: new CancelToken(function (c) {
                    cancel = c  // 记录当前请求的取消方法
                })
            }).then(res => {
                resolve(res)
            })
        })
    },

    //post（）请求
    postJson(url, param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data: param,
                headers: { 'Token': TOKEN, 'Content-Type': 'application/json' },
                cancelToken: new CancelToken(function (c) {
                    cancel = c  // 记录当前请求的取消方法
                })
            }).then(res => {
                resolve(res)
            })
        })
    },

    postFormData(url,param) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data: param,
                headers: { 'Token': TOKEN, "Content-Type":"multipart/form-data" },
                cancelToken: new CancelToken(function (c) {
                    cancel = c  // 记录当前请求的取消方法
                })
            }).then(res => {
                resolve(res)
            })
        })
    }

}