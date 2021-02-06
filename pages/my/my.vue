<template>
	<view class="myBox">
		<view class="top">
			<view style="padding: 0 30rpx 0 32rpx;" class="settings">
				<image src="@/static/my/my6.png" style="width: 40rpx; height: 40rpx;" @click="toSetting"></image>
				<image v-if="!hasMessage" src="@/static/my/my7.png" style="width: 42rpx; height: 38rpx;" @click="handleMessage"></image>
				<image v-else src="@/static/my/yxx.png" style="width: 46rpx; height: 42rpx;" @click="handleMessage"></image>
			</view>
			<view style="margin-top: 54rpx;" class="message">
				<view class="photo">
					<image :src="$store.getters.avatarUrl?$store.getters.avatarUrl:'../../static/my/photo.png'" style="width: 140rpx; height: 140rpx; border-radius: 50%;"></image>
				</view>
				<view style="margin-left: 30rpx; margin-top: 20rpx;" v-if="($store.getters.nickName||$store.getters.phone)">
					<view style="display: flex; align-items: center;">
						<view style="font-size: 48rpx; color: #fff; height: 66rpx; line-height: 66rpx;">{{$store.getters.nickName||$store.getters.phone}}</view>
						<view class="rank" v-if="$store.getters.isAuth">尊享会员</view>
					</view>
					<view v-if="$store.getters.isAuth"
					 style="margin-top: 12rpx; font-size: 26rpx; color: #fff; opacity: 0.8; height: 36rpx; line-height: 36rpx;">江西长天集团有限公司</view>
				</view>
				<view class="login" @click="toWxLogin" v-else>
					点击登录/注册
				</view>
			</view>
		</view>
		
	<!-- 	<view class="money">
			<view class="fan" @click="toFanTicket">
				<view style="font-size: 22rpx; color: #333;"><text class="num">{{fan.balanceStr?fan.balanceStr:0}}</text>
					<text>元</text>
				</view>
				<view class="card">我的饭票</view>
			</view>
			<view class="fu" @click="toFuTicket">
				<view style="font-size: 22rpx; color: #333;"><text class="num">{{fu.balanceStr?fu.balanceStr:0}}</text>
					<text>元</text>
				</view>
				<view class="card">我的福票</view>
			</view>
		</view> -->
		
	<!-- 	<view class="blank"></view> -->
		<view class="main">
			<view class="info" @click="intoMyWallet">
				<view class="info-l">
					<image src="@/static/my/myWallet.png" class="info-img"></image>
					<view class="info-text">我的钱包</view>
				</view>
				<view class="info-r">
					<text>¥ {{total}}</text>
					<image src="../../static/my/toright.png" mode=""></image>
				</view>
			</view>
			<!-- 已认证 -->
			<view class="info" v-if="$store.getters.isAuth">
				<view class="info-l">
					<image src="@/static/my/vip.png" class="info-img"></image>
					<view class="info-text">会员认证</view>
				</view>
				<view class="info-r">
					<text>已认证</text>
					<image src="../../static/my/toright.png" mode=""></image>
				</view>
			</view>
			<!-- 未认证 -->
			<view class="info" @click="toLogin" v-else>
				<view class="info-l">
					<image src="@/static/my/vip.png" class="info-img"></image>
					<view class="info-text">会员认证</view>
				</view>
				<view class="info-r">
					<text>未认证</text>
					<image src="../../static/my/toright.png" mode=""></image>
				</view>
			</view>
			<view class="info" @click="intoMyOrder">
				<view class="info-l">
					<image src="@/static/my/my4.png" class="info-img"></image>
					<view class="info-text">我的订单</view>
				</view>
				<view class="info-r">
					<image src="../../static/my/toright.png" mode=""></image>
				</view>
			</view>
			<view class="info" @click="intoMyCard">
				<view class="info-l">
					<image src="@/static/my/my8.png" class="info-img"></image>
					<view class="info-text">我的卡券</view>
				</view>
				<view class="info-r">
					<image src="../../static/my/toright.png" mode=""></image>
				</view>
			</view>
			<view class="info" @click="handleFeedback">
				<view class="info-l">
					<image src="@/static/my/my1.png" class="info-img"></image>
					<view class="info-text">意见反馈</view>
				</view>	
				<view class="info-r">
					<image src="../../static/my/toright.png" mode=""></image>
				</view>
			</view>
			<view class="info" @click="aboutUs">
				<view class="info-l">
					<image src="@/static/my/my3.png" class="info-img"></image>
					<view class="info-text">关于我们</view>
				</view>	
				<view class="info-r">
					<image src="../../static/my/toright.png" mode=""></image>
				</view>
			</view>
		</view>
		<tab-bar></tab-bar>
		<!-- 安卓和苹果用原生的模态框样式不一致 -->
		<show-modal></show-modal>
	</view>
