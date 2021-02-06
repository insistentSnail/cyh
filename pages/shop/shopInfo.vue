<template>
	<view class="shopInfo">
		<view class="shopContent">
			<view class="shopImg">
				<image :src="shopInfo.imgUrl" mode=""></image>
			</view>
			<view class="shopName">
				<view class="name">
					{{shopInfo.name}}
				</view>
		<!-- 		<view class="info">
					{{shopInfo.desc}}
				</view> -->
				<view class="price">
					<view class="currentPrice">
						¥ {{shopInfo.price}}
					</view>
					<view class="originalPrice">
						原价：¥ {{shopInfo.originalPrice}}
					</view>
				</view>
			</view>
			<view class="shopNum">
				<view class="saleNum">
					已售{{shopInfo.salesVolume}}件
				</view>
				<view class="stock">
					库存{{shopInfo.stock}}件
				</view>
			</view>
		</view>
		
		<view class="line">
			
		</view>
		
		<view class="desc" v-html="shopInfo.desc">
			
		</view>
		
		<view class="btnBox">
			<view class="zixun" @click="toFeedBack">
				<image src="../../static/shop/zixun.png" mode=""></image>
				<view class="text">
					客服
				</view>
			</view>
			<view class="btn" @click="intoOrder">
				立即购买
			</view>
		</view>
		<!-- 安卓和苹果用原生的模态框样式不一致 -->
		<show-modal></show-modal>
	</view>
</template>

<script>
	import {getShopInfo,GetExpressTips} from '@/api/shop/shop.js'
	export default {
		data() {
			return {
				shopInfo:{},
				msg:"",
				isShow:false
			};
		},
		onLoad(event) {
			// this.info = JSON.parse(decodeURIComponent(event.info));
			// if(event.index==1){
			// 	uni.setNavigationBarTitle({
			// 		title: '数字商城' //这是修改后的导航栏文字
			// 	})
			// }
			GetExpressTips().then(res=>{
				console.log(res,"提示物流信息");
				this.isShow = res.data.data.isShow;
				this.msg = res.data.data.msg;
			})
			
			getShopInfo({
				id:event.id
			}).then(res=>{
				console.log(res,"商品详情");
				this.shopInfo = res.data.data;	
				console.log(event.index,'商城名称');
				if(event.index!='undefined'){
					uni.setNavigationBarTitle({
						title: event.index //这是修改后的导航栏文字
					})
				}else{
					uni.setNavigationBarTitle({
						title: '商城' //这是修改后的导航栏文字
					})
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
			intoOrder(){
				 // this.$showModal({
					//   title: '',
					//   content: this.msg,
					//   cancelText:"取消",
					//   cancelColor:"#000000",
					//   confirmText:"确定",
					//   confirmColor:"#576b95",
					//   success:res=> {
					// 	  if (res.confirm) {
					// 		console.log('用户点击确定');
							// 已认证的用户
							if(this.$store.getters.accessToken){
								// 跳转福利商城订单页 需要地址
								if(this.shopInfo.commodityTempType==0){
									if(this.isShow){
										this.$showModal({
											  title: '',
											  content: this.msg,
											  cancelText:"取消",
											  cancelColor:"#000000",
											  confirmText:"确定",
											  confirmColor:"#576b95",
											  success:res=> {
												  if (res.confirm) {
													console.log('用户点击确定');
													uni.navigateTo({
														url:'../address_management/welfareShopOrder/welfareShopOrder?id='+this.shopInfo.id
													})
												} else if (res.cancel) {
													console.log('用户点击取消');
													}
												}
											});	
									}else{
										uni.navigateTo({
											url:'../address_management/welfareShopOrder/welfareShopOrder?id='+this.shopInfo.id
										})
									}		
								}
								// 跳转数字商城订单页 不需要地址
								if(this.shopInfo.commodityTempType==1){
									  uni.navigateTo({
										url:'../address_management/address_management?id='+this.shopInfo.id
									  })
								}	
								//跳转光汇商城订单页
								if(this.shopInfo.commodityTempType==8){
									  uni.navigateTo({
										url:'/pages/gasShop/bugGasShop/bugGasShop?id='+this.shopInfo.id
									  })
								}	
							}else{
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
									// appStore审核用
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
							}
						
							  
						  // } else if (res.cancel) {
							 //  console.log('用户点击取消');
						  // }
					 //  }
				  // });
			},
		}
	}
</script>

<style lang="scss" scoped>
	.shopInfo{
		padding-bottom: 248rpx;
		.shopContent{
			width: 100%;
			// height: 1050rpx;
			background: #fff;
			.shopImg{
				width: 100%;
				height: 750rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1px solid #eee;
				image{
					width: 100%;
					height: 100%;
					// width: 520rpx;
					// height: 520rpx;
				}
			}
			.shopName{
				overflow: hidden;
				// height: 224rpx;
				padding-bottom: 30rpx;
				margin: 0 auto;
				width:calc(100% - 60rpx);
				border-bottom: 1px solid #eee;
				.name{
					margin-top: 20rpx;
					font-size: 17px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					line-height: 24px;
					// overflow: hidden;
					// text-overflow:ellipsis;
					// white-space: nowrap;
				}
				.info{
					margin-top: 14rpx;
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.price{
					display: flex;
					align-items: center;
					margin-top:28rpx;
					.currentPrice{
						font-size: 22px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #D71507;
					}
					.originalPrice{	
						margin-left: 16rpx;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
			}
			.shopNum{
				display: flex;
				padding: 0 30rpx;
				height: 72rpx;
				align-items: center;
				justify-content: space-between;
				.saleNum{	
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #666666;
				}
				.stock{
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #666666;
				}
			}
		}
		.line{
			width: 100%;
			height: 8px;
			background: #F6F6F6;
		}
		.desc{
			padding: 30rpx;
			/deep/ img{
				width: 100%;
			}
		}
		.btnBox{
			z-index: 99999;
			background: #fff;
			width: calc(100% - 60rpx);
			height: 188rpx;
			position: fixed;
			bottom: 0;
			box-shadow: 0px -4px 8px 0px rgba(204, 204, 204, 0.25);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
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
