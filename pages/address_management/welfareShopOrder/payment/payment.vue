<template>
	<view class="payment">
		
		<view class="header">
			<image @click="goBack" src="../../../../static/shop/goBack.png" mode=""></image>
			<view class="title">
				彩云汇收银台
			</view>
			<view class="order" @click="toOrder">
				订单中心
			</view>
		</view>
				
		<view class="price">
			<view class="unit">
				¥
			</view>
			<view class="number">
				{{info.payAmmount}}
			</view>
		</view>
		
		<view class="time" v-if="timestamp>0">
			<view class="timeLabel">
				支付剩余时间：
			</view>
			<u-count-down :timestamp="timestamp"></u-count-down>
		</view>
		
		<view class="innerPay" v-if="payType.length>0">
			<view class="label">
				<image src="../../../../static/vip/cyhPay.png" mode=""></image>
			</view>
			
			<view :class="payIndex==item.id?'fp active':'fp'" v-for="(item,index) in payType"
			@click="paySwitch(item.id)"
			:key="item.id">
				<view class="fp-l">
					<text class="one">{{item.name}}</text>
					<text class="two">（剩余：¥{{item.balance}}）</text>
				</view>
				<view class="fp-r">
					<image v-show="payIndex==item.id" src="/static/vip/true.png" mode=""></image>
				</view>
			</view>
			
		</view>
		
		<view class="thirdPay" v-if="isUseAlipay||isUseWechatPay">
			<!-- 支付宝支付 -->
			<block v-if="isUseAlipay">
				<view :class="payIndex==33?'fp active':'fp'" @click="paySwitch(33)">
					<view class="fp-l" style="display: flex;align-items: center;">
						<image style="width: 52rpx;height: 52rpx;" src="../../../../static/vip/zfb.png" mode=""></image>
						<text class="one" style="margin-left: 10rpx;">支付宝支付</text>
					</view>
					<view class="fp-r">
						<image v-show="payIndex==33" src="../../../../static/vip/true.png" mode=""></image>
					</view>
				</view>
			</block>
		
			<!-- 微信支付 -->
			<block v-if="isUseWechatPay">
				<view :class="payIndex==44?'fp active':'fp'" @click="paySwitch(44)">
					<view class="fp-l" style="display: flex;align-items: center;">
						<image style="width: 52rpx;height: 52rpx;" src="../../../../static/vip/wx.png" mode=""></image>
						<text class="one" style="margin-left: 10rpx;">微信支付</text>
					</view>
					<view class="fp-r">
						<image v-show="payIndex==44" src="../../../../static/vip/true.png" mode=""></image>
					</view>
				</view>
			</block>
		</view>
		
		<view class="payBtnBox">
		<!-- 	<view class="payBtn">
				饭票支付¥1980.80
			</view> -->
			<u-button class="payBtn" @click="toPaySuccess" :loading='loading'>
				{{payIndex==1?'饭卡':payIndex==2?'福卡':payIndex==3?'生日票':payIndex==33?'支付宝':payIndex==44?'微信':''}}支付¥{{info.payAmmount}}
			</u-button>
		</view>
		
		<!-- 安卓和苹果用原生的模态框样式不一致 -->
		<show-modal></show-modal>
	</view>
</template>

