<template>
	<view class="myLogistics">
		<view class="shopMsg">
			<view class="shopImg">
				<image :src="shopInfo.commodityTempImgUrl" mode=""></image>
			</view>
			<view class="shop-r">
				<view class="shopName">
					{{shopInfo.commodityTempName}}
				</view>
				<view class="expressType">
					{{expTextName?expTextName:'快递单号'}}：{{shopInfo.entityExpressNo}}
				</view>
				<view class="orderNumber">
					订单号：{{shopInfo.orderId}}
				</view>
			</view>
		</view>
		
		<view class="logistics">
			<u-time-line>
			<!-- 	<u-time-line-item nodeTop="2"> -->
					<!-- 此处自定义了左边内容，用一个图标替代 -->
		<!-- 			<template v-slot:node>
						<view class="u-node" style="background: #19be6b;"> -->
							<!-- 此处为uView的icon组件 -->
	<!-- 						<u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">待取件</view>
							<view class="u-order-desc">[自提柜]您的快件已放在楼下侧门，直走前方53.6米，左拐约10步，再右拐直走，见一红灯笼停下，叩门三下，喊“芝麻开门”即可。</view>
							<view class="u-order-time">2019-05-08 12:12</view>
						</view>
					</template>
				</u-time-line-item> -->
				<u-time-line-item v-for="(item,index) in logisticsList" :key="index">
					<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
					<template v-slot:content>
						<view>
							<view class="u-order-desc">{{item.context}}</view>
							<view class="u-order-time">{{item.time}}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
	</view>
</template>

<script>
	import {getOrderLists,getOrderInfo} from '@/api/my/my.js'
	export default {
		data() {
			return {
				orderId:null,
				shopInfo:{},
				logisticsList:[],
				expTextName:""//快递公司
			};
		},
		onLoad(e) {
			this.orderId = e.orderId;
			console.log(e.orderId,'e.orderId');
			getOrderInfo({
				id:this.orderId
			}).then(res=>{
				console.log(res,'订单详情');
				this.shopInfo = res.data.data;
				this.logisticsList = res.data.data.kdInfo.showapi_res_body.data;
				this.expTextName = res.data.data.kdInfo.showapi_res_body.expTextName;
			})
		},
	}
</script>
<style>
	page{
		background: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.myLogistics{
		.shopMsg{
			margin: 20rpx auto;
			width: 650rpx;
			height: 200rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 24rpx 0px rgba(169, 169, 169, 0.14);
			border-radius: 12rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			.shopImg{
				width: 160rpx;
				height: 160rpx;
				image{
					width: 160rpx;
					height: 160rpx;
				}
			}
			.shop-r{
				height: 160rpx;
				margin-left: 20rpx;
				.shopName{	
					width: 460rpx;
					font-size: 15px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.expressType{	
					margin-top: 10rpx;
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
				.orderNumber{	
					margin-top: 40rpx;
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
			}
		}
		.logistics{
			margin: 24rpx auto;
			width: 626rpx;
			// height: 1000rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 24rpx 0px rgba(169, 169, 169, 0.14);
			border-radius: 12rpx;
			padding: 40rpx 24rpx 40rpx 40rpx;
			.u-node {
				width: 44rpx;
				height: 44rpx;
				border-radius: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #d0d0d0;
			}
			
			.u-order-title {
				color: #333333;
				font-weight: bold;
				font-size: 32rpx;
			}
			
			.u-order-desc {
				color: rgb(150, 150, 150);
				font-size: 28rpx;
				margin-bottom: 6rpx;
			}
			
			.u-order-time {
				color: rgb(200, 200, 200);
				font-size: 26rpx;
			}
		}
	}
</style>
