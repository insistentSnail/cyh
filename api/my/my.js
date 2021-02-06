import request from '../request.js'
/**
 * 首页
 */
// 用户信息
export const 
getUserInfo= params => request({ url: '/api/ClientUser/GetMyInfo', methods: 'GET' , data: params });
// 获取基础卡信息
export const 
getBaseCardNum= params => request({ url: '/api/ClientUser/GetBaseCardNum', methods: 'GET' , data: params });
// 获取会员卡详情
export const 
getCardDetail= params => request({ url: '/api/ClientUser/GetCardDetail', methods: 'POST' , data: params });
// 获取我的卡券
export const 
getMyCouponList= params => request({ url: '/api/ClientUser/GetMyCouponList', methods: 'GET' , data: params });
// 卡券详情
export const 
getMyCouponDetail= params => request({ url: '/api/ClientUser/GetMyCouponDetail', methods: 'GET' , data: params });

// 是否有消息未读
export const
Inquire = () => request({ url: '/api/Notification/Inquire', methods: 'GET' })

// 消息列表
export const
getNotifiList = params => request({ url: '/api/Notification/GetNotifiList', methods: 'GET', data: params })

// 消息详情
export const
getNotifiDetail = params => request({ url: '/api/Notification/GetNotifiDetail', methods: 'GET', data: params })

// 修改手机号验证码
export const
sendChangePhoneCaptcha = params=> request({ url: '/api/ClientUser/SendChangePhoneCaptcha', methods: 'POST', data: params })

// 提交修改手机号
export const
changePhone = params => request({ url: '/api/ClientUser/ChangePhone', methods: 'POST', data: params })

// 提交反馈
export const
commitFeedback = params => request({ url: '/api/CustomerService/CommitFeedback', methods: 'POST', data: params })

// 用户协议
export const
getUserContent = () => request({ url: '/api/Config/GetUserContent', methods: 'GET' })

// 隐私协议
export const
getRuleContent = () => request({ url: '/api/Config/GetRuleContent', methods: 'GET' })

// 七牛云token
export const
getQiNiuUploadToken = () => request({ url: '/api/Profile/GetQiNiuUploadToken', methods: 'GET' })


// 我的订单列表
export const
getOrderLists = params => request({ url: '/api/ClientUser/GetOrderCommodityList', methods: 'GET',data: params })

// 我的订单详情
export const
getOrderInfo = params => request({ url: '/api/ClientUser/GetOrderCommodityDetail', methods: 'GET',data: params })

// 使用商品id换取卡券id
export const
replaceId = params => request({ url: '/api/ClientUser/GetCouponIdByCommodityOrderId', methods: 'GET',data: params })

// 福票饭票规则
export const
getCardRule = params => request({ url: '/api/Config/GetCardRule', methods: 'GET',data: params })
// 钱包总余额
export const
getTotalCardBalance = params => request({ url: '/api/ClientUser/GetTotalCardBalance', methods: 'GET',data: params })
// 会员卡详情筛选条件
export const
getCardDetailMenu = params => request({ url: '/api/ClientUser/GetCardDetailMenu', methods: 'GET',data: params })
