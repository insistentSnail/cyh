import request from '../request.js'
/**
 * 商城
 */
// 商城列表
export const
getShopLists= params => request({ url: '/api/Commodity/GetCommodityList', methods: 'GET' , data: params });
// 商品详情
export const
getShopInfo= params => request({ url: '/api/Commodity/GetCommodityDetail', methods: 'GET' , data: params });
// 购买卡券商品
export const
buyCoupon= params => request({ url: '/api/Commodity/BuyCommodity', methods: 'POST' , data: params });
// 获取商城列表
export const
getShopTypeLists= params => request({ url: '/api/Commodity/GetCommodityGroupList', methods: 'GET' , data: params });
// 获取商城商品列表
export const
getShopGoodsLists= params => request({ url: '/api/Commodity/GetCommodityListByGroupId', methods: 'GET' , data: params });

// 购买光汇商城商品
export const
buyGHCommodity= params => request({ url: '/api/Commodity/BuyGHCommodity', methods: 'POST' , data: params });

// 新的购物逻辑
// 创建商品支付订单
export const
createCommodityOrder= params => request({ url: '/api/Commodity/CreateCommodityOrder', methods: 'POST' , data: params });

// 使用创建订单接口给的id调用查询订单信息接口
export const
getCommodityOrderPayInfo= params => request({ url: '/api/Pay/GetCommodityOrderPayInfo', methods: 'GET' , data: params });

// 饭卡福卡支付
export const
payCommodityOrder= params => request({ url: '/api/Pay/PayCommodityOrder', methods: 'POST' , data: params });

// 支付宝支付
export const
commodityOrderAliPayAppPay= params => request({ url: '/api/Pay/CommodityOrderAliPayAppPay', methods: 'POST' , data: params });

// 取消订单
export const
closeCommodityOrder2= params => request({ url: '/api/Commodity/CloseCommodityOrder', methods: 'POST' , data: params });
// 获取购物车数据
export const
GetCart= params => request({ url: '/api/Cart/GetCart', methods: 'GET' , data: params });
// 添加进购物车
export const
LinkBasket= params => request({ url: '/api/Cart/LinkBasket', methods: 'POST' , data: params });
// 更新购物车
export const
UpdateCart= params => request({ url: '/api/Cart/UpdateCart', methods: 'POST' , data: params });

// 非包邮商品确认订单
export const
GetConfirmOrderData= params => request({ url: '/api/Commodity/GetConfirmOrderData', methods: 'POST' , data: params });

// 非包邮商品提交订单
export const
CreatePostageCommodityOrder= params => request({ url: '/api/Commodity/CreatePostageCommodityOrder', methods: 'POST' , data: params });

// 获取物流提示
export const
GetExpressTips= params => request({ url: '/api/Config/GetExpressTips', methods: 'GET' , data: params });

// 合作商户接口
export const
GetCooperativeMerchantImg= params => request({ url: '/api/Config/GetCooperativeMerchantImg', methods: 'GET' , data: params });

// 获得合作商店数据
export const
GetCooperateStore= params => request({ url: '/api/Merchant/GetCooperateStore', methods: 'GET' , data: params });