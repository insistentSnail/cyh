import request from '../request.js'
/**
 * 地址
 */
// 获取用户的默认地址详情
export const 
getMyDefaultAddressDetail= params => request({ url: '/api/ClientUserAddress/GetMyDefaultAddressDetail', methods: 'GET' , data: params });
// 新增地址
export const 
addAddress= params => request({ url: '/api/ClientUserAddress/AddAddress', methods: 'POST' , data: params });
//更新地址
export const 
updateAddress= params => request({ url: '/api/ClientUserAddress/UpdateAddress', methods: 'POST' , data: params });
// 删除某个地址
export const 
deleteAddress= params => request({ url: '/api/ClientUserAddress/DeleteAddress', methods: 'POST' , data: params });
// 获取某个地址详情
export const 
getAddressDetail= params => request({ url: '/api/ClientUserAddress/GetAddressDetail', methods: 'GET' , data: params });
//获取所有的用户地址
export const 
getAllAddress= params => request({ url: '/api/ClientUserAddress/GetMyAllAddressList', methods: 'GET' , data: params });
// 设置某个地址为默认地址
export const 
setDefaultAddress= params => request({ url: '/api/ClientUserAddress/SetDefaultAddress', methods: 'POST' , data: params });
