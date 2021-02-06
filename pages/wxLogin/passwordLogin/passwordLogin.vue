<template>
	<view class="yzmLogin">
		<view class="logo">
			<image src="../../../static/wxLogin/ctLogo.png" mode=""></image>
		</view>
		
		<view class="inputBox">
			<view class="input">
				<input type="number" autocomplete="off" placeholder="请输入您的手机号" v-model="form.phone"  class="uni-input" />
			</view>
			<view class="input">
				<input type="text" autocomplete="off" placeholder="请输入密码" v-model="form.password"  class="uni-input" />
				<view class="yzm" @click="toReset">
					忘记密码
				</view>
			</view>
		</view>
		
		<view class="btn" @click="login">
			登录
		</view>
		
		<view class="pasLogin" @click="toYzmLogin">
			短信验证码登录
			<text>></text>
		</view>
	</view>
</template>

<script>
	import {wxLogin} from '@/api/login.js'
	export default {
		data() {
			return {
				form:{
					phone:"",
					password:""
				}
			};
		},
		// 防止点击返回按钮 反复回退
		onBackPress(event){
			uni.redirectTo({
				url:'../yzmLogin/yzmLogin'
			});
			return true;
		},
		methods:{
			toReset(){
				uni.navigateTo({
					url:'../resetPassword/resetPassword'
				})
			},
			login(){
				wxLogin({
					"openid": this.$store.getters.openId,
					"unionid": this.$store.getters.unionId,
					"headImgUrl": this.$store.getters.avatarUrl,
					"nickName": this.$store.getters.nickName,
					"phoneNum": this.form.phone,
					"password": this.form.password,
					"type":2
				}).then(res=>{
					console.log(res,'密码登录');
					if(res.data.code==0){
						this.$store.dispatch('setAccessToken',res.data.data.token);
						this.$store.dispatch('setIsAuth',res.data.data.isAuth);
						this.$store.dispatch('setPhone',this.form.phone);
						uni.showToast({
							title:"登录成功",
							icon:"none"
						})
						setTimeout(()=>{
							this.$store.commit('switchTab',1);
						},1000)						
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			},
			toYzmLogin(){
				uni.navigateTo({
					url:'../yzmLogin/yzmLogin'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.yzmLogin{
		padding: 0 80rpx;
		overflow: hidden;
		.logo{
			margin: 220rpx auto 0;
			width: 184rpx;
			height: 184rpx;
			image{
				width: 184rpx;
				height: 184rpx;
			}
		}
		.inputBox{
			margin-top: 80rpx;
			.input{
				height: 130rpx;
				border-bottom: 1px solid #eee;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.yzm{	
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #888888;
					min-width: 150rpx;
					text-align: right;
				}
				.uni-input{
					width: 100%;
					height: 100%;			
					font-size: 15px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
			}
		}
		.btn{
			margin-top: 80rpx;
			width: 100%;
			height: 100rpx;
			background: #D71507;
			box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
			border-radius: 20rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 17px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
		}
		.tip{
			margin-top: 30rpx;
			text-align: center;
			font-size: 13px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #888888;
		}
		.pasLogin{
			position: fixed;
			text-align: center;
			bottom: 60rpx;
			left: 50%;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			transform: translateX(-50%);
			text{
				margin-left: 8rpx;
			}
		}
	}
</style>

