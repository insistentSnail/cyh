<template>
	<view class="gasShop">
	<!-- 	<view class="header">
			商城
		</view> -->
		<!-- tab栏 -->
	<!-- 	<view class="tabLists">
			<v-tabs height="100rpx" color="#999"
			activeColor="#333"
			fontSize="30rpx"
			lineColor="#D71507"
			lineHeight="6rpx"
			lineRadius="4rpx"
			:lineScale="1"
			 v-model="tabIndex" :tabs="tabs" @change="changeTab"></v-tabs>
		</view> -->
		<!-- 内容 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view class="content">
				<view class="list" v-for="(item,index) in contentLists" :key="index" @click="intoShopInfo(item)">
					<view class="img">
						<image :src="item.imgUrl" mode=""></image>
					</view>
					<view class="text" v-if="item.imgUrl">
						<view class="p1">
							{{item.name||""}}
						</view>
						<view class="p2">
							{{item.price||0}}元
						</view>
						<view class="p3">
							已售{{item.salesVolume||0}}件
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	<!-- 	<tab-bar></tab-bar> -->
	</view>
</template>

<script>
	import {getShopLists,getShopTypeLists,getShopGoodsLists} from '@/api/shop/shop.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
			 //    tabs: [],
				// idList:[],
				// tabs: ['扶贫商城', '数字商城', '苏宁商城', '福利商城'],
				// tabIndex:0,
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
				contentLists:[]
			}
		},
		onLoad() {
			// getShopTypeLists().then(res=>{
			// 	console.log(res,'商城列表');
			// 	var arr = [];
			// 	var ids = [];
			// 	res.data.data.forEach(ele=>{
			// 		arr.push(ele.groupName);
			// 		ids.push(ele.id);
			// 	})
			// 	this.tabs = arr;
			// 	this.idList = ids;
			// 	// this.changeTab(0);
			// })
		},
		methods: {
			// tab切换
			// changeTab(index) {
			// 	console.log('当前选中的项：' + index)
			// 	this.tabIndex = index
			// 	this.mescroll.resetUpScroll();
			// },
			// 跳转商品详情页
			intoShopInfo(item){
				uni.navigateTo({
					url:'/pages/shop/shopInfo?id='+item.id+'&index=光汇商城'
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
				
				// getShopGoodsLists({
				// 	 page: page.num,
				// 	 groupId:this.idList[this.tabIndex]
				// }).then(res=>{
				// 	if(page.num == 1){
				// 		this.contentLists = []; //如果是第一页需手动置空列表
				// 	}
				// 	this.contentLists = this.contentLists.concat(res.data.data); //追加新数据
				// 	this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
				// })
				
				getShopLists({
					  "page": page.num,
					  "type": 8
				}).then(res=>{			
					if(page.num == 1){
						this.contentLists = []; //如果是第一页需手动置空列表
					}
					this.contentLists = this.contentLists.concat(res.data.data); //追加新数据
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
	.gasShop{	
		padding-bottom: 40rpx;//给底部导航栏留空间都应该写在最外层
		/deep/ .mescroll-totop{
			z-index: 999999!important;
			bottom: 200rpx!important;
		}
		// /deep/ .mescroll-body{
		// 	min-height: auto!important;
		// 	padding-bottom: 300rpx!important;
		// }
		.header{
			position: fixed;
			width: 100%;
			top: 0;
			height: 48rpx;
			padding-top: 80rpx;
			padding-bottom: 26rpx;
			background: #fff;
			text-align: center;
			font-size: 18px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			border-bottom:1px solid #eee;
			z-index: 999;
		}
		.tabLists{
			position: fixed;
			z-index: 999;
			top: 155rpx;
			width: 100%;
			height: 100rpx;
			background: #FFFFFF;
			box-shadow: 0px 2px 12px 0px rgba(169, 169, 169, 0.18);
			/deep/ .v-tabs__container-item{
				width: 25%;
				justify-content: center;
			}
		}
		.content{
			padding: 0 30rpx;
			// margin-top:256rpx;
			margin-top:30rpx;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.list{
				width: 334rpx;
				height: 502rpx;
				background: #FEFFFF;
				border-radius: 8rpx;
				border: 1px solid #E4E4E4;
				margin-top: 30rpx;
				.img{
					width: 334rpx;
					height: 334rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					image{
						width: 300rpx;
						height: 300rpx;
					}
				}
			}
			.text{
				padding: 0 20rpx;
				.p1{
					margin-top: 16rpx;
					font-size: 15px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
				}
				.p2{	
					margin-top: 10rpx;
					font-size: 14px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #D71507;
				}
				.p3{	
					margin-top: 14rpx;
					font-size: 12px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #999999;
				}
			}
		}
	}
</style>
