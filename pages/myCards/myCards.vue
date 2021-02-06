<template>
	<view class="myCards">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="card" v-for="(item,index) in cardLists" :key="index">
				<view class="card-top">
					<view class="card-l">
						<image :src="item.commodityTempImgUrl" mode=""></image>
					</view>
					<view class="card-r">
						<view class="cardName">
							{{item.cardName}}
						</view>
						<view class="limitTime">
							消费时间：{{item.creationTime.split(" ")[0]}} - {{item.expireTime}}
						</view>
					</view>
				</view>
				
				<view class="orderNumber">
					<view class="number">
						订单号：{{item.spOrderId}}
					</view>
					<view class="toUse" @click="toCardInfo(item.id)">
						去使用
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import {getMyCouponList} from '@/api/my/my.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
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
				cardLists:[]
			}
		},
		onLoad() {
			this.mescroll.resetUpScroll();
		},
		methods: {
			// 跳转卡券详情页
			toCardInfo(id){
				uni.navigateTo({
					url:'/pages/myCards/cardInfo/cardInfo?id='+id
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
				getMyCouponList({
					  "page": page.num,
				}).then(res=>{			
					if(page.num == 1){
						this.cardLists = []; //如果是第一页需手动置空列表
					}
					this.cardLists = this.cardLists.concat(res.data.data); //追加新数据
					this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
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
	.myCards{
		padding-bottom: 60rpx;
		.card{
			padding:0 22rpx;
			margin: 24rpx auto;
			width: 646rpx;
			height: 290rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 24rpx 0px rgba(169, 169, 169, 0.14);
			border-radius: 12rpx;
			.card-top{
				width: 100%;
				height: 210rpx;
				border-bottom: 1px solid #eee;
				display: flex;
				align-items: center;
				.card-l{
					width: 216rpx;
					height: 160rpx;
					image{
						width: 216rpx;
						height: 160rpx;
					}
				}
				.card-r{
					margin-left: 20rpx;
					height: 160rpx;
					.cardName{	
						width: 400rpx;
						margin-top: 10rpx;
						font-size: 15px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.limitTime{
						margin-top: 10rpx;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
			}
			.orderNumber{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 76rpx;
				.number{
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #666666;
				}
				.toUse{
					width: 56px;
					height: 25px;
					background: #D71507;
					border-radius: 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 12px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
