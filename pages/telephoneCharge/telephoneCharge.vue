<template>
	<view class="telephoneCharge">
		<view class="content">
			<view class="phoneNum">
				<input type="number" class="uni-input"
				 v-model="value" placeholder="请输入手机号码"
				 @blur="checkPhone"/>
				<view class="operator">
					{{tips}}
				</view>
			</view>
			
			<!-- tab切换 -->
			<view class="tabBox">
				<v-tabs height="100rpx" color="#333"
				activeColor="#D71507"
				fontSize="34rpx"
				lineColor="#D71507"
				lineHeight="4rpx"
				lineRadius="4rpx"
				:lineScale="1"
				 v-model="tabIndex" :tabs="tabs" @change="changeTab"></v-tabs>
			</view>
			<!-- 内容 -->
			<view class="types">
				<view :class="priceCurrent==index?'type active':'type'" v-for="(item,index) in typesList" 
				 :key="index" 
				 @click="priceSwitch(index)">
					<view class="type-t">
						<text class="number">{{item.price}}</text>
						<text class="unit">元</text>
					</view>
					<view class="type-b">
						售价 {{item.price}}.00元
					</view>
				</view>
			</view>
		</view>
		<view class="tips">
			本服务为代充值服务，默认不提供发票
		</view>
		
		<view class="recharge">
			<view class="zixun" @click="toFeedBack">
				<image src="../../static/shop/zixun.png" mode=""></image>
				<view class="text">
					客服
				</view>
			</view>		
			<view class="btn" @click="PhoneRecharge">
				立即充值
			</view>		
		</view>
		
		
		<!-- 弹窗 -->
		<u-popup v-model="show" mode="bottom" border-radius="32"
		 close-icon-pos="top-left"
		 :closeable="true">
			<view class="paymentBox">
				<view class="price">
					<text class="unit">¥</text>
					<text class="num">{{price}}</text>
				</view>
				<view class="orderMsg">
					<view class="msg-l">
						订单信息
					</view>
					<view class="msg-r">
						话费充值
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
				
				<!-- <view class="btn" @click="toPaySuccess"> -->
					<u-button class="btn" @click="toPaySuccess" :loading='loading'>
						立即付款
					</u-button>
					<!-- 立即付款 -->
			<!-- 	</view> -->
			</view>
		</u-popup>	
		
		<!-- 付款方式弹窗 -->
		<u-popup v-model="typeShow" mode="bottom" border-radius="32"
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
		 </u-popup>	
		 
		 <show-modal></show-modal>
	</view>
</template>

