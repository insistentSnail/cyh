<template>
	<view class="yzmLogin">
		<view class="reset">
			重置密码
		</view>
		
		<view class="inputBox">
			<view class="input">
				<input type="number" autocomplete="off" placeholder="请输入手机号" v-model="form.phone"  class="uni-input" />
			</view>
			<view class="input">
				<input type="number" autocomplete="off" placeholder="请输入验证码" v-model="form.yzm"  class="uni-input" />
				<view class="yzm" @click="getYzm" v-if="$store.state.countdown3==60">
					获取验证码
				</view>
				<view class="yzm" v-else>
					{{$store.state.countdown3}}秒后重新发送
				</view>
			</view>
			
			<view class="input">
				<input type="text" autocomplete="off" placeholder="请输入新密码" v-model="form.password"  class="uni-input" />
			</view>
		</view>
		
		<view class="btn" @click="login">
			提交
		</view>

	</view>
</template>

<script>
	import {getForgetResetCaptcha,forgetResetPassword} from '@/api/login.js'
	export default {
		data() {
			return {
				form:{
					phone:"",
					yzm:"",
					password:""
				}
			};
		},
		// 防止点击返回按钮 反复回退
		onBackPress(event){
			uni.redirectTo({
				url:'../passwordLogin/passwordLogin'
			});
			return true;
		},
		methods:{
			// 提交
			login(){
				if(this.form.phone==''){
					uni.showToast({
						title:"请输入手机号码",
						icon:"none"
					})
					 return false;
				}
				if(this.form.yzm==''){
					uni.showToast({
						title:"请输入验证码",
						icon:"none"
					})
					 return false;
				}
				if(this.form.password==''){
					uni.showToast({
						title:"请输入密码",
						icon:"none"
					})
					 return false;
				}
				forgetResetPassword({
					"captcha": this.form.yzm,
					"phoneNum": this.form.phone,
					"password": this.form.password
				}).then(res=>{
					console.log(res,'重置密码');
					if(res.data.code==0){
						setTimeout(()=>{
							uni.reLaunch({
								url:'../passwordLogin/passwordLogin'
							})
						},500)
					}
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
				})
			},
			// 获取验证码
			getYzm(){
				if(this.form.phone==''){
					uni.showToast({
						title:"请输入手机号码",
						icon:"none"
					})
					 return false;
				}
				if(!(/^1[3456789]\d{9}$/.test(this.form.phone))){
					uni.showToast({
						title:"请输入正确的号码格式",
						icon:"none"
					})
					return false;
				}
				getForgetResetCaptcha({
					"phoneNum":this.form.phone
				}).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					if(res.data.code==0){
						this.$store.commit("djs3");
					}	
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.yzmLogin{
		padding: 0 80rpx;
		overflow: hidden;
		.reset{
			margin-top: 180rpx;
			text-align: center;
			font-size: 24px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
		// .logo{
		// 	margin: 220rpx auto 0;
		// 	width: 184rpx;
		// 	height: 184rpx;
		// 	image{
		// 		width: 184rpx;
		// 		height: 184rpx;
		// 	}
		// }
		.inputBox{
			margin-top: 80rpx;
			.input{
				height: 130rpx;
				border-bottom: 1px solid #eee;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.yzm{
					font-size: 16px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #D71507;
					min-width: 300rpx;
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

