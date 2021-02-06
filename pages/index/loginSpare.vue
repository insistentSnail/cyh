<template>
	
	<!-- 登录备用页面 -->
	<view class="container">
		<view style="font-size: 48rpx; color: #333; font-weight: 600; margin-left: 84rpx;">您好，</view>
		<view style="font-size: 56rpx; color: #333; font-weight: 600; margin-left: 84rpx; margin-top: 16rpx;">欢迎登录!</view>
		<view style="width: 590rpx; margin: 0 auto; margin-top: 106rpx;">
			<input type="text" placeholder="请输入您的姓名" placeholder-style="font-size: 30rpx; color: #999;" class="content-input">
			<input type="text" placeholder="请输入您的单位" placeholder-style="font-size: 30rpx; color: #999;" class="content-input">
			<input type="text" placeholder="请输入您的身份证" placeholder-style="font-size: 30rpx; color: #999;" class="content-input">
			<input type="text" placeholder="请输入您的手机号" placeholder-style="font-size: 30rpx; color: #999;" class="content-input">
			<view class="content-input" style="display: flex; justify-content: space-between; align-items: center;">
				<input type="text" placeholder="请输入验证码" placeholder-style="font-size: 30rpx; color: #999;">
				<view style="color: #D71507; font-size: 32rpx; font-weight: 500;">获取验证码</view>
			</view>
		</view>
		<view class="now">立即登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 1624rpx;
	background: url('@/static/login.png') no-repeat 0 / 100% 100%;
	padding-top: 220rpx;
	box-sizing: border-box;
	
	.content-input {
		height: 36rpx;
		line-height: 36rpx;
		padding-bottom: 32rpx;
		padding-top: 58rpx;
		border-bottom: 2rpx solid #eee;
	}
	
	.now {
		width: 606rpx;
		height: 100rpx;
		background: #D71507;
		box-shadow: 0 6rpx 16rpx 0 rgba(186, 121, 121, 0.4);
		border-radius: 20rpx;
		line-height: 100rpx;
		text-align: center;
		color: #fff;
		margin: 0 auto;
		margin-top: 130rpx;
	}
}
</style>
