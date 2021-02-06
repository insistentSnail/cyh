<template>
	<view class="wxLogin">
		<view class="logo">
			<image src="../../static/wxLogin/ctLogo.png" mode=""></image>
		</view>
		<view class="btn" @click="wxLogin">
			微信快捷登录
		</view>
		
		<!-- 其他方式登录 -->
		<view class="orther" @click="routerToYzmLogin">
			其他方式登录
			<text>></text>
		</view>
		
		<view class="yszc">
			<checkbox-group @change="checkboxChange">
				<checkbox :checked="isAgree" :value="isAgree"/>
			</checkbox-group>
			<text>请同意用户 <text @click="toActivityInfo" class="ableClick">《隐私政策》</text>和 <text @click="toActivityInfo2" class="ableClick">《服务协议》</text></text>
		</view>
	</view>
</template>

<script>
	import {wxLogin,userLogin} from '@/api/login.js'
	export default {
		data() {
			return {
				isAgree:false,
				arr:[]
			};
		},
		methods:{
			routerToYzmLogin(){
				uni.navigateTo({
					url:'./yzmLogin/yzmLogin'
				})
			},
			checkboxChange(e){
				this.arr = e.detail.value;//arr.length>0说明选中
			},
			toActivityInfo(){
				uni.navigateTo({
					url:'/pages/activity/activityInfo/activityInfo?url=https://changtian.yunduancn.com/about/yszc.html'
				})
			},
			toActivityInfo2(){
				uni.navigateTo({
					url:'/pages/activity/activityInfo/activityInfo?url=https://changtian.yunduancn.com/about/fwxy.html'
				})
			},
			wxLogin(){
				if(!(this.arr.length>0)){
					uni.showToast({
						title:"请勾选用户隐私协议",
						icon:"none"
					})
					return false;
				}
				uni.getProvider({
					service: 'oauth',
					success: (res)=>{
						console.log(res.provider);
						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success:(loginRes)=> {
									console.log('-------获取openid(unionid)-----',loginRes);
									// 获取用户信息
									uni.getUserInfo({
										provider: 'weixin',
										success: (infoRes)=>{
											console.log('-------获取微信用户所有-----');
											console.log(infoRes.userInfo);
											// 注意this指向
											this.$store.dispatch("setUserInfo",infoRes.userInfo);
											this.$store.dispatch("setAvatarUrl",infoRes.userInfo.avatarUrl);
											this.$store.dispatch("setNickName",infoRes.userInfo.nickName);
											this.$store.dispatch("setOpenId",infoRes.userInfo.openId);
											this.$store.dispatch("setUnionId",infoRes.userInfo.unionId);
											// this.$store.commit("SET_USER_INFO",infoRes.userInfo);
											// 后台wx登录接口
		
											
											// 记录用户登录  统计每日注册量
											userLogin({
												"openId": loginRes.authResult.openid,
												 "jsonStr": JSON.stringify(infoRes.userInfo)
											}).then(res=>{
												console.log(res,'记录用户登录');
											})
											
											wxLogin({
												"openid": loginRes.authResult.openid,
												"unionid": loginRes.authResult.unionid,
												"headImgUrl": this.$store.getters.userInfo.avatarUrl,
												"nickName": this.$store.getters.userInfo.nickName,
												"type":0
											}).then(res=>{
												console.log(res,'微信登录');
												if(res.data.code==0){
													this.$store.dispatch('setAccessToken',res.data.data.token);
													this.$store.dispatch('setIsAuth',res.data.data.isAuth);
													uni.showToast({
														title:"登录成功",
														icon:"none"
													})
													setTimeout(()=>{
														this.$store.commit('switchTab',1);
													},1000)						
												}
												if(res.data.code==-1002){
													// 没有绑定手机号码
													uni.showToast({
														title:"已授权，请绑定手机号码",
														icon:"none"
													})
													setTimeout(()=>{
														uni.redirectTo({
														    url: './yzmLogin/yzmLogin'
														});
													},1000)
												}
											})
										}
									});
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wxLogin{
		overflow: hidden;
		.logo{
			margin: 360rpx auto 0;
			width: 184rpx;
			height: 184rpx;
			image{
				width: 184rpx;
				height: 184rpx;
			}
		}
		.btn{
			margin: 104rpx auto 40rpx;
			width: 303px;
			height: 50px;
			background: #D71507;
			box-shadow: 0px 3px 8px 0px rgba(186, 121, 121, 0.4);
			border-radius: 10px;	
			font-size: 17px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.orther{
			text-align: center;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			text{
				margin-left: 6rpx;
			}
		}
		.yszc{
			position: fixed;
			bottom: 90rpx;
			width: 100%;
			justify-content: center;
			display: flex;
			align-items: center;
			text{
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #888888;
			}
			.ableClick{
				color:#0060AD;
				text-decoration: underline;
			}
		}
	}
</style>
