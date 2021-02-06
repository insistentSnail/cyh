<template>
	<view class="login">
		<view class="topOne">
			立即认证
		</view>
		<view class="topTwo">
			享受专属福利!
		</view>
		
		<view class="inputBox">
			<view class="input">
				<input type="text" autocomplete="off" placeholder="请输入您的姓名" v-model="form.userName"  class="uni-input" />
			</view>
			<view class="input">
				<input type="text" autocomplete="off" placeholder="请输入您的身份证号" v-model="form.IdCard"  class="uni-input" />
			</view>
<!-- 			<view class="input">
				<input type="number" autocomplete="off" placeholder="请输入您的手机号" v-model="form.phone"  class="uni-input" />
			</view>
			<view class="input">
				<input type="number" autocomplete="off" placeholder="请输入验证码" v-model="form.yzm"  class="uni-input" />
				<view class="yzm" @click="getYzm" v-if="$store.state.countdown==300">
					获取验证码
				</view>
				<view class="yzm" v-else>
					{{$store.state.countdown}}秒后重新发送
				</view>
			</view> -->
		</view>
		
		<view class="btn" @click="toHome">
			立即认证
		</view>
		
		<view class="skip" @click="skipHome">
			跳过
		</view>
	</view>
</template>

<script>
	import {login,getCode} from '@/api/login.js'
	export default {
		data() {
			return {
				form:{
					userName:"",
					IdCard:"",
					phone:"",
					yzm:""
				}
			};
		},
		methods:{
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
				getCode({
					"phoneNum":this.form.phone
				}).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					if(res.data.code==0){
						this.$store.commit("djs");
					}	
				})
			},
			// 认证
			toHome(){
				if(this.form.userName==''){
					uni.showToast({
						title:"请输入您的姓名",
						icon:"none"
					})
					 return false;
				}
				if(this.form.IdCard==''){
					uni.showToast({
						title:"请输入身份证号码",
						icon:"none"
					})
					 return false;
				}
				if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.IdCard))){
					uni.showToast({
						title:"身份证号码格式不正确",
						icon:"none"
					})
					 return false;
				}
				// if(this.form.phone==''){
				// 	uni.showToast({
				// 		title:"请输入手机号码",
				// 		icon:"none"
				// 	})
				// 	 return false;
				// }
				// if(this.form.yzm==''){
				// 	uni.showToast({
				// 		title:"请输入验证码",
				// 		icon:"none"
				// 	})
				// 	 return false;
				// }
				// var obj = JSON.parse(uni.getStorageSync('user_info'))
				// console.log(JSON.parse(uni.getStorageSync('user_info')),'微信用户信息');
				login({
					"name": this.form.userName,
					"idCard": this.form.IdCard
				}).then(res=>{
					console.log(res,'用户认证')
					if(res.data.code==0){
						// this.$store.dispatch('setAccessToken',res.data.data.token);
						this.$store.dispatch('setIsAuth',true);//改变认证状态
						this.$store.commit('switchTab2',1);
						uni.showToast({
							title:'认证成功',
							icon:"none"
						})
						setTimeout(()=>{	
							uni.redirectTo({
								url:'/pages/index/index'
							})
						},500)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			},
			skipHome(){
				this.$store.commit('switchTab2',1);
				uni.redirectTo({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>
<style>
	page{
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.login{
		height: 100%;//继承page的高度
		overflow: hidden;
		background: url('@/static/login.png') no-repeat;
		background-size: 100% 100%;
		padding: 0 80rpx;
		.topOne{
			margin-top: 260rpx;
			font-size: 24px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
		.topTwo{	
			margin-top: 12rpx;
			font-size: 28px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
		.inputBox{
			margin-top: 40rpx;
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
			margin: 40rpx auto;
			width: 606rpx;
			height: 100rpx;
			background: #D71507;
			box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
			border-radius: 20rpx;	
			font-size: 34rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.skip{	
			margin-top: 20rpx;
			text-align: center;
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}
	}
</style>