</template>

<script>
	import {getVersionStatus} from '@/api/home/home.js'
	import {getUserInfo,getBaseCardNum, Inquire,getTotalCardBalance} from '@/api/my/my.js'
	export default {
		data() {
			return {
				// userInfo:{
				// 	headImgUrl:""
				// }
				// fan:{
				// 	balanceStr:0
				// },
				// fu:{
				// 	balanceStr:0
				// },
				total:'0.00',
				hasMessage: false,
				status:null
			}
		},
		onLoad() {	
			console.log(this.$store.getters.isAuth,'$store.getters.isAuth',this.$store.getters.nickName,'--',this.$store.getters.phone)
			getVersionStatus({
				version:plus.runtime.version,
				platform:uni.getSystemInfoSync().platform,
				channel:plus.runtime.channel
			}).then(res=>{
				console.log(res.data.data.status);
				this.status = res.data.data.status;//版本号 0是给appStore审核，1是上线版本
				// 防止用户微信授权登录后不绑定手机号直接关闭了应用
				this.$store.dispatch('setStatus',res.data.data.status)
					getUserInfo().then(res=>{
						console.log(res,'用户信息');
						if(res.statusCode==401){
							
						}else{
								
							this.$store.dispatch('trueInfo',res.data.data);	
					console.log('我到我的页面了',this.$store.getters.accessToken,this.$store.getters.userInfo,this.$store.getters.trueUserInfo);
							// 饭票福票
							// getBaseCardNum().then(res=>{
							// 	// console.log(res,5555555)
							// 	this.fan = res.data.data[0];
							// 	this.fu = res.data.data[1];
							// })
							getTotalCardBalance().then(res=>{
								console.log(res,'钱包总额');
								this.total = res.data.data;
							})
							// 消息通知
							Inquire().then(res => {
								if (res.data.code === 0) {
									console.log(res.data.data,'消息通知');
									this.hasMessage = res.data.data.needRead
								}
							})
						}			
						// this.userInfo = res.data.data;
					})

			})
			// this.$store.dispatch('setAccessToken','123');//测试用:退出登录清除token

		
		},
		methods: {
			handleFeedback () {
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url: '/pages/feedback/feedback'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}
			},
			handleMessage () {
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url: '/pages/my/messages'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}
			},
			// 跳转会员认证页面
			toLogin(){
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url:'/pages/login/login'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}
			},
			// 微信登录页
			toWxLogin(){
				if(this.status == 1){
					uni.navigateTo({
						url:'/pages/wxLogin/wxLogin'
					})
				}else{
					// appStore审核用
					uni.navigateTo({
						url:'/pages/testLogin/testLogin'
					})
				}	
			},
			// 跳转我的饭票明细
			// toFanTicket(){
			// 	if(this.$store.getters.accessToken){
			// 		uni.navigateTo({
			// 			url:'/pages/fanTicket/fanTicket'
			// 		})
			// 	}else{
			// 		uni.showToast({
			// 			title:"请先登录",
			// 			icon:"none"
			// 		})
			// 	}		
			// },
			// 跳转我的福票明细
			// toFuTicket(){
			// 	if(this.$store.getters.accessToken){
			// 		uni.navigateTo({
			// 			url:'/pages/fuTicket/fuTicket'
			// 		})	
			// 	}else{
			// 		uni.showToast({
			// 			title:"请先登录",
			// 			icon:"none"
			// 		})
			// 	}		
			// },
			// 跳转我的钱包
			intoMyWallet(){
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url:'./myWallet/myWallet'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}	
			},
			// 跳转我的设置页面
			toSetting(){
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url:'/pages/my/setting'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}	
			},
			// 跳转我的卡券
			intoMyCard(){
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url:'/pages/myCards/myCards'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}		
			},
			// 跳转我的订单
			intoMyOrder(){
				if(this.$store.getters.accessToken){
					uni.navigateTo({
						url:'/pages/my/myOrder/myOrder'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}		
			},
			// 跳转关于我们
			aboutUs(){
				// if(this.$store.getters.accessToken){
					uni.navigateTo({
						url:'/pages/my/aboutUs/aboutUs'
					})
				// }else{
				// 	uni.showToast({
				// 		title:"请先认证",
				// 		icon:"none"
				// 	})
				// }
			}
		}
	}
