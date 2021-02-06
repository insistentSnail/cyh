<template>
	<view class="container">
		<view class="inputBox">
			<view class="input">
				<input type="number" autocomplete="off" placeholder="请输入您的手机号" v-model="form.phone" class="uni-input" />
			</view>
			<view class="input">
				<input type="number" autocomplete="off" placeholder="请输入验证码" v-model="form.yzm" class="uni-input" />
				<view class="yzm" @click="getYzm" v-if="$store.state.countdown1==300">
					获取验证码
				</view>
				<view class="yzm" v-else>
					{{$store.state.countdown1}}秒后重新发送
				</view>
			</view>
		</view>
		<view class="quit" @click="confirm">确认修改</view>
	</view>
	
</template>

<script>
	import { sendChangePhoneCaptcha, changePhone } from '@/api/my/my'
	export default {
		data() {
			return {
				form: {
					phone: '',
					yzm: ''
				}
			};
		},
		methods: {
			confirm () {
				if (this.form.phone==''){
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
				if (this.form.yzm==''){
					uni.showToast({
						title:"请输入验证码",
						icon:"none"
					})
					 return false;
				}
				
				changePhone({ phoneNum: this.form.phone, captcha: this.form.yzm }).then(res =>{
					if (res.data.code === 0) {
						uni.showToast({
							title: '修改成功',
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1000)
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
					}
				})
			},
			getYzm () {
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
				sendChangePhoneCaptcha({
					phoneNum: this.form.phone
				}).then(res=>{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					if(res.data.code==0){
						this.$store.commit("djs1")
					}	
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #f6f6f6;
		position: fixed;
		height: 100%;
		width: 100%;
	}
	.quit {
		background-color: #fff;
		text-align: center;
		color: #D71507;
		height: 112rpx;
		line-height: 112rpx;
		margin-top: 24rpx;
		font-size: 32rpx;
	}
	
	.inputBox {
		padding: 0 30rpx;
		background-color: #fff;
		.input {
			height: 114rpx;
			border-bottom: 1px solid #eee;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			&:nth-last-child(1) {
				border-bottom: none;
			}

			.yzm {
				font-size: 16px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #D71507;
				min-width: 300rpx;
				text-align: right;
			}

			.uni-input {
				width: 100%;
				height: 100%;
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
			}
		}
	}
</style>
