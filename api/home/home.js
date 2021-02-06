import request from '../request.js'
/**
 * 首页
 */
// 首页信息
export const 
getHome= params => request({ url: '/api/Index/GetData', methods: 'GET' , data: params });
// 资讯详情信息
export const 
getInformationInfo= params => request({ url: '/api/Index/GetNewsDetail', methods: 'GET' , data: params });
//检测手机号码是否能充值
export const 
phoneRechargeTest= params => request({ url: '/api/Commodity/PhoneRechargeTest', methods: 'GET' , data: params });
// 手机话费充值
export const 
phoneRecharge= params => request({ url: '/api/Commodity/PhoneRecharge', methods: 'POST' , data: params });

// 视频直冲商品分类
export const
getSPZCRechargeCommodityClass = () => request({ url: '/api/Commodity/GetSPZCRechargeCommodityClass', methods: 'GET'})

// 获取首页商城信息
export const 
getCommodityListIndex= params => request({ url: '/api/Commodity/GetCommodityListIndex', methods: 'GET' , data: params });

export const
oilRecharge = params => request({ url: '/api/Commodity/OilRecharge', methods: 'POST', data: params })

// 获取版本状态
export const
getVersionStatus = params => request({ url: '/api/Config/GetVersionStatus', methods: 'GET', data: params })

// 判断是否需要更新
export const
getNewVersion = params => request({ url: '/api/Config/GetNewVersion', methods: 'GET', data: params })

// 酒店列表
export const
getList = params => request({ url: '/api/Hotel/GetList', methods: 'GET', data: params })

// 酒店详情
export const
getDetail = params => request({ url: '/api/Hotel/GetDetail', methods: 'GET', data: params })

// 话费商品
export const
getCommodityList = params => request({ url: '/api/Commodity/GetCommodityList', methods: 'GET', data: params })