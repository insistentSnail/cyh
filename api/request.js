import store from '../store/index.js'
import Vue from 'vue'//自定义模态框
export default function (params = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://changtian.yunduancn.com' + params.url,//正式环境
			// url:'http://cyhapi.gogotoo.net'+ params.url,//测试环境
			data: params.data,
			method:params.methods,
			header: {
				// ...params.header,
				// 'content-type':'application/json',
				'Authorization': 'Bearer '+store.getters.accessToken		
			},
			success: res => {
				if (res.code == 200) {
					resolve(res)
				}
				if (res.statusCode == 401) { 
					
					// 微信未登录未认证
					if(!store.getters.nickName){
						
						if(store.getters.status==1){
									
							// 重新微信授权
							store.dispatch('LogOut')	
							// console.log(Vue,'vue')//这个报错导致自定义模态框出不来
							// TODO: 跳转登录
							Vue.prototype.$showModal({
								title: '未登录',
								content: '您未登录，需要登录后才能查看',
								success: (res) => {
									if (res.confirm) {
										uni.reLaunch({
											url:'/pages/wxLogin/wxLogin'
										})
										
										// appStore审核用
										// uni.reLaunch({
										// 	url:'/pages/login/login'
										// })
									}
								}
							});
						}else{
							// appStore审核用
							Vue.prototype.$showModal({
								title: '未登录',
								content: '您未登录，需要登录后才能查看',
								success: (res) => {
									if (res.confirm) {
										uni.reLaunch({
											url:'/pages/testLogin/testLogin'
										})
									}
								}
							});
						}
			
					}else{
						// 微信已登录未绑定手机号码
						// 防止用户微信授权登录后不绑定手机号直接关闭了应用
						store.dispatch('LogOut2')
						// TODO: 跳转登录
						Vue.prototype.$showModal({
							title: '未绑定手机号码',
							content: '您已微信授权登录，初次使用需要绑定手机号码',
							success: (res) => {
								if (res.confirm) {
									uni.reLaunch({
										url:'/pages/wxLogin/yzmLogin/yzmLogin'
									})
								}
							}
						});
					}
					resolve(res)
				}
				resolve(res)
			},
			fail: error => {
				reject(error)
			}
		})
	})
}