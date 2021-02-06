<template>
	<view class="myOrder">
		<view class="tabBox">
			<view class="tabBox-c">
				<v-tabs height="96rpx" color="#999"
				activeColor="#D71507"
				fontSize="30rpx"
				lineColor="#D71507"
				lineHeight="4rpx"
				lineRadius="4rpx"
				:lineScale="1"
				 v-model="tabIndex" :tabs="tabs" @change="changeTab"></v-tabs>
			</view>
		</view>
<!-- 		<view class="shopTypes">
			<view :class="typeIndex==index?'shopType active':'shopType'" v-for="(item,index) in shopLists" 
			@click="typeSwitch(index)"
			:key="index">
				{{item}}
			</view>
		</view> -->
		
		<view class="orderLists">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
				<view class="orderList" v-for="(item,index) in orderLists"
				 :key="index">
				 <!-- 倒计时为0要取消订单 -->
				 <!-- 未支付且倒计时不为0和已支付的订单 -->
				 <block v-if="(item.payStatus==0&&item.timeOutSecond!=0)||item.payStatus!=0">
					<view class="box">
						<view class="orderList-t">
							<!-- <view class="title-l">
								<image :src="item.shopGroupImgUrl" mode=""></image>
								<text>{{item.shopGroupName}}</text>
							</view> -->
							<view class="orderNum">
								订单号：{{item.orderId}}
							</view>
							<view class="status">
								{{item.statusStr}}
							</view>
						</view>
						
						<!-- 未支付的倒计时 -->
						<view class="countDown" v-if="item.payStatus==0">
							<image src="../../../static/my/djs.png" mode=""></image>
							<view class="text">
								将于<u-count-down :timestamp="item.timeOutSecond"></u-count-down>后自动取消
							</view>
						</view>
					</view>
			
						
					<view class="orderList-c" v-for="(ele,i) in item.commodityPackages">
						<view class="content-l">
							<image :src="ele.imgUrl" mode=""></image>
						</view>
						<view class="content-r">
							<view class="p1">
								<view class="name">
									{{ele.name}}
								</view>
								<view class="num">
									x{{ele.itemAmmount}}
								</view>
							</view>
							<view class="p2">
								下单时间：{{ele.creationTime}}
							</view>
							<view class="p3" v-if="ele.price">
								¥{{ele.price}}
							</view>
						</view>
					</view>
					
				<!-- 	<view class="orderList-c">
						<view class="content-l">
							<image :src="item.commodityTempImgUrl" mode=""></image>
						</view>
						<view class="content-r">
							<view class="p1">
								<view class="name">
									{{item.commodityTempName}}
								</view>
								<view class="num">
									x1
								</view>
							</view>
							<view class="p2">
								消费时间：{{item.creationTime}}
							</view>
							<view class="p3" v-if="item.payAmmount">
								¥{{item.payAmmount}}
							</view>
						</view>
					</view> -->
					
					<!-- 已支付 -->
					<view class="orderList-b" v-if="item.payStatus==1">
					<!-- 	<view class="orderNum">
							订单号：{{item.orderId}}
						</view> -->
						<view class="btn" v-if="item.commodityTempType==0&&item.perfectEntityExpress" @click="toMyLogistics(item.id)">
							查看物流
						</view>
						<view class="btn" v-if="item.commodityTempType==1" @click="replaceID(item)">
							去使用
						</view>
					</view>
					
					<!-- 未支付 -->
					<view class="orderList-b" v-if="item.payStatus==0">
					<!-- 	<view class="orderNum">
							订单号：{{item.orderId}}
						</view> -->
						<view class="box">
							<view class="btn" @click="cancelOrder(item.id)">
								取消订单
							</view>
							<view class="btn" 
							@click="toPayment(item.id)"
							style="border:1px solid #D71507;color:#D71507;margin-left:8rpx;">
								去支付
							</view>
						</view>
					</view>
				</block>	
				</view>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	import {getOrderLists,getOrderInfo,replaceId} from '@/api/my/my.js'
	import {closeCommodityOrder2} from '@/api/shop/shop.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				tabs: ['全部订单','待支付','未发货', '已发货'],
				tabIndex:0,
				// shopLists:['福利商城','数字商城','苏宁商城','京东商城'],
				// typeIndex:0,
				// 下拉刷新的配置(可选, 90%的情况无需配置)
				downOption: { 
					
				},
					// 上拉加载的配置(可选, 90%的情况无需配置)
				upOption: {
					page: {
						size:20 // 每页数据的数量,默认10
					},
					noMoreSize: 5,	 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
									// 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
									// 这就是为什么无更多数据有时候不显示的原因
					empty: {
						tip: '暂无相关数据'
					},
					textNoMore:'别拽了，到底啦'
				},
				orderLists:[]
			};
		},
		onLoad() {
			this.mescroll.resetUpScroll();
		},
		// 防止点击返回按钮 反复回退
		onBackPress(event){
			uni.redirectTo({
				url:'../my'
			});
			this.$store.commit('switchTab2',5);//统一跳我的页面
			return true;
		},
		methods:{
			// 去支付
			toPayment(id){
				uni.navigateTo({
					url:'/pages/address_management/welfareShopOrder/payment/payment?id='+id
				})
			},
			// 取消订单
			cancelOrder(id){
				closeCommodityOrder2({
					id:id
				}).then(res=>{
					console.log(res,"取消订单");
					uni.showToast({
						title:"取消订单成功",
						icon:"none"
					})
					this.mescroll.resetUpScroll();
				})
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				console.log(page,'page');
				getOrderLists({
					  page: page.num,
					  Status:this.tabIndex==0?4:this.tabIndex
					  // type:this.typeIndex,
					  // ExpressType:this.tabIndex-1 
				}).then(res=>{	
					if(page.num == 1){
						this.orderLists = []; //如果是第一页需手动置空列表
					}
					this.orderLists = this.orderLists.concat(res.data.data); //追加新数据
					console.log(this.orderLists,'this.orderLists')
					this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
				})
			},
			// tab切换
			changeTab(index) {
				console.log('当前选中的项：' + index)
				this.tabIndex = index;
				this.mescroll.resetUpScroll();
			},
			// typeSwitch(index){
			// 	this.typeIndex = index;
			// 	this.mescroll.resetUpScroll();
			// },
			// 查看物流
			toMyLogistics(id){
				console.log(id,'id')
				uni.navigateTo({
					url:'../myLogistics/myLogistics?orderId='+id
				})
			},
			// 置换id 并且跳转卡券详情页
			replaceID(item){
				replaceId({
					id:item.id
				}).then(res=>{
					console.log(res,'换取的id');
					uni.navigateTo({
						url:'/pages/myCards/cardInfo/cardInfo?id='+res.data.data
					})
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #f6f6f6;
	}
</style>
<style lang="scss" scoped>
	.myOrder{
		overflow: hidden;
		.tabBox{
			width: calc(100% - 80rpx);
			height: 96rpx;
			padding: 0 40rpx;
			position: fixed;
			z-index: 9999;
			background: #fcfcfc;
			box-shadow: 0px 2px 10px 0px rgba(169, 169, 169, 0.18);
			.tabBox-c{
				width: 100%;
				/deep/ .v-tabs__container{
					background: #fcfcfc!important;
				}
				/deep/ .v-tabs__container-item{
					width: 25%;
					justify-content: center;
				}
			}
		}
		.shopTypes{
			width: calc(100% - 60rpx);
			padding: 24rpx 30rpx;
			position: fixed;
			top: 96rpx;
			z-index: 99999;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #f6f6f6;
			.shopType{
				width: 164rpx;
				height: 64rpx;
				background: #E8E8E8;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				justify-content:center;
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				&.active{	
					color: #D71507;
					background: #F7E4E3;
				}
			}
		}
		.orderLists{
			overflow: hidden;
			padding: 0 30rpx;
			// margin-top:212rpx;
			margin-top:116rpx;
			.orderList{
				width: 642rpx;
				margin:0 auto 24rpx;
				// height: 400rpx;
				background: #FFFFFF;
				box-shadow: 0px 8rpx 24rpx 0px rgba(169, 169, 169, 0.14);
				border-radius: 12rpx;
				padding: 0 24rpx;
				.box{
					.countDown{
						width: calc(100% - 40rpx);
						height: 74rpx;
						background: #F6F6F6;
						border-radius: 10rpx;
						display: flex;
						align-items: center;
						padding: 0 20rpx;
						margin-bottom: 30rpx;
						image{
							width: 28rpx;
							height: 28rpx;
							margin-right: 8rpx;
						}
						.text{
							font-size: 12px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
							/deep/ .u-countdown-item{
								background: #F6F6F6!important;
								.u-countdown-time{
									color:#D71507!important;
									font-size: 12px!important;
									font-family: PingFangSC-Medium, PingFang SC;
									font-weight: 500;
								}
							}
							/deep/ .u-countdown-colon{
								color:#D71507!important;
								font-size: 12px!important;
								font-family: PingFangSC-Medium, PingFang SC;
								font-weight: 500;
							}
						}
					}
					border-bottom: 1px solid #eee;
				}
				.orderList-t{
					height: 104rpx;
					// border-bottom: 1px solid #eee;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.title-l{
						display: flex;
						align-items: center;
						image{
							width: 36rpx;
							height: 36rpx;
							margin-right: 16rpx;
						}
						text{
							font-size: 16px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
					}
					.status{	
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
				.orderList-c{
					// height: 206rpx;
					border-bottom: 1px solid #eee;
					display: flex;
					align-items: center;
					padding:30rpx 0;
					.content-l{
						width: 160rpx;
						height: 160rpx;
						image{
							width: 160rpx;
							height: 160rpx;
						}
					}
					.content-r{
						width: 100%;
						// height: 160rpx;
						margin-left: 20rpx;
						.p1{
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							.name{		
								width:380rpx;
								font-size: 15px;
								font-family: PingFangSC-Medium, PingFang SC;
								font-weight: 500;
								color: #333333;
								// overflow: hidden;
								// text-overflow:ellipsis;
								// white-space: nowrap;
							}
							.num{	
								font-size: 12px;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #999999;
							}
						}
						.p2{	
							margin-top: 10rpx;
							font-size: 12px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
						}
						.p3{	
							font-size: 14px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #D71507;
							margin-top: 40rpx;
						}
					}
				}
				.orderList-b{
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					.box{
						display: flex;
						align-items: center;
						border-bottom: none;
					}
					.orderNum{	
						font-size: 13px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #333333;
					}
					.btn{
						width: 144rpx;
						height: 48rpx;
						border-radius: 24rpx;
						border: 1px solid #CCCCCC;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #666666;
					}
				}
			}
		}
	}
</style>
