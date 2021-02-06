<template>
	<view class="paySuccess">
		<view class="logo lds-hourglass">
			<image src="/static/wxLogin/ctLogo.png" mode=""></image>
		</view>
		<view class="successImg">
			<image src="../../../static/shop/paySuccess.png" mode=""></image>
		</view>
		<view class="payShopType">
			扫码消费
		</view>
		<view class="price">
			<view class="unit">
				¥
			</view>
			<view class="num">
				{{info.payAmmount}}
			</view>
		</view>
		
		<view class="line">		
		</view>
		
		<view class="content">
			<view class="status">
				<view class="status-l">
					当前状态
				</view>
				<view class="status-r">
					支付成功
				</view>
			</view>
<!-- 			<view class="status">
				<view class="status-l">
					订单信息
				</view>
				<view class="status-r">
					{{info.info}}
				</view>
			</view>
			<view class="status">
				<view class="status-l">
					支付时间
				</view>
				<view class="status-r">
					{{info.payTime}}
				</view>
			</view>
			<view class="status">
				<view class="status-l">
					付款方式
				</view>
				<view class="status-r">
					{{info.payOrigin}}
				</view>
			</view> -->
		</view>
		
		<view class="btn" @click="toShop">
			完成
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{}
			};
		},
		onLoad(e) {
			this.info = JSON.parse(decodeURIComponent(e.info));
		},
		methods:{
			toShop(){
				uni.redirectTo({
					url:'/pages/vip/vip'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paySuccess{
		.logo{
			width: 69rpx;
			height: 69rpx;
			border-radius: 50%;
			overflow: hidden;
			position: fixed;
			top: 10rpx;
			left: 30rpx;
			image{
				width: 69rpx;
				height: 69rpx;
			}
			animation:lds-hourglass 5s infinite;
		}
		
		@keyframes lds-hourglass {
			0% {
				transform:rotate(0);
				animation-timing-function:cubic-bezier(.55,.055,.675,.19)
			}
			50% {
				transform:rotate(900deg);
				animation-timing-function:cubic-bezier(.215,.61,.355,1)
			}
			100% {
				transform:rotate(1800deg)
			}
		}
		
		.successImg{
			width: 104rpx;
			height: 104rpx;
			margin: 48rpx auto 0;
			image{
				width: 104rpx;
				height: 104rpx;
			}
		}
		.payShopType{
			margin-top: 56rpx;	
			text-align: center;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
		}
		.price{
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			justify-content: center;	
			font-size: 20px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			.unit{
				margin-top: 24rpx;
			}
			.num{
				font-size: 38px;
				font-weight: 500;
			}
		}
		.line{
			height: 4rpx;
			width: 592rpx;
			margin: 96rpx auto 0;		
			background: #eee;
		}
		.content{
			margin-top: 40rpx;
			padding: 0 80rpx;
			overflow: hidden;
			.status{
				margin-top: 26rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.status-l{
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
				.status-r{
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
			}
		}
		.btn{
			margin-top: 200rpx;
			text-align: center;
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #D71507;
		}
	}
</style>

