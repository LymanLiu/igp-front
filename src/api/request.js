/*Created By Jsir on 2018/4/25*/
'use strict'
import axios from 'axios'
import {
    Loading,
    Message
} from 'element-ui';

const service = axios.create({
    baseURL: '/api/cms/v1'
})

let loadingDialog = null;
service.interceptors.request.use(config => {
    loadingDialog = Loading.service({
        fullscreen: true,
        text: '数据加载中',
        background: 'rgba(255,255,255,0.4)'
    }); 

    const token = sessionStorage.getItem('ACCESS_TOKEN')
    config.headers['cache-control'] = 'no-cache, no-store, must-revalidate'
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    if (token) {
        config.headers['access-token'] = `Bearer ${token}`
    } else {

    }
    return config
}, error => {
    loadingDialog.close();
    console.log(error) // for debug
    Promise.reject(error)
})

service.interceptors.response.use(
    response => {
        loadingDialog.close();
        return response;
    },
    error => {
        loadingDialog.close();
        console.log('err' + error)
        return Promise.reject(error)
    })

export default service;