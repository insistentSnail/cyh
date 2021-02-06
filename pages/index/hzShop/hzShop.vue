<template>
	<view class="hzShop">
		<!-- <image :src="imgUrl" mode=""></image> -->
		<view class="content">
			<view class="topTip">
				<view class="topTip-l">
					<image src="/static/homePage/notice.png" mode=""></image>
				</view>
				<view class="topTip-r">
					<view class="bold">
						彩云汇App线下扫码消费开始啦！
					</view>
					<view class="thin">
						合作门店陆续开放
					</view>
				</view>
			</view>
			
			
			<view class="card" v-for="(item,index) in shopList" :key="index">
				<view class="card-l">
					<image :src="item.imgUrl" mode=""></image>
				</view>
				<view class="card-r">
					<view class="c-l">
						<view class="cardName">
							{{item.name}}
						</view>
						<view class="tel" v-if="item.phoneNum">
							<image src="/static/homePage/tel.png" mode=""></image>
							<view class="telNum">
								{{item.phoneNum}}
							</view>
						</view>
						<view class="address">
							<image src="/static/homePage/address.png" mode=""></image>
							<view class="addressText">
								{{item.address}}
							</view>
						</view>
					</view>
				
					<view class="c-c">
						
					</view>
					
					<view class="c-r" @click="intoMap(item)">
						<image src="../../../static/homePage/daohang.png" mode=""></image>
						<text>导航</text>
					</view>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	// import {GetCooperativeMerchantImg} from '@/api/shop/shop.js'
	import {GetCooperateStore} from '@/api/shop/shop.js'
	export default {
		data() {
			return {
				// imgUrl:"",
				shopList:[]
			};
		},
		onLoad() {
			// GetCooperativeMerchantImg().then(res=>{
			// 	console.log(res,"合作商户");
			// 	this.imgUrl = res.data.data.imgUrl;
			// })
			GetCooperateStore().then(res=>{
				console.log(res,"合作商户数据");
				this.shopList = res.data.data;
			})
		},
		methods:{
			intoMap(item){
				uni.navigateTo({
					url:'./daohang/daohang?info='+JSON.stringify(item)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hzShop{
		// image{
		// 	width: 100%;
		// 	height: 1600rpx;
		// }
		.content{
			padding: 30rpx;
			.topTip{
				width: 660rpx;
				height: 122rpx;
				background: #F9F5F5;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				.topTip-l{
					width: 66rpx;
					height: 62rpx;
					image{
						width: 66rpx;
						height: 62rpx;
					}
				}
				.topTip-r{
					height: 62rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 30rpx;
					.bold{
						font-size: 14px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 1;
					}
					.thin{
						line-height: 1;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E8B8B;
					}
				}
			}
			.card{
				// height: 212rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.card-l{
					min-width: 136rpx;
					height: 136rpx;
					image{
						width: 136rpx;
						height: 136rpx;
					}
					margin-right: 16rpx;
				}
				.card-r{
					padding: 30rpx 0;
					min-height: 150rpx;
					height: 100%;
					width: 100%;
					border-bottom:1px solid #eee;
					display: flex;
					align-items: center;
					// flex-direction: column;
					// justify-content: space-around;
					.c-l{
						width: 80%;
						height: 150rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						.cardName{
							font-size: 16px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
						.tel{
							margin-top: 15rpx;
							display: flex;
							align-items: center;
							.telNum{
								font-size: 14px;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #999999;
							}
							image{
								margin-right: 8rpx;
								min-width: 26rpx;
								width: 26rpx;
								height: 26rpx;
							}
						}
						.address{
							margin-top: 10rpx;
							display: flex;
							.addressText{
								font-size: 14px;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #999999;
								line-height: 1;
							}
							image{
								margin-right: 8rpx;
								min-width: 30rpx;
								width: 30rpx;
								height: 30rpx;
							}
						}
					}
					.c-c{
						width: 2rpx;
						height: 86rpx;
						background: #e8e8e8;
						margin-left: 14rpx;
					}
					.c-r{
						display: flex;
						flex-direction: column;
						align-items: center;
						min-width: 100rpx;
						image{
							width: 64rpx;
							height: 64rpx;
						}
						text{
							margin-top: 6rpx;
							font-size: 11px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #D71507;
						}
					}
				}
			}
		}
	}
</style>
