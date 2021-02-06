<template>
	<view class="payment">
		<!-- 头部 -->
		<view class="header">
			<view class="back" @click="toBack">
				<image src="../../static/vip/back.png" mode=""></image>
			</view>
			<view class="headTitle">
				扫码付
			</view>
			<view class="">
				
			</view>
		</view>
		
		<view class="shopName">
			<view class="shop-l">
				付款给 {{info.merchantName}}
			</view>
			<view class="shop-r">
				<image :src="info.imgUrl?info.imgUrl:'../../static/vip/shopIcon.png'" mode=""></image>
			</view>
		</view>
		
		<view class="priceBox">
			<view class="priceTitle">
				金额
			</view>
			<view class="inputBox">
				<view class="priceUnit">
					¥
				</view>
				<input type="number" class="uni-input" v-model="value" @input="check"/>
			</view>
			<view class="btn" @click="payTo">
				付款
			</view>
		</view>
	</view>
</template>

<script>
	import {getMerchantInfo,pay} from '@/api/vip/vip.js'
	export default {
		data() {
			return {
				value:"",
				info:{},
				code:""
			};
		},
		onLoad(event) {
			console.log(event.code)
			this.code=event.code;
			getMerchantInfo({
				merchantCode:event.code
			}).then(res=>{
				this.info = res.data.data
			})
		},
		methods:{
			// 小数点限制最多输入后两位
			check(e){
				//正则表达试
				e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
				//重新赋值给input
				this.$nextTick(() => {
					this.value= e.target.value
				})
			},
			toBack(){
				uni.redirectTo({
					url:'/pages/vip/vip'
				})
			},
			payTo(){
				pay({
				  "merchantCode": this.code,
				  "price": Number(this.value)
				}).then(res=>{
					console.log(res,'付款');
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					
					if(res.data.code==0){
						setTimeout(()=>{
							uni.reLaunch({
								url:'./paySuccess/paySuccess?info='+encodeURIComponent(JSON.stringify({payAmmount:Number(this.value)}))
							})
						},1000)		
					}
				
				})
			}
		}
	}
</script>
<style>
	page{	
		background: #F6F6F6;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.payment{
		overflow: hidden;
		height: 100%;
		.header{
			width: calc(100% - 48rpx);
			position: fixed;
			z-index: 999;
			height: 48rpx;
			background: #F6F6F6;
			// box-shadow: 0px 4rpx 20rpx 0px rgba(169, 169, 169, 0.18);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 80rpx 24rpx 20rpx;
			.back{
				width: 40rpx;
				height: 40rpx;
				image{
					width: 40rpx;
					height: 40rpx;
				}
			}
			.headTitle{	
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
		}
		.shopName{
			margin-top: 148rpx;
			padding: 0 30rpx 0 40rpx;
			height: 160rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.shop-l{
				font-size: 17px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			.shop-r{
				width: 96rpx;
				height: 96rpx;
				border-radius:50%;
				overflow: hidden;
				image{
					width: 96rpx;
					height: 96rpx;
				}
			}
		}
		.priceBox{
			height: calc(100% - 308rpx);
			padding: 0 50rpx;
			background: #FFFFFF;
			box-shadow: 0px -4px 18px 0px rgba(0, 0, 0, 0.04);
			border-radius: 16px 16px 0px 0px;
			overflow: hidden;
			.priceTitle{	
				margin-top: 50rpx;
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				height: 40rpx;
			}
			.inputBox{
				display: flex;
				align-items: center;
				border-bottom: 1px solid #eee;
				height: 144rpx;
				.priceUnit{
					font-size: 30px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					margin-right:20rpx;
				}
				.uni-input{
					height: 100%;	
					font-size: 38px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
				}
			}
			.btn{
				margin: 40rpx auto;
				width: 300px;
				height: 50px;
				background: #D71507;
				box-shadow: 0px 3px 8px 0px rgba(186, 121, 121, 0.4);
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 17px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
	}
</style>
