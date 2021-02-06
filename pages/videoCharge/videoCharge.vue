<template>
	<view class="videoCharge">
		
		<view class="videoType">
			<view class="tabbar">
				<view :class="tabIndex===index?'tabbarList active':'tabbarList'" v-for="(item,index) in tabbarList" :key="index" @click="tabSwitch(index, item.id)">
					<image :src="item.imgUrl" mode=""></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			
			<view class="tabCon" v-if="tabIndex==0">
				<view class="tabCon-t">
					<view class="tabTitle">
						爱奇艺视频账号
					</view>
					<input type="number" class="uni-input" v-model="value" placeholder="请输入账号"/>
				</view>
				
				<view class="tip">
					新会员充值成功后会自动为您注册账号
				</view>
			</view>
			
			<view class="tabCon" v-if="tabIndex==1">
				<view class="tabCon-t">
					<view class="tabTitle">
						腾讯视频账号
					</view>
					<input type="number" class="uni-input" v-model="value" placeholder="请输入账号"/>
				</view>
				
				<view class="tip">
					新会员充值成功后会自动为您注册账号
				</view>
			</view>
			
			<view class="tabCon" v-if="tabIndex==2">
				<view class="tabCon-t">
					<view class="tabTitle">
						优酷视频账号
					</view>
					<input type="number" class="uni-input" v-model="value" placeholder="请输入账号"/>
				</view>
				
				<view class="tip">
					新会员充值成功后会自动为您注册账号
				</view>
			</view>
		</view>
		<!-- 选择会员套餐 -->
		<view class="chooseVip">
			<view class="title">
				选择会员套餐
			</view>
			<view class="vipTabs">
				<view :class="vipIndex==index?'vipTab active':'vipTab'" v-for="(item,index) in vipTabLists"
				@click="vipSwitch(index, item.name)"
				 :key="index">
					<image v-show="item.imgUrl" :src="item.imgUrl" mode=""></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<!-- 会员套餐内容部分 -->
			<view class="vipContent">
				<view class="labels">
					<view class="label">
						广告特权
					</view>
					<view class="label">
						院线新片
					</view>
					<view class="label">
						热剧抢险看
					</view>
					<view class="label">
						独家综艺
					</view>
				</view>

				<!-- 横向滚动 -->
				<view class="level">
					<scroll-view scroll-x="true">  
					    <view :class="levelIndex==index?'vipLevel active':'vipLevel'" v-for="(item,index) in levelLists"
						 :key="index"
						 @click="levelSwitch(index, item)">
							<view class="vip-t">
								{{item.spzcCardName}}
							</view>
							<view class="vip-price">
								市场价 ¥{{item.price}}
							</view>
					    </view>    							 
					</scroll-view>
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
			<view class="btn" @click="handleCharge">
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
					<text class="num">{{aimVip.price}}</text>
				</view>
				<view class="orderMsg">
					<view class="msg-l">
						订单信息
					</view>
					<view class="msg-r">
						视频会员充值
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
	import { getSPZCRechargeCommodityClass } from '@/api/home/home'
	import { getShopLists, buyCoupon,createCommodityOrder } from '@/api/shop/shop'
	import { getPayCardInfo, changePayModel} from "@/api/vip/vip.js"
	
 	export default {
		onLoad () {
			// this.getVipCard();
			getSPZCRechargeCommodityClass().then(res => {
				if (res.data.code === 0) {
					this.tabbarList = res.data.data
					if (this.tabbarList.length) {
						this.getLists()
					}
				}
			})
			
		},
		data() {
			return {
				value: '',
				cardList: [],
				tabbarList:[],
				tabIndex:0,
				vipTabLists:[],
				vipIndex:0,
				levelLists:[],
				// levelIndex:0,
				levelIndex:null,
				tempArray: [],
				show:false,
				typeShow:false,
				aimVip: '',
				payType:[],
				payIndex: undefined,
				loading:false,
				shopId:null
			};
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
				buyCoupon({id: this.aimVip.id, cardId: this.payIndex, account: this.value}).then(res => {
					console.log(res,'视频充值');
					this.loading = false
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
			},
			paySwitch(id){
				this.payIndex = id;
				changePayModel({
					'cardId':this.payIndex
				}).then(res=>{
					console.log(res,'选择扣款方式');
				})
			},
			openTypeShow(){
				this.typeShow=true;
				this.getVipCard();
			},
			handleCharge () {
				if (!this.value) {
					uni.showToast({
						title: '请输入您的账号',
						icon: 'none'
					})
					return false
				}
				if(this.levelIndex==null){
					uni.showToast({
						title: '请选择会员套餐',
						icon: 'none'
					})
					return false
				}
				if(this.$store.getters.accessToken){
					// 旧的购物逻辑
					// this.getVipCard();
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
						title: '未登录',
						content: '您未登录，需要登录后才能查看',
						cancelText:"取消",
						cancelColor:"#000000",
						confirmText:"确定",
						confirmColor:"#576b95",
						success: (res) => {
							if (res.confirm) {
								uni.reLaunch({
									url:'/pages/wxLogin/wxLogin'
								})
							}
						}
					});
				}			
			},
			getVipCard(){
				getPayCardInfo().then(res=>{
					console.log(res,'获取会员卡信息');
					this.payIndex = res.data.data.selectedCardId;
					this.payType = res.data.data.cardBalances;		
				})
			},
			getLists () {
				getShopLists({ type: 5 }).then(res => {
					if (res.data.code === 0) {
						this.cardList = res.data.data
						this.chooseStyle(this.tabbarList[0].id)
					}
				})
			},
			chooseStyle(id) {
				this.tempArray = this.cardList.filter(item => item.spzcCommodityClassId === id)
				this.vipTabLists = this.tempArray.reduce((prev, item) => {
					if (prev.findIndex(i => i.name === item.spzcvipName) === -1 && item.spzcvipName) {
						prev.push({name: item.spzcvipName, imgUrl: item.spzcImgUrl})
					}
					return prev
				}, [])
				if (this.vipTabLists.length) {
					this.chooseContent(this.vipTabLists[0].name)
				}
			},
			chooseContent(name) {
				this.levelLists = this.tempArray.filter(item => item.spzcvipName == name)
				if (this.levelLists.length) {
					this.aimVip = this.levelLists[0]
				}
			},
			tabSwitch(index, id){
				this.tabIndex = index;
				this.vipIndex = 0;
				this.value = "";
				// this.levelIndex = 0;
				this.levelIndex = null;
				this.chooseStyle(id)
			},
			vipSwitch(index, name){
				this.vipIndex = index;
				this.levelIndex = null;
				this.chooseContent(name)
			},
			levelSwitch(index, item){
				console.log(item,'id',index)
				this.shopId = item.id;//商品id
				this.aimVip = item
				this.levelIndex = index
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
	.videoCharge{
		.videoType{
			height: 338rpx;		
			background: #FFFFFF;
			margin-top: 20rpx;
			padding:0 30rpx;
			overflow: hidden;
			.tabbar{
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;
				.tabbarList{
					display: flex;
					align-items: center;
					&.active{
						image{
							width: 72rpx;
							height: 72rpx;
						}
						text{					
							font-size: 22px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
					}
					image{
						width: 48rpx;
						height: 48rpx;
					}
					text{				
						font-size: 16px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						margin-left: 10rpx;
					}
				}
			}
			.tabCon{
				.tabCon-t{
					height: 130rpx;
					border-bottom: 1px solid #eee;
					display: flex;
					align-items: center;
					.tabTitle{		
						height: 100%;
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						margin-right: 26rpx;
						display: flex;
						align-items: center;
						min-width: 270rpx;
					}
					.uni-input{		
						height: 100%;
						font-size: 16px;
						font-family: Helvetica;
						color: #333333;
					}
				}
				.tip{				
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-top: 24rpx;
				}
			}
		}
		.chooseVip{
			margin-top: 24rpx;
			width: 100%;
			height: 482rpx;
			background: #FFFFFF;
			overflow: hidden;
			.title{	
				margin-top: 30rpx;
				padding: 0 30rpx;
				font-size: 16px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			.vipTabs{
				height: 120rpx;
				padding: 0 30rpx;
				display: flex;
				.vipTab{
					height: 120rpx;
					width: 50%;
					display: flex;
					align-items: center;
					justify-content: center;	
					&.active{
						border-bottom: 4rpx solid #D71507;
						image{
							width: 54rpx;
							height: 54rpx;
						}
						text{					
							font-size: 20px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
					}
					image{
						width: 46rpx;
						height: 46rpx;
					}
					text{
						margin-left: 10rpx;				
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #999999;
					}
				}
			}
			.vipContent{
				.labels{
					display: flex;
					padding: 30rpx;
					.label{
						padding: 4px 6px;			
						background: #F6EFEF;
						border-radius: 2rpx;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #D71507;
						margin-right: 16rpx;
					}
				}
				.level{
					padding: 0 30rpx;
					height: 148rpx;
					white-space: nowrap;//scroll-view的外层元素需要
					.vipLevel{
						display: inline-block;//scroll-view的内层view元素需要
						width: 198rpx;
						height: 144rpx;
						background: #F2F2F2;
						border-radius: 8rpx;
						margin-right: 20rpx;
						&.active{		
							border: 1px solid #72B830;
							.vip-price{
								color: #72B830;
							}
						}
						.vip-t{				
							font-size: 18px;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: #333333;
							text-align: center;
							margin: 28rpx 0 6rpx;
						}
						.vip-price{		
							font-size: 13px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							text-align: center;
						}
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
	}
</style>
