<template>
	<view class="gasoline">
		<view class="content">
			<view class="img">
				<image src="../../static/shop/shopGas.png" mode=""></image>
			</view>
			<!-- tab切换 -->
			<view class="tabBox">
				<view class="tabInner">
					<v-tabs height="100rpx" color="#333"
					activeColor="#D71507"
					fontSize="34rpx"
					lineColor="#D71507"
					lineHeight="4rpx"
					lineRadius="4rpx"
					:lineScale="1"
					 v-model="tabIndex" :tabs="tabs" @change="changeTab"></v-tabs>
				</view>
			</view>
			
			
			<view class="" v-if="tabIndex==0">
				<!-- 内容 -->
					<view class="gasInput">
						<view class="inputBox">
							<input type="number" class="uni-input" v-model="value" placeholder="请输入19位中石化加油卡卡号" />
						</view>
						<view class="gasIcon">
							<image src="../../static/homePage/gasIcon.png" mode=""></image>
							<view class="gasText">
								加油卡
							</view>
						</view>
					</view>
					
					<view class="cards">
						<view class="card" :class="{'active': type === index}" v-for="(item,index) in typesList" :key="index" @click="switchType(index, item)">		
							<view class="type-t">
								<text class="number">{{item.chargeValue}}</text>
								<text class="unit">元</text>
							</view>
							<view class="type-b">
								售价 {{item.price}}.00元
							</view>
						</view>
					</view>	
			</view>				
		</view>	
				
			<view class="tips" v-if="tabIndex==0">
				本服务为代充值服务，默认不提供发票
			</view>
			
				
			<view class="recharge" v-if="tabIndex==0">
				<view class="zixun" @click="toFeedBack">
					<image src="../../static/shop/zixun.png" mode=""></image>
					<view class="text">
						客服
					</view>
				</view>		
				<view class="btn" @click="handleRecharge">
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
					<text class="num">{{aimCard.chargeValue}}</text>
				</view>
				<view class="orderMsg">
					<view class="msg-l">
						订单信息
					</view>
					<view class="msg-r">
						加油卡充值
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
						<image src="@/static/shop/back.png" mode=""></image>
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
	import { getShopLists,createCommodityOrder } from '@/api/shop/shop'
	import { getPayCardInfo, changePayModel} from "@/api/vip/vip.js"
	import { oilRecharge } from '@/api/home/home'
	export default {
		data() {
			return {
				type: 0,
				tabs: ['中石化', '中石油'],
				tabIndex:0,
				value:"",//卡号
				typesList:[],
				show:false,
				typeShow:false,
				payType:[],
				payIndex: undefined,
				loading:false,
				aimCard: {},
			};
		},
		onLoad () {
			// this.getVipCard();
			getShopLists({type: 6}).then(res => {
				if (res.data.code === 0) {
					this.typesList = res.data.data
					if (this.typesList.length) {
						this.aimCard = this.typesList[0]
					}
				}
				
				
			})
		},
		methods:{
			// 跳转意见反馈页面
			toFeedBack(){
				uni.navigateTo({
					url:'/pages/feedback/feedback'
				})
			},
			toPaySuccess () {
				this.loading = true
				console.log({account: this.value, price: this.aimCard.chargeValue, cardId: this.payIndex})
				oilRecharge({account: this.value, price: this.aimCard.chargeValue, cardId: this.payIndex}).then(res => {
					this.loading = false
					console.log(res,'jiayou')
					if (res.data.code === 0) {
						// 支付成功
						uni.navigateTo({
							url:'/pages/paySuccess/paySuccess?info=' + encodeURIComponent(JSON.stringify(res.data.data))
						})
					} else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			},
			openTypeShow(){
				this.typeShow=true;
				this.getVipCard();
			},
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
			handleRecharge () {
				if (!this.value) {
					uni.showToast({
						title: '请输入您的卡号！',
						icon: 'none'
					})
					return false
				}
				
				if(!(new RegExp("^[0-9]{19}$").test(this.value))){
					uni.showToast({
						title: '请输入正确的卡号！',
						icon: 'none'
					})
					return false
				}
				
				if(this.$store.getters.accessToken){
					// 旧的购物逻辑
					// this.getVipCard();
					// this.show = true
					// 新的购物逻辑
					createCommodityOrder({
						"commodityTempId": this.aimCard.id,
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
						title: '未登录',
						content: '您未登录，需要登录后才能查看',
						cancelText:"取消",
						cancelColor:"#000000",
						confirmText:"确定",
						confirmColor:"#576b95",
						success: (res) => {
							if (res.confirm) {
								if(this.$store.getters.status==1){
									uni.reLaunch({
										url:'/pages/wxLogin/wxLogin'
									})
								}else{
									uni.reLaunch({
										url:'/pages/testLogin/testLogin'
									})
								}
							}
						}
					});
				}		
			},
			switchType (index, item) {
				this.type = index
				this.aimCard = item
			},
			changeTab(index) {
			   console.log('当前选中的项：' + index)
			   if (index === 1) {
				   uni.showToast({
				   	title: '暂不支持中石油充值',
					icon: 'none'
				   })
				   return
			   }
			   this.tabIndex = index
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
	.gasoline{
		position: relative;
		.content{
			margin-top: 20rpx;
			width: 100%;
			// height: 610rpx;
			background: #FFFFFF;
			.img{
				text-align: center;
				image{
					width: 690rpx;
					height: 280rpx;
				}
			}
			.tabBox{
				height: 100rpx;
				border-bottom: 1px solid #eee;
				.tabInner{
					padding: 0 30rpx;
					/deep/ .v-tabs__container-item{
						width: 50%;
						justify-content: center;
					}
				}
			}
			.gasInput{
				height: 128rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.inputBox{
					width: 600rpx;
					height: 100%;
					border-bottom: 1px solid #eee;
					.uni-input{
						height: 100%;
					}
					.uni-input-placeholder{		
						font-size: 16px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
				.gasIcon{
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					image{
						width: 44rpx;
						height: 44rpx;
					}
					.gasText{			
						font-size: 11px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #D71507;
					}
				}
			}
			.cards{
				padding: 0 30rpx;
				display: flex;
				flex-wrap: wrap;
				padding-bottom: 40rpx;
				// justify-content: space-between;
				.card{
					width: 216rpx;
					height: 144rpx;
					background: #F2F2F2;
					border-radius: 8rpx;
					margin-top: 24rpx;
					margin-left: 20rpx;
					box-sizing: border-box;
					&:nth-child(3n + 1) {
						margin-left: 0;
					}
					&.active {
						border: 2rpx solid #d71507;
						
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
			padding-bottom: 260rpx;
		}
		.recharge{
			z-index: 999;
			background: #F6F6F6;
			position: fixed;
			bottom: 0rpx;
			left: 50%;
			transform: translateX(-50%);
			padding: 0 30rpx;
			padding-bottom: 60rpx;
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
</style>
