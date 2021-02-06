<template>
	<view class="vip">
		<view class="banner">		
		</view>
		<view class="member">
			<view class="title">
				会员码
			</view>
			<view class="ewm" @click="tabbar">
				<image :src="imgSrc" mode=""></image>
			<!-- 	 <tki-qrcode
				    ref="qrcode"
				    :val="val"
				    :size="size"
				    :background="background"
				    :foreground="foreground"
				    :pdground="pdground"
				    :icon="icon"
				    :iconSize="iconsize"
					:loadMake="loadMake"
					:onval="onval"
				     /> -->
					 
			</view>
			<view class="tip">
				每20S自动刷新，点击会员码也可刷新
			</view>
			<view class="line">		
			</view>
			<view class="tab">
				<view class="record" @click="toConsumRecord">
					<image src="../../static/vip/record.png" mode=""></image>
					<text>消费记录</text>
				</view>
				<view class="set" @click="openVipCard">
					<image src="../../static/vip/set.png" mode=""></image>
					<text>消费设置</text>
				</view>
				
			</view>
		</view>
		
		<view class="scan" @click="openScan">
			<view class="scan-l">
				<image src="../../static/vip/scan.png" mode=""></image>
				<text>扫码付</text>
			</view>
			<view class="scan-r">
				<image src="../../static/my/toright.png" mode=""></image>
			</view>
		</view>
		<!-- uView的弹出层 -->
		<u-popup v-model="show" mode="bottom" border-radius="32">
			<view class="pop">
				<view class="title">
					扣款设置
				</view>
				<view class="choose">
					<view :class="payIndex==item.id?'fp active':'fp'" v-for="(item,index) in payType" 
					@click="paySwitch(item.id)"
					:key="item.id">
						<view class="fp-l">
							<text class="one">优先使用{{item.name}}</text>
							<text class="two">（剩余：¥{{item.balanceStr}}）</text>
						</view>
						<view class="fp-r">
							<image v-show="payIndex==item.id" src="../../static/vip/true.png" mode=""></image>
						</view>
					</view>
					<!-- 支付宝支付 -->
			<!-- 		<view :class="payIndex==3?'fp active':'fp'" @click="paySwitch(3)">
						<view class="fp-l" style="display: flex;align-items: center;">
							<image style="width: 52rpx;height: 52rpx;" src="../../static/vip/zfb.png" mode=""></image>
							<text class="one" style="margin-left: 10rpx;">支付宝支付</text>
						</view>
						<view class="fp-r">
							<image v-show="payIndex==3" src="../../static/vip/true.png" mode=""></image>
						</view>
					</view> -->
				</view>
				
				<view class="payBtn" @click="payBtn">
					确认
				</view>
			</view>
		</u-popup>
		<tab-bar></tab-bar>	
		
		<show-modal></show-modal>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import {getVipCode,getPayCardInfo,changePayModel,testAppPay} from "@/api/vip/vip.js"
	export default {
		data() {
			return {
				// val:"",
				// size:490,
				// background:'#fff',
				// foreground:'#000',
				// pdground:'#000',
				// icon:"../../static/vip/loginLogo.png",
				// iconsize:48,
				// onval:true,
				// loadMake:true,
				show:false,//底部弹出层
				payType:[],
				payIndex:null,
				timer:null,
				imgSrc:''
			}
		},
		components: {tkiQrcode},
		onLoad() {
			if(!this.$store.getters.accessToken){
				// 重新微信授权
				this.$store.dispatch('LogOut')	
				// TODO: 跳转登录
				if(this.$store.getters.status==1){
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
									url:'/pages/testLogin/testLogin'
								})
							}
						}
					});
				}
			}else{
				this.tabbar();
				this.timer = setInterval(()=>{ 
					this.tabbar();
				}, 20000);
				
				this.getVipCard();
			}
		},
		onUnload(){
			clearInterval(this.timer)
		},
		methods: {
			// 获取会员卡信息
			getVipCard(){
				getPayCardInfo().then(res=>{
					console.log(res,'获取会员卡信息');
					this.payIndex = res.data.data.selectedCardId;
					this.payType = res.data.data.cardBalances;		
				})
			},
			openVipCard(){
				if(this.$store.getters.accessToken){
					this.getVipCard();
					this.show = true;
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}
			},
			// 切换二维码
			tabbar(){
				if(this.$store.getters.accessToken){
					getVipCode().then(res=>{
						console.log(res,'二维码');
						uni.showLoading({
						    title: '加载中'
						});	
					this.imgSrc = 	'https://jdzbzh.jxtobacco.gov.cn/profile/createBarcode?value='+res.data.data+'&codeType=1&height=200&width=200'
						setTimeout(() =>{
						    uni.hideLoading();
						}, 1000);
						// this.val = res.data.data;
					}) 
				}	
			},
			// 扫码
			openScan(){
				
				if(this.$store.getters.accessToken){
					uni.scanCode({
					    onlyFromCamera: true,
					    success: function (res) {
					        console.log('条码类型：' + res.scanType);
					        console.log('条码内容：' + res.result);
							if(res.result.indexOf("merchantCode")!=-1){
								uni.redirectTo({
									url:'/pages/payment/payment?code='+res.result
								})
							}else{
								uni.showToast({
									title:"此商家二维码格式不正确",
									icon:"none"
								})
							}			
					    }
					});
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}
			},
			paySwitch(id){
				this.payIndex = id;
				// if(id==3){
				// 	testAppPay().then(res=>{
				// 		console.log(res.data.data.body,'支付宝订单');
				// 		uni.requestPayment({
				// 			provider: 'alipay',
				// 			orderInfo: res.data.data.body, 
				// 			success: res=>{
				// 				console.log('success:' + JSON.stringify(res));
				// 			},
				// 			fail: err=>{
				// 				console.log('fail:' + JSON.stringify(err));
				// 			}
				// 		});
				// 	})
				// }
			},
			// 扣款选择
			payBtn(){
				changePayModel({
					'cardId':this.payIndex
				}).then(res=>{
					console.log(res,'选择扣款方式');
					this.tabbar();
					this.show = false;
				})
			},
			// 消费记录
			toConsumRecord(){
				// 这里用uni.navigateTo跳转会出现下一个页面会出现一直在加载二维码的问题
				if(this.$store.getters.accessToken){
					// uni.redirectTo({
					// 	url:'/pages/consumRecord/consumRecord'
					// })
					uni.navigateTo({
						url:'/pages/my/myBill/myBill?index=0'
					})
				}else{
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
				}
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
.vip{
	position: relative;
	padding-bottom: 240rpx;
	overflow: hidden;
	// 底部弹出层
	.pop{
		padding-bottom: 40rpx;
		overflow: hidden;
		.title{
			margin-top: 40rpx;
			padding-left:40rpx;
			font-size: 15px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
		}
		.choose{
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
						background: #F6962E;
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
		.payBtn{
			margin: 120rpx auto 0;
			width: 690rpx;
			height: 100rpx;
			background: #D71507;
			box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
			border-radius: 20rpx;		
			font-size: 34rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.banner{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 494rpx;
		background: url(../../static/vip/banner.png) no-repeat;
		background-size: 100% 100%;
	}
	.member{
		position: relative;
		z-index: 999;
		width: 610rpx;
		height: 860rpx;
		overflow: hidden;
		margin: 372rpx auto 0;
		background: #FFFFFF;
		box-shadow: 0px 4px 14px 0px rgba(190, 190, 190, 0.28);
		border-radius: 10px;
		padding: 0 30rpx;
		.title{	
			font-size: 18px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			text-align: center;
			margin-top: 60rpx;
		}
		.ewm{
			width: 490rpx;
			height: 490rpx;
			margin: 40rpx auto 0;
			image{
				width: 490rpx;
				height: 490rpx;	
			}
		}
		.tip{
			margin-top: 28rpx;
			text-align: center;
			font-size: 12px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
		}
		.line{
			width: 100%;
			height: 1px;
			background: #eee;
			margin-top: 60rpx;
		}
		.tab{
			height: 44rpx;
			width: 490rpx;
			margin: 30rpx auto 0; 
			display: flex;
			align-items: center;
			justify-content: space-between;
			.record{
				height: 44rpx;
				display: flex;
				align-items: center;
				image{
					width: 40rpx;
					height: 42rpx;
				}
				text{		
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					margin-left: 16rpx;
				}
			}
			.set{
				height: 44rpx;
				display: flex;
				align-items: center;
				image{
					width: 42rpx;
					height: 36rpx;
				}
				text{
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					margin-left: 16rpx;
				}
			}
		}
	}
	.scan{
		margin: 24rpx auto 0;
		width: 610rpx;
		height: 112rpx;
		background: #FFFFFF;
		box-shadow: 0px 8rpx 20rpx 0px rgba(190, 190, 190, 0.16);
		border-radius: 20rpx;
		padding:0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.scan-l{
			display: flex;
			align-items: center;
			image{
				width: 40rpx;
				height: 40rpx;
			}
			text{
				margin-left: 14rpx;
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
		}
		.scan-r{
			display: flex;
			align-items: center;
			image{
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
}
</style>
