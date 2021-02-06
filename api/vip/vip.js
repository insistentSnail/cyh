import request from '../request.js'
/**
 * 会员
 */
// 获取会员码
export const 
getVipCode= params => request({ url: '/api/Pay/CreatePayCode', methods: 'GET' , data: params });
// 获取消费设置页面数据
export const 
getPayCardInfo= params => request({ url: '/api/Pay/GetPayCardInfo', methods: 'GET' , data: params });
// 切换付款方式
export const 
changePayModel= params => request({ url: '/api/Pay/ChangePayModel', methods: 'POST' , data: params });
// 获取商家信息
export const 
getMerchantInfo= params => request({ url: '/api/Pay/GetMerchantInfo', methods: 'GET' , data: params });
// 向商家付款
export const 
pay= params => request({ url: '/api/Pay/Pay', methods: 'POST' , data: params });

// 测试的支付宝支付
export const 
testAppPay= params => request({ url: '/api/Commodity/TestAppPay', methods: 'GET' , data: params });

// 临时的支付宝支付
export const 
aliPayBuyCommodity= params => request({ url: '/api/Commodity/AliPayBuyCommodity', methods: 'POST' , data: params });