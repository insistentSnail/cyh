<template>
	<view class="myWallet">
		<view class="header">
			<image @click="goBack" src="../../../static/shop/goBack.png" mode=""></image>
			<view class="title">
				钱包
			</view>
			<view class="order" @click="toBill">
				账单明细
			</view>
		</view>
		
		<view class="lists">
			<view class="list" v-for="(item,index) in cardList" :key="index" @click="intoMyBill(index)">
				<view class="list-l">
					<view class="image" :style="item.backgroundSytle">
						{{item.name.substr(0, 1)}}
					</view>
					<view class="text">
						我的{{item.name}}
					</view>
				</view>
				<view class="list-r">
					<view class="price">
						¥ {{item.balanceStr}}
					</view>
					<image src="/static/my/right.png" mode=""></image>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {getBaseCardNum} from '@/api/my/my.js'
	export default {
		data() {
			return {
				cardList:[]
			};
		},
		onLoad() {
			getBaseCardNum().then(res=>{
				console.log(res.data.data,123)
				this.cardList = res.data.data;
			})
		},
		methods:{
			goBack(){
				uni.navigateBack();
			},
			toBill(){
				uni.navigateTo({
					url:'../myBill/myBill?index=0'
				})
			},
			intoMyBill(index){
				uni.navigateTo({
					url:'../myBill/myBill?index='+(index+1)
				})
			}
		}
	}
</script>
<style lang="scss">
	page{
		background: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.myWallet{
		overflow: hidden;
		.header{
			background: #F6F6F6;
			z-index: 9999;
			position: fixed;
			width: calc(100% - 60rpx);
			padding:0 30rpx;
			padding-top: 50rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title{
				margin-left: 60rpx;
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			.order{
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
			image{
				width: 36rpx;
				height: 36rpx;
			}
		}
		.lists{
			margin-top: 180rpx;
			padding: 0 30rpx;
			.list{
				width: calc(100% - 60rpx);
				height: 144rpx;
				background: #FFFFFF;
				box-shadow: 0px 8rpx 24rpx 0px rgba(169, 169, 169, 0.14);
				border-radius: 12rpx;
				margin-bottom: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx;
				.list-l{
					display: flex;
					align-items: center;
					.text{
						margin-left: 16rpx;
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
					}
					.image{
						margin: 26rpx auto;
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						background: linear-gradient(150deg, #F15838 0%, #D71506 100%);
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
				.list-r{
					display: flex;
					align-items: center;
					.price{
						margin-right: 16rpx;
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
					}
					image{
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	}
</style>
