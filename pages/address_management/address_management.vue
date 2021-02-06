<template>
	<view class="addressBox">
		
		<view class="header">
			<image @click="goBack" src="../../static/shop/goBack.png" mode=""></image>
			<view class="title">
				确认订单
			</view>
			<view class="order">
		
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="info_k">
			<!-- 来自哪里 -->
		<!-- 	<view class="channel">
				<image :src="shopInfo.shopGroupImgUrl"></image>
				{{shopInfo.shopGroupName}}
			</view> -->
			<!-- 商品信息 -->
			<view class="information">
				<image :src="shopInfo.imgUrl"></image>
				<!-- 名称 -->
				<view class="h1 ov">
					<view class="fl jd">
						{{shopInfo.name}}
					</view>
					<view class="fr">
						x1
					</view>
				</view>
				<!-- 时间 -->
			<!-- 	<view class="time">
					消费时间：2020-11-08&nbsp;22:06
				</view> -->
				<!-- 价格 -->
				<view class="price">￥{{shopInfo.price}}</view>
			</view>
		</view>
		<!-- 底部支付 -->
		<view class="foot_pay">
			<text class="a">合计：</text>
			<text class="b">￥{{shopInfo.price}}</text>
			<text class="c">，共1件</text>
			<!-- 现在的购物逻辑 -->
			<view class="fr" @click="toPayment">提交订单</view>
			<!-- 原来的购物逻辑 -->
		<!-- 	<view class="fr" @click="show=true">支付</view> -->
		</view>
		<!-- 弹窗 -->
<!-- 		<u-popup v-model="show" mode="bottom" border-radius="32"
		 close-icon-pos="top-left"
		 :closeable="true">
			<view class="paymentBox">
				<view class="price">
					<text class="unit">¥</text>
					<text class="num">{{shopInfo.price}}</text>
				</view>
				<view class="orderMsg">
					<view class="msg-l">
						订单信息
					</view>
					<view class="msg-r">
						商城消费
					</view>
				</view>
				
				<view class="paymentType">
					<view class="type-l">
						付款方式
					</view>
					<view class="type-r" @click="openTypeShow">
						<view class="">
							{{payIndex==1?'饭卡':'福卡'}}
						</view>
						<image src="/static/shop/back.png" mode=""></image>
					</view>
				</view>
				
				<u-button class="btn" @click="toPaySuccess" :loading='loading'>
					立即付款
				</u-button>
			</view>
		</u-popup>	 -->
		
		<!-- 付款方式弹窗 -->
<!-- 		<u-popup v-model="typeShow" mode="bottom" border-radius="32"
		 close-icon-pos="top-left"
		 :closeable="true">
			<view class="typeBox" style="height: 407px;">
				<view class="title">
					选择付款方式
				</view>
				
				<view class="choose">
					<view :class="payIndex==item.id?'fp active':'fp'" v-for="(item,index) in payType" 
					@click="paySwitch(item.id)"
					:key="item.id">
						<view class="fp-l">
							<text class="one">{{item.name}}</text>
							<text class="two">（剩余：¥{{item.balanceStr}}）</text>
						</view>
						<view class="fp-r">
							<image v-show="payIndex==item.id" src="../../static/vip/true.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		 </u-popup>	 -->
		 
		 
		 <!-- 安卓和苹果用原生的模态框样式不一致 -->
		 <show-modal></show-modal>
	</view>
</template>

