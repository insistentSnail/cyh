import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		tabList:[
			{
				title:'首页',
				path:'/pages/index/index',
				id:1,
				img:'/static/tab/home.png',
				activeImg:'/static/tab/homeActive.png'
			},
			{
				title:'商城',
				path:'/pages/shop/shop',
				id:2,
				img:'/static/tab/shop.png',
				activeImg:'/static/tab/shopActive.png'
			},
			{
				title:'会员码',
				path:'/pages/vip/vip',
				id:3,
				img:'/static/tab/vip.png',
				activeImg:'/static/tab/vip.png'
			},
			{
				title:'活动',
				path:'/pages/activity/activity',
				id:4,
				img:'/static/tab/activity.png',
				activeImg:'/static/tab/activityActive.png'
			},
			{
				title:'我的',
				path:'/pages/my/my',
				id:5,
				img:'/static/tab/my.png',
				activeImg:'/static/tab/myActive.png'
			}
		],
		currentTabIndex:1,
		accessToken: '',
		userInfo:{},
		nickName:"",
		avatarUrl:"",
		unionId:"",
		openId:"",
		countdown:300,//认证
		countdown1: 300,//修改密码
		countdown2: 60,//账号密码登录
		countdown3: 60,//忘记密码
		trueUserInfo:{},
		status:null,//判断是正式版本还是ios审核版本
		newestVersion:null,//保存app的最新版本值
		isAuth:false,//判断是否认证
		phone:null//用户的电话号码
	},
    actions: {
		// setUserInfo({ commit }, params) {
		// 	commit('SET_USER_INFO', params)
		// },
		setPhone(context,params){
			context.commit('setPhone2', params)
		},
		setIsAuth(context,params){
			context.commit('setIsAuth2', params)
		},
		setNickName(context,params){
			context.commit('setNickName2', params)
		},
		setAvatarUrl(context,params){
			context.commit('setAvatarUrl2', params)
		},
		setOpenId(context,params){
			context.commit('setOpenId2', params)
		},
		setUnionId(context,params){
			context.commit('setUnionId2', params)
		},
		setUserInfo(context, params) {
			context.commit('SET_USER_INFO', params)
		},
		setAccessToken(context, value) {
		    context.commit("SET_ACCESS_TOKEN", value);
		},
		
		setStatus(context, value) {
		    context.commit("setStatus2", value);
		},
		
		setNewestVersion(context, value){
			context.commit("setNewestVersion2", value);
		},
		// setAccessToken({ commit }, params){
		// 	commit('SET_ACCESS_TOKEN', params)
		// }
		
		// 接口401退出登录
		LogOut({ commit }) {
			commit('CLEAR_LOGIN_IFNO')
		},
		LogOut2({ commit }) {
			commit('CLEAR_LOGIN_IFNO2')
		},
		// 保存最终用户信息
		trueInfo(context, value) {
		    context.commit("setTrueInfo", value);
		},
	},
    mutations: {
		// 验证码倒计时 写在store里面是为了防止用户退出app后倒计时被清除了
		djs(state){
			if(state.countdown==0){
				state.countdown=300
			}else{
				state.countdown--
				setTimeout(()=>{
					this.commit("djs");
				},1000)
			}
		},
		djs1(state) {
			if(state.countdown1==0){
				state.countdown1=300
			}else{
				state.countdown1--
				setTimeout(()=>{
					this.commit("djs1");
				},1000)
			}
		},
		djs2(state) {
			if(state.countdown2==0){
				state.countdown2=60
			}else{
				state.countdown2--
				setTimeout(()=>{
					this.commit("djs2");
				},1000)
			}
		},
		djs3(state) {
			if(state.countdown3==0){
				state.countdown3=60
			}else{
				state.countdown3--
				setTimeout(()=>{
					this.commit("djs3");
				},1000)
			}
		},
		switchTab(state, currentTabIndex){
			state.currentTabIndex = currentTabIndex;
			console.log(getters.accessToken,'getters.accessToken')
			if(currentTabIndex==3&&getters.accessToken){
				uni.redirectTo({
					url: state.tabList[currentTabIndex-1].path
				});
			}
			if(currentTabIndex==3&&!getters.accessToken){
				uni.showToast({
					title:"请先认证",
					icon:"none"
				})
			}
			if(currentTabIndex!=3){
				uni.redirectTo({
					url: state.tabList[currentTabIndex-1].path
				});	 
			}	
		},
		// 只切换tab栏标识,不跳转页面
		switchTab2(state, currentTabIndex){
			state.currentTabIndex = currentTabIndex;
		},
		// 保存用户token
		SET_ACCESS_TOKEN(state, accessToken) {
			console.log(accessToken,'store里用户token')
			state.accessToken = accessToken
			uni.setStorageSync('accessToken', accessToken)
		},
		// 保存微信用户信息  保存对象会丢失信息
		SET_USER_INFO(state, userInfo){
			console.log(userInfo,'store里微信用户信息')
			state.userInfo = userInfo
			uni.setStorageSync('userInfo', userInfo)
		},
		// 保存电话号码 假如没经过微信授权就显示电话否则显示微信名字
		setPhone2(state,phone){
			state.phone = phone;
			uni.setStorageSync('phone', phone)
		},
		// 保存是审核还是正式发布状态
		setStatus2(state,status){
			state.status = status;
			uni.setStorageSync('status', status)
		},
		// 保存最新的app版本数值 154类似
		setNewestVersion2(state,newestVersion){
			state.newestVersion = newestVersion;
			uni.setStorageSync('newestVersion', newestVersion)
		},
		// 保存是否认证
		setIsAuth2(state,isAuth){
			state.isAuth = isAuth;
			uni.setStorageSync('isAuth', isAuth)
		},
		// 保存openId
		setOpenId2(state,openId){
			state.openId = openId;
			uni.setStorageSync('openId', openId)
		},
		// 保存unionId
		setUnionId2(state,unionId){
			state.unionId = unionId;
			uni.setStorageSync('unionId', unionId)
		},
		// 保存微信名字
		setNickName2(state,nickName){
			state.nickName = nickName
			uni.setStorageSync('nickName', nickName)
		},
		// 保存微信头像
		setAvatarUrl2(state,avatarUrl){
			state.avatarUrl = avatarUrl
			uni.setStorageSync('avatarUrl', avatarUrl)
		},
		// 保存登录后的用户信息(里面包含了微信用户的信息和认证的用户信息)
		setTrueInfo(state, trueUserInfo){
			console.log(trueUserInfo,'store里trueUserInfo')
			state.trueUserInfo = trueUserInfo
			uni.setStorageSync('trueUserInfo', JSON.stringify(trueUserInfo))
		},
		// 退出登录
		CLEAR_LOGIN_IFNO(state){
			state.accessToken = '';
			state.trueUserInfo = {};
			state.userInfo = {};
			state.avatarUrl = '';
			state.nickName = '';
			state.unionId = '';
			state.openId = '';
			state.isAuth='';//判断是否认证
			state.phone=null;//用户的电话号码
			uni.removeStorageSync('isAuth');
			uni.removeStorageSync('phone');
			uni.removeStorageSync('avatarUrl');
			uni.removeStorageSync('nickName');
			uni.removeStorageSync('unionId');
			uni.removeStorageSync('openId');
			uni.removeStorageSync('userInfo');
			uni.removeStorageSync('accessToken');
			uni.removeStorageSync('trueUserInfo');
		},
		// 微信已登录的退出登录
		CLEAR_LOGIN_IFNO2(state){
			state.accessToken = '';
			state.trueUserInfo = {};
			uni.removeStorageSync('accessToken')
			uni.removeStorageSync('trueUserInfo')
		}
	},
	getters
})
export default store