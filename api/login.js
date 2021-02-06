import request from './request'
/**
 * 登录 注册 退出登录
 */
// 微信登录
export const 
wxLogin = params => request({ url: '/api/ClientUser/Login', methods: 'POST' , data: params });
// 认证
export const 
login = params => request({ url: '/api/ClientUser/AuthInfo', methods: 'POST' , data: params });
//获取验证码
export const 
getCode = params => request({ url: '/api/ClientUser/GetRegisterCaptcha', methods: 'POST' , data: params });

// 记录用户登录
export const 
userLogin = params => request({ url: '/api/Index/UserLogin', methods: 'POST' , data: params });

// 测试登录
export const 
testLogin = params => request({ url: '/api/ClientUser/TestLogin', methods: 'POST' , data: params });

// 登录验证码
export const 
getLoginCaptcha = params => request({ url: '/api/ClientUser/GetLoginCaptcha', methods: 'POST' , data: params });

// 用户修改密码
export const 
changePassword = params => request({ url: '/api/ClientUser/ChangePassword', methods: 'POST' , data: params });

// 忘记密码获取验证码
export const 
getForgetResetCaptcha = params => request({ url: '/api/ClientUser/GetForgetResetCaptcha', methods: 'POST' , data: params });

// 忘记密码重置密码
export const 
forgetResetPassword = params => request({ url: '/api/ClientUser/ForgetResetPassword', methods: 'POST' , data: params });