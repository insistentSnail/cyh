import request from '../request.js'
/**
 * 活动页
 */
// 手机话费充值
export const 
getActivitys= params => request({ url: '/api/Index/GetActivitys', methods: 'GET' , data: params });