<script>
	import {getVipCode,getPayCardInfo,changePayModel,aliPayBuyCommodity} from "@/api/vip/vip.js"
	import {getShopInfo,buyCoupon,getCommodityOrderPayInfo,payCommodityOrder,commodityOrderAliPayAppPay} from '@/api/shop/shop.js'
	export default {
		data() {
			return {
				timestamp: null,
				payType:[],
				payIndex:null,
				loading:false,
				info:{},
				shopId:null,
				addressId:null,
				orderId:null,
				
				isUseAlipay:null,//是否支持支付宝支付
				isUseWechatPay:null//是否支持微信支付
				// isCard:true,//福卡饭卡都不支持
				// isFanCard:null,//是否支持饭卡支付
				// isFuCard:null//是否支持福卡支付
			};
		},
		onLoad(e) {
			console.log(e)
			this.shopId = e.shopId;
			this.addressId = e.addressId;
			this.orderId = e.id;
			getCommodityOrderPayInfo({
				id:e.id
			}).then(res=>{
				console.log(res,'收银台');
				console.log(res.data.data.orderData.commodityCategory)
				this.info = res.data.data.orderData;
				this.timestamp = res.data.data.timeOutSecond;
				this.isUseAlipay = res.data.data.orderData.commodityCategory.isUseAlipay;
				this.isUseWechatPay = res.data.data.orderData.commodityCategory.isUseWechatPay;
				this.payType = res.data.data.orderData.commodityCategory.cards;
				// if(res.data.data.orderData.commodityCategory.cards.length==0){
				// 	this.isCard = false
				// 	return false;
				// }
				// var fanCard = res.data.data.orderData.commodityCategory.cards.findIndex(el=>{
				// 	return el.id == 1
				// })
				// if(fanCard!=-1){
				// 	this.isFanCard=true;
				// }
				// var fuCard = res.data.data.orderData.commodityCategory.cards.findIndex(el=>{
				// 	return el.id == 2
				// })
				// if(fuCard!=-1){
				// 	this.isFuCard=true;
				// }
				// this.getVipCard();
			})
		},
		// onNavigationBarButtonTap(val) {
		//     console.log(val);
		// 	// 跳转我的订单
		
		// 	uni.navigateTo({
		// 		url:'/pages/my/myOrder/myOrder'
		// 	})
		// },
		methods:{
			goBack(){
				this.$showModal({
				  title: '确定离开收银台？',
				  content: '你的订单在24小时内未支付将被取消',
				  confirmText:'离开收银台',
				  confirmColor:'#D71507',
				  cancelText:'继续支付',
				  cancelColor:'#999',
				  success(res) {
				    if (res.confirm) {
						console.log('用户点击确定')
						uni.navigateTo({
							url:'/pages/my/myOrder/myOrder'
						})
				    } else if (res.cancel) {
				      console.log('用户点击取消')
				    }
				  }
				})
			},
			// 跳转我的订单
			toOrder(){
				this.$showModal({
				  title: '确定离开收银台？',
				  content: '你的订单在24小时内未支付将被取消',
				  confirmText:'离开收银台',
				  confirmColor:'#D71507',
				  cancelText:'继续支付',
				  cancelColor:'#999',
				  success(res) {
				    if (res.confirm) {
				      console.log('用户点击确定')
					  // 跳转我的订单
					  uni.navigateTo({
						url:'/pages/my/myOrder/myOrder'
					  })
				    } else if (res.cancel) {
				      console.log('用户点击取消')
				    }
				  }
				})
			},
			// 获取会员卡信息
			//查默认是饭票还是福票付款
			// getVipCard(){
			// 	getPayCardInfo().then(res=>{
			// 		console.log(res,'获取会员卡信息');
			// 		// this.payIndex = res.data.data.selectedCardId;
			// 		this.payIndex = null;
			// 		if(this.isFanCard&&this.isFuCard){
			// 			// 饭卡福卡都支持
			// 			this.payType = res.data.data.cardBalances;	
			// 		}else if(this.isFanCard&&!this.isFuCard){
			// 			// 只支持饭卡
			// 			this.payType = res.data.data.cardBalances.filter(ele=>{
			// 				return ele.id == 1
			// 			})
			// 		}else if(!this.isFanCard&&this.isFuCard){
			// 			// 只支持福卡
			// 			this.payType = res.data.data.cardBalances.filter(ele=>{
			// 				return ele.id == 2
			// 			})
			// 		}
			// 	})
			// },
			paySwitch(id){
				console.log(id,'id')
				this.payIndex = id;
				if(id==33){
					// 支付宝支付
				}else if(id==44){
					// 微信支付
				}else{
					changePayModel({
						'cardId':this.payIndex
					}).then(res=>{
						console.log(res,'选择扣款方式');
					})
				}
			},
			
			// 付款成功
			toPaySuccess(){
				
				if(!this.payIndex){
					uni.showToast({
						title:'请选择扣款方式',
						icon:"none"
					})
					return false;
				}
				
				this.$showModal({
					  title: '',
					  content: '确认支付吗？',
					  cancelText:"取消",
					  cancelColor:"#000000",
					  confirmText:"确定",
					  confirmColor:"#D71507",
					  success:res=> {
						if (res.confirm) {
							console.log('用户点击确定');
							if(this.payIndex==44){
								uni.showToast({
									title:'暂不支持微信支付',
									icon:"none"
								})
								return false;
							}
							this.loading = true;
							// 支付宝支付
							if(this.payIndex==33){
								commodityOrderAliPayAppPay({
									"orderId": Number(this.orderId)
								}).then(res=>{
									console.log(res,'支付宝订单');
									uni.requestPayment({
										provider: 'alipay',
										orderInfo: res.data.data, 
										success: success=>{
											console.log('success:' + JSON.stringify(success));
											this.loading = false;
											uni.showToast({
												title:'支付成功',
												icon:"none"
											})
											setTimeout(()=>{
												uni.reLaunch({
													url:'/pages/paySuccess/paySuccess?info=' + encodeURIComponent(JSON.stringify(this.info))
												})
											},500)
										},
										fail: err=>{
											console.log('fail:' + JSON.stringify(err));
											this.loading = false;
											uni.showToast({
												title:'支付失败',
												icon:"none"
											})
										}
									});
								})
							}else{
								payCommodityOrder({
									"cardId": this.payIndex,
									"orderId": Number(this.orderId)
								}).then(res=>{
									console.log(res,'付款结果');//存在问题，余额不足也能支付成功，余额为负数
									this.loading = false;
									if(res.data.code==0){
										uni.showToast({
											title:'支付成功',
											icon:"none"
										})
										setTimeout(()=>{
											uni.reLaunch({
												url:'/pages/paySuccess/paySuccess?info=' + encodeURIComponent(JSON.stringify(this.info))
											})
										},500)
									}else{
										uni.showToast({
											title:res.data.msg,
											icon:"none"
										})
									}
								})
							}
							
					  } else if (res.cancel){
							console.log('用户点击取消');
					  }
					}
				});
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
	.payment{
		overflow: hidden;
		padding-bottom: 188rpx;
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
				margin-left: 50rpx;
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			.order{
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
			image{
				width: 36rpx;
				height: 36rpx;
			}
		}
		.price{
			display: flex;
			margin-top: 220rpx;
			// margin-top: 70rpx;
			align-items: center;
			justify-content: center;
			.unit{	
				margin-top: 14rpx;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #D71507;
			}
			.number{
				font-size: 26px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #D71507;
			}
		}
		.time{
			display: flex;
			margin-top: 20rpx;
			align-items: center;
			justify-content: center;
			.timeLabel{	
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
			/deep/ .u-countdown-item{
				background: #F6F6F6!important;
				.u-countdown-time{
					color:#D71507!important;
					font-size: 15px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
				}
			}
			/deep/ .u-countdown-colon{
				color:#D71507!important;
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
			}
		}
		.innerPay{
			margin: 70rpx auto 0rpx;
			width: 630rpx;
			// height: 312rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 24rpx 0px rgba(169, 169, 169, 0.14);
			border-radius: 12rpx;
			padding: 10rpx 30rpx;
			.label{
				height: 86rpx;
				display: flex;
				align-items: center;
				border-bottom: 1px solid #eee;
				image{
					width: 166rpx;
					height: 30rpx;
				}
			}
			.fp{
				height: 104rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				// &:nth-child(2){
					border-bottom: 1px solid #eee;
				// }
				&.active{
					.fp-l{
						.one{
							color: #333333;
						}
					}
					.fp-r{
						width: 48rpx;
						height: 48rpx;
						border: none;
						// background: #F6962E;
						background: rgba(215, 21, 7, 1);
					}
				}
				.fp-l{
					.one{
						font-size: 17px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #999999;
					}
					.two{		
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
				.fp-r{
					width: 44rpx;
					height: 44rpx;
					border-radius: 50%;
					// background: #eee;
					border: 1px solid #e4e4e4;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 28rpx;
						height: 20rpx;
					}
				}
			}
		}
		.thirdPay{
			margin: 30rpx auto;
			width: 630rpx;
			// height: 246rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 24rpx 0px rgba(169, 169, 169, 0.14);
			border-radius: 12rpx;
			padding: 10rpx 30rpx;
			.fp{
				height: 120rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:nth-child(1){
					border-bottom: 1px solid #eee;
				}
				&.active{
					.fp-l{
						.one{
							color: #333333;
						}
					}
					.fp-r{
						width: 48rpx;
						height: 48rpx;
						border: none;
						// background: #F6962E;
						background: rgba(215, 21, 7, 1);
					}
				}
				.fp-l{
					.one{
						font-size: 17px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #999999;
					}
					.two{		
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
				.fp-r{
					width: 44rpx;
					height: 44rpx;
					border-radius: 50%;
					// background: #eee;
					border: 1px solid #e4e4e4;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 28rpx;
						height: 20rpx;
					}
				}
			}
		}
		.payBtnBox{
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 188rpx;
			background: #FFFFFF;
			box-shadow: 0px -8rpx 16rpx 0px rgba(204, 204, 204, 0.25);
			.payBtn{
				margin: 20rpx auto;
				width: 690rpx;
				height: 100rpx;
				background: #D71507;
				box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
				border-radius: 20rpx;
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
