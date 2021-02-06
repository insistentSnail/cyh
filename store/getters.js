export default {
	tabList: state => state.tabList,
	currentTabIndex:state => state.currentTabIndex,
	accessToken: state => state.accessToken || uni.getStorageSync('accessToken'),
	nickName: state => state.nickName || uni.getStorageSync('nickName'),
	avatarUrl: state => state.avatarUrl || uni.getStorageSync('avatarUrl'),
	phone: state => state.phone || uni.getStorageSync('phone'),
	isAuth: state => state.isAuth || uni.getStorageSync('isAuth'),
	openId: state => state.openId || uni.getStorageSync('openId'),
	unionId: state => state.unionId || uni.getStorageSync('unionId'),
	userInfo: state => state.userInfo || uni.getStorageSync('userInfo'),
	status: state => state.status || uni.getStorageSync('status'),
	newestVersion: state => state.newestVersion || uni.getStorageSync('newestVersion'),
	trueUserInfo: state => state.trueUserInfo || JSON.parse(uni.getStorageSync('trueUserInfo'))
}