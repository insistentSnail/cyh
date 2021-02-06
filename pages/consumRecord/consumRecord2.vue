<template>
	<view class="consumRecord">
		<!-- 头部 -->
		<view class="header">
			<view class="back" @click="toBack">
				<image src="../../static/vip/back.png" mode=""></image>
			</view>
			<view class="headTitle">
				消费记录
			</view>
			<view class="">
				
			</view>
		</view>
		<!-- tab栏 -->
		<view class="tabLists">
			<v-tabs height="100rpx" color="#999"
			activeColor="#D71507"
			fontSize="30rpx"
			lineColor="#D71507"
			lineHeight="4rpx"
			lineRadius="2rpx"
			:lineScale="1"
			 v-model="tabIndex" :tabs="tabs" @change="changeTab"></v-tabs>
		</view>
		<!-- 福票 -->
		<!-- banner -->
		<view class="banner">
			<view class="price">
				<text class="num">{{fan.balance/100}}</text>
				<text class="unit">元</text>
			</view>
			<view class="label">
				我的福票
			</view>
			<view class="right" @click="intoRule">
				福票规则
			</view>
		</view>
			<!-- tab栏 -->
		<view class="welfareTab">
			<v-tabs height="110rpx" color="#999"
			activeColor="#D71507"
			fontSize="30rpx"
			lineColor="#D71507"
			lineHeight="4rpx"
			lineRadius="2rpx"
			:lineScale="1"
			 v-model="welTabIndex" :tabs="welfareTabs" @change="changeWelTab"></v-tabs>
		</view>
	<!-- 下拉刷新组件 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">			
			<view class="conLists">
				<view class="conList" v-for="(item,index) in arr" :key="index">
					<view class="icon">
						<image :src="item.inteValue>0?'../../static/vip/recharge.png':'../../static/vip/consum.png'" mode=""></image>
					</view>
					<view class="conText">
						<view class="conText-c">
							<view class="conText-l">
								<view class="type">
									{{item.cardLogTypeStr}}
								</view>
								<view class="time">
									{{item.creationTime}}
								</view>
							</view>
							<view class="conText-r recharge" v-if="item.inteValue>0">
								+{{item.inteValue/100}}元
							</view>
							<view class="conText-r" v-else>
								{{item.inteValue/100}}元
							</view>
						</view>
					</view>
				</view>						
			</view>
		</mescroll-body>	
	</view>
</template>

<script>
	import {getBaseCardNum,getCardDetail} from '@/api/my/my.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				tabs: ['我的饭票明细','我的福票明细'],
				tabIndex:1,
				// 饭票
				welfareTabs:['全部','收入','支出'],
				welTabIndex:0,
				fan:{},
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
				arr:[],
			};
		},
		onLoad() {
			getBaseCardNum().then(res=>{
				this.fan = res.data.data[1];
				this.mescroll.resetUpScroll();
			})
		},
		methods:{
			intoRule(){
				uni.navigateTo({
					url:'/pages/consumRecord/rule/rule?id=2'
				})
			},
			changeTab(index) {
				console.log('当前选中的项：' + index)
				this.tabIndex = index
				if(index==0){
					uni.redirectTo({
						url:'/pages/consumRecord/consumRecord'
					})
				}
				if(index==1){
					uni.redirectTo({
						url:'/pages/consumRecord/consumRecord2'
					})
				}
			},
			changeWelTab(index){
				this.welTabIndex = index
				this.mescroll.resetUpScroll();
			},
			toBack(){
				uni.redirectTo({
					url:'/pages/vip/vip'
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
				getCardDetail({
					 "cardId": this.fan.id,
					  "page": page.num,
					  "valueFilter": this.welTabIndex	  
				}).then(res=>{			
					if(page.num == 1){
						this.arr = []; //如果是第一页需手动置空列表
					}
					this.arr = this.arr.concat(res.data.data); //追加新数据
					this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.consumRecord{
		overflow: hidden;
		.header{
			width: calc(100% - 48rpx);
			position: fixed;
			z-index: 999;
			height: 48rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 20rpx 0px rgba(169, 169, 169, 0.18);
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 80rpx 24rpx 20rpx;
			.back{
				width: 40rpx;
				height: 40rpx;
				image{
					width: 40rpx;
					height: 40rpx;
				}
			}
			.headTitle{	
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
		}
		.tabLists{
			padding: 0 60rpx;
			background-color: #f5f5f5;
			top: 148rpx;
			height: 100rpx;
			position: fixed;
			z-index: 999;
			width:calc(100% - 120rpx);
			/deep/ .v-tabs__container-item{
				width: 50%;
				justify-content: center;
			}
			/deep/ .v-tabs__container{
				background-color: #f5f5f5!important;
			}
		}
			.banner{
				top: 248rpx;
				overflow: hidden;
				position: fixed;
				z-index: 99999;
				width: 100%;
				height: 256rpx;
				background: url(../../static/vip/recordBanner.png) no-repeat;
				background-size: 100% 100%;
				.price{
					margin-top: 70rpx;
					text-align: center;
					.num{					
						font-size: 36px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #FFFFFF;
					}
					.unit{		
						font-size: 15px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
				.label{	
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					text-align: center;
				}
				.right{
					width: 142rpx;
					height:44rpx;
					background: #C86C00;
					border-radius: 22rpx 0 0 22rpx;
					opacity: 0.59;
					position: absolute;
					top: 24rpx;
					right: 0;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			.welfareTab{
				width:100%;
				position: fixed;
				z-index: 999;
				top: 502rpx;
				height: 110rpx;
				border-bottom: 1px solid #eee;
				// padding: 0 28rpx;
				/deep/ .v-tabs__container-item{
					width: 33.3%;
					justify-content: center;
				}
			}
		.conLists{
			margin-top: 616rpx;
			.conList{
				display: flex;
				height: 154rpx;
				align-items: center;
				.icon{
					width: 72rpx;
					height: 72rpx;
					margin: 0 30rpx;
					image{
						width: 72rpx;
						height: 72rpx;
					}
				}
				.conText{
					width: 100%;
					height: 154rpx;
					border-bottom: 2px solid #eee;
					display: flex;
					align-items: center;
					.conText-c{
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 100%;
						.conText-l{
							.type{
								font-size: 16px;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #333333;
							}
							.time{		
								font-size: 12px;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #999999;
							}
						}
						.conText-r{			
							font-size: 18px;
							font-family: DINAlternate-Bold, DINAlternate;
							font-weight: bold;
							color: #333333;
							margin-right: 30rpx;
							&.recharge{
								color:#F3A10F;
							}
						}
					}
				}
			}
		}
	}
</style>