<script>
	import {getPayCardInfo,changePayModel} from "@/api/vip/vip.js"
	import {getShopInfo,buyCoupon,createCommodityOrder} from '@/api/shop/shop.js'
	export default {
		data() {
			return {
				shopInfo:{},	
				show:false,
				typeShow:false,
				payType:[],
				payIndex:null,
				loading:false
			}
		},
		onLoad(event) {
			this.getVipCard();
			getShopInfo({
				id:event.id
			}).then(res=>{
				console.log(res,"商品详情");
				this.shopInfo = res.data.data;
			})	
		},
		methods:{
			goBack(){
				this.$showModal({
				  title: '',
				  content: '确定要放弃下单吗？',
				  confirmText:'我在想想',
				  confirmColor:'#D71507',
				  cancelText:'暂时放弃',
				  cancelColor:'#999',
				  success:(res)=>{
				    if (res.confirm) {
						console.log('用户点击确定')
				    } else if (res.cancel) {
						console.log('用户点击取消')
						
						// 回退问题已解决,防止反复回退
						uni.navigateBack();
						// this.$store.commit('switchTab2',2);//统一跳商城页面
						// uni.reLaunch({
						// 	url:"/pages/shop/shop"
						// })
				    }
				  }
				})
			},
			openTypeShow(){
				this.typeShow=true;
				this.getVipCard();
			},
			//查默认是饭票还是福票付款
			// 获取会员卡信息
			getVipCard(){
				getPayCardInfo().then(res=>{
					console.log(res,'获取会员卡信息');
					this.payIndex = res.data.data.selectedCardId;
					this.payType = res.data.data.cardBalances;		
				})
			},
			paySwitch(id){
				this.payIndex = id;
				changePayModel({
					'cardId':this.payIndex
				}).then(res=>{
					console.log(res,'选择扣款方式');
				})
			},
			toPayment(){
				createCommodityOrder({
					"commodityTempId": this.shopInfo.id,
					"account": "",
				}).then(res=>{
					console.log(res,'创建支付订单');
					if(res.data.code==0){
						uni.navigateTo({
							url:'./welfareShopOrder/payment/payment?id='+res.data.data
						})
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			
			},
			// 付款成功
			toPaySuccess(){
				this.loading = true;
				buyCoupon({
					"id": this.shopInfo.id,
					"cardId": this.payIndex
				}).then(res=>{
					console.log(res,'付款结果');//存在问题，余额不足也能支付成功，余额为负数
					this.loading = false;
					if(res.data.code==0){
						uni.showToast({
							title:'支付成功',
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateTo({
								url:'/pages/paySuccess/paySuccess?info=' + encodeURIComponent(JSON.stringify(res.data.data))
							})
						},1000)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			}
		}
	}
</script>
<style>
  page{
    background: #F6F6F6;
  }
</style>
<style lang="scss" scoped>
	.addressBox{
		padding-bottom: 200rpx;
		overflow: hidden;
		padding-top:150rpx;
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
			top: 0;
			.title{
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
		.ov{overflow: hidden;}
		.fl{float: left;}
		.fr{float: right;}
		.jd{
			width:100%;
			display:block;
			// overflow: hidden;
			// white-space: nowrap;
			// -o-text-overflow: ellipsis;
			// text-overflow: ellipsis;
			}
			// 收货地址
		.top{position: relative;padding: 40rpx 80rpx 36rpx 116rpx;margin:20rpx 30rpx 0;
		background: #FFFFFF;box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(169, 169, 169, 0.14);
		border-radius: 12rpx;}
			.top .r{width: 32rpx;height: 32rpx;position: absolute;top: 50%;right: 18rpx;margin-top: -16rpx;}
			.top .l{width: 68rpx;height: 68rpx;position: absolute;top: 50%;left: 24rpx;margin-top: -34rpx;}
			.top .h1{
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
				line-height: 32rpx;
				margin-bottom: 20rpx;
			}
			.top .h1 text{
				font-size: 34rpx;
				font-weight: 500;
				color: #333333;
				line-height: 32rpx;
				margin-right: 13rpx;
			}
			.top .h2{
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
				line-height: 40rpx;
			}
			// 没有收货地址
			.no_map{height: 200rpx;color: #999999;line-height: 124rpx;font-size: 34rpx;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;;}
			.info_k{
				margin: 20rpx 30rpx 0;
				padding: 0 24rpx;
				background: #ffffff;
				box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(169, 169, 169, 0.14);
				border-radius: 12rpx;
			}
			.channel{overflow: hidden;font-size: 32rpx;font-weight: 500;color: #333333;line-height: 100rpx;border-bottom: 4rpx solid rgba(238, 238, 238, 1);}
			.channel image{width: 36rpx;height: 36rpx;float: left;margin: 34rpx 16rpx 0 0;}
			// 商品信息
			.information{
				position: relative;
				height: 160rpx;
				padding: 34rpx 0 34rpx 180rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
			.information image{width: 160rpx;height: 160rpx;position: absolute;top: 28rpx;left: 0;}
			.information .h1{
				width: 100%;
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				line-height: 32rpx;
			}
			.information .h1 .fl{width: 80%;}
			.information .h1 .fr{color: #999999;}
			.information .time{
				// font-size: 24rpx;
				// font-weight: 400;
				// color: #999999;
				// line-height: 24rpx;
				height: 24rpx;
				margin: 16rpx 0 48rpx;
			}
			.information .price{
				font-size: 28rpx;
				font-weight: 500;
				color: #D71507;
				line-height: 28rpx;
			}
		// 底部支付
		.foot_pay{position: fixed;bottom: 0;left: 0;width: 100%;background: #ffffff;
		box-shadow: 0rpx -8rpx 12rpx 0rpx rgba(204, 204, 204, 0.16);padding: 20rpx 30rpx;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;line-height: 100rpx;font-size: 26rpx;color: #999999;}
		.foot_pay .fr{
			width: 240rpx;
			height: 100rpx;
			background: #D71507;
			box-shadow: 0rpx 6rpx 16rpx 0rpx rgba(186, 121, 121, 0.4);
			border-radius: 12rpx;
			text-align: center;
			line-height: 100rpx;
			color: #ffffff;
			font-size: 30rpx;
		}
		.foot_pay .a{
			color: #333333;
			font-size: 30rpx;
		}
		.foot_pay .b{
			color: rgba(215, 21, 7, 1);
			font-size: 30rpx;
		}
		
		// lx
		.paymentBox{
			height: 814rpx;
			overflow: hidden;
			.price{
				margin-top: 90rpx;
				text-align: center;
				.unit{
					font-size: 20px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
				.num{
					font-size: 38px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
			}
			.orderMsg{
				margin: 20rpx auto 0;
				width: calc(100% - 60rpx);
				padding: 30rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #eee;
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				.msg-l{	
					color: #999999;
				}
				.msg-r{	
					color: #333333;
				}
			}
			.paymentType{
				padding: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;	
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				.type-l{			
					color: #999999;
				}
				.type-r{
					display: flex;
					align-items: center;
					image{
						width: 32rpx;
						height: 32rpx;
						margin-left: 10rpx;
					}
				}
			}
			.btn{
				margin:260rpx auto;
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
		.typeBox{
			overflow: hidden;
			.title{	
				margin-top: 30rpx;
				text-align: center;
				font-size: 18px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
			.choose{
				margin-top: 20rpx;
				padding: 0 40rpx;
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
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
						background: #eee;
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
		}
	
	}
</style>