<script>
	import {phoneRechargeTest,phoneRecharge,getCommodityList} from '@/api/home/home.js'
	import {getVipCode,getPayCardInfo,changePayModel} from "@/api/vip/vip.js"
	import { createCommodityOrder } from '@/api/shop/shop'
	export default {
		data() {
			return {
				value:null,
				tabs: ['充话费'],
				tabIndex:0,
				typesList:[],
				priceCurrent:0,
				tips:"",
				
				price:30,
				show:false,
				typeShow:false,
				payType:[],
				payIndex:null,
				loading:false,
				shopId:null
			};
		},
		onLoad() {
			// this.getVipCard();//获取默认的payIndex
			this.getShopList();
		},
		methods:{
			getShopList(){
				getCommodityList({
					Type:4,
					Page:1
				}).then(res=>{
					console.log(res,'话费商品');
					this.typesList = res.data.data;
					this.priceSwitch(0);
				})
			},
			// 跳转意见反馈页面
			toFeedBack(){
				uni.navigateTo({
					url:'/pages/feedback/feedback'
				})
			},
			changeTab(index) {
			   console.log('当前选中的项：' + index);
			   this.tabIndex = index;
			},
			// 选择充值价格
			priceSwitch(index){
				this.priceCurrent = index;
				this.price = this.typesList[this.priceCurrent].price;
				this.shopId = this.typesList[this.priceCurrent].id;
			},
			// 检测号码是否可用
			checkPhone(){
				console.log(this.value);
				phoneRechargeTest({
					phoneNum:this.value
				}).then(res=>{
					console.log(res,555)
					if(res.data.code==0){
						this.tips = res.data.data.province+res.data.data.city+res.data.data.operators;
					}else{
						this.tips = res.data.data;
					}
				})
			},
			// 打开话费充值弹窗
			PhoneRecharge(){
				if(this.value==null){
					uni.showToast({
						title:"请输入手机号码",
						icon:"none"
					})
					 return false;
				}
				if(this.$store.getters.accessToken){
					// 旧的购物逻辑
					// this.getVipCard();//获取默认的payIndex
					// this.show = true;
					// 新的购物逻辑
					createCommodityOrder({
						"commodityTempId": this.shopId,
						"account": this.value
					}).then(res=>{
						console.log(res,'创建支付订单');
						if(res.data.code==0){
							uni.navigateTo({
								url:'/pages/address_management/welfareShopOrder/payment/payment?id='+res.data.data
							})
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							})
						}
					})
				}else{
					this.$showModal({
						title: '未认证',
						content: '您未认证，需要认证后才能查看',
						cancelText:"取消",
						cancelColor:"#000000",
						confirmText:"确定",
						confirmColor:"#576b95",
						success: (res) => {
							if (res.confirm) {
								uni.reLaunch({
									url:'/pages/login/login'
								})
							}
						}
					});
				}		
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
			// 付款
			toPaySuccess(){
				if(this.value==null){
					uni.showToast({
						title:"请输入手机号码",
						icon:"none"
					})
					 return false;
				}
				this.loading = true;
				phoneRecharge({
					"phoneNum": this.value,
					"price": this.price,
					"cardId": this.payIndex
				}).then(res=>{
					console.log(res,55);//话费充值后台存在问题，余额不够也能充值成功
					this.loading = false;
					if(res.data.code==0){
						// 支付成功
						uni.navigateTo({
							url:'/pages/paySuccess/paySuccess?info=' + encodeURIComponent(JSON.stringify(res.data.data))
						})
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
<style lang="scss">
	.telephoneCharge{
		position: relative;
		.content{
			width: 100%;
			// height: 840rpx;		
			background: #FFFFFF;
			margin-top: 20rpx;
			.phoneNum{
				height: 120rpx;
				// width: 100%;
				border-bottom: 1px solid #eee;
				padding: 36rpx 30rpx;
				.uni-input{			
					font-size: 64rpx;
					font-family: Helvetica;
					color: #333333;
					line-height: 76rpx;
				}
				.operator{	
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-left: 4rpx;
				}
			}
			.tabBox{
				padding:0 30rpx;
				height: 100rpx;
				/deep/ .v-tabs__container-item{
					width: 50%;
					justify-content: center;
				}
			}
			.types{
				display: flex;
				padding: 0 30rpx;
				justify-content: space-between;
				flex-wrap: wrap;
				padding-bottom: 30rpx;
				.type{
					margin-top: 30rpx;
					width: 216rpx;
					height: 144rpx;
					background: #F2F2F2;
					border-radius: 4px;
					box-sizing: border-box;
					&.active{
						border: 1px solid #D71507;
						.number {
							color: #D71507 !important;
						}
						.unit {
							color: #D71507;
						}
					}	
					.type-t{
						text-align: center;
						margin-top: 10rpx;
						.number{		
							font-size: 26px;
							font-family: DINAlternate-Bold, DINAlternate;
							font-weight: bold;
							color: #333333;
						}
						.unit{
							font-size: 14px;
						}
					}
					.type-b{	
						margin-top: 10rpx;
						text-align: center;
						font-size: 13px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
			}
		}
		.tips{	
			padding: 30rpx;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
		}
		.recharge{
			position: fixed;
			bottom: 60rpx;
			left: 50%;
			transform: translateX(-50%);
			padding: 0 30rpx;
			width: calc(100% - 60rpx);
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.zixun{
				width: 70rpx;
				height: 100rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content:center;
				image{
					width: 56rpx;
					height: 56rpx;
				}
				.text{	
					font-size: 11px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
			}
			.btn{
				width: 600rpx;
				height: 100rpx;
				background: #D71507;
				box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
				border-radius: 20rpx;
				text-align: center;
				line-height: 100rpx;	
				font-size: 34rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
			}
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