</script>

<style lang="scss" scoped>
.myBox{
	overflow: hidden;
}
.main {
	margin-top: 424rpx;
	padding: 0 30rpx 240rpx;
	
	.info {
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #eee;
		padding: 42rpx 0 32rpx 0;
		justify-content: space-between;
		.info-l{
			display: flex;
			align-items: center;
			image{
				width: 46rpx;
				height: 46rpx;
			}
			.info-img {
				width: 46rpx;
				height: 46rpx;
			}
			
			.info-text {
				margin-left: 28rpx;
				color: #333;
				font-size: 30rpx;
				font-weight: 500;
			}
		}
		.info-r{
			display: flex;
			align-items: center;
			image{
				width: 40rpx;
				height: 40rpx;
			}
			text{		
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				margin-right:5rpx;
			}
		}
	}
}
.blank {
	width: 100%;
	height: 16rpx;
	background: #F6F6F6;
}
.money {
	margin-top: 424rpx;
	display: flex;
	padding-top: 60rpx;
	padding-bottom: 48rpx;
	height: 108rpx;
	width: 100%;
	.card {
		color: #8B8B8B;
		font-size: 26rpx;
	}
	
	.num {
		font-size: 56rpx;
		color: #333;
		font-weight: bold;
	}
	
	.fan {
		width: 50%;
		text-align: center;
	}
	
	.fu {
		width: 50%;
		text-align: center;
	}
}
.top {
	position: fixed;
	top: 0;
	width: 100%;
	height: 424rpx;
	background-color: #D71507;
	// border-radius: 0 0 50% 50% / 0 0 50rpx 50rpx;
	padding-top: 110rpx;
	box-sizing: border-box;
	z-index: 999;
	
	.message {
		display: flex;
		.login{	
			display: flex;
			align-items: center;
			margin-left: 30rpx;
			font-size: 24px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
		}
		.rank {
			width: 160rpx;
			height: 44rpx;
			background: url('@/static/my/my5_03.png') no-repeat 0 / 100% 100%;
			line-height: 44rpx;
			color: #A90B00;
			font-size: 24rpx;
			text-align: right;
			padding-right: 12rpx;
			box-sizing: border-box;
			margin-left: 24rpx;
		}
	}
	
	.photo {
		width: 160rpx;
		height: 160rpx;
		padding: 10rpx;
		background-color: #fff;
		box-sizing: border-box;
		border-radius: 50%;
		margin-left: 30rpx;
	}
	
	.settings {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
