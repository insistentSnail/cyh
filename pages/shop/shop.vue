<template>
	<view class="shop">
		<view class="header">
			商城
		</view>
		<!-- 包邮和非包邮 -->
		<view class="firstTabLists">
			<v-tabs height="100rpx" color="#333"
			activeColor="#333"
			fontSize="30rpx"
			lineColor="#D71507"
			lineHeight="6rpx"
			lineRadius="4rpx"
			:lineScale="1"
			 v-model="firstTabIndex" :tabs="firstTabs" @change="firstChangeTab"></v-tabs>
		</view>
		<!-- 二级分类 -->
		
	<block v-if="firstTabIndex==1">	
		<view class="secondBox">
			<view class="secondTabs">
				<scroll-view scroll-x="true">  
					<view :class="tabIndex==index?'secondTab active':'secondTab'"
					 v-for="(item,index) in tabs" :key="index"
					 @click="changeTab(index)">
						{{item}}
					</view>
				</scroll-view>
			</view>
	
		</view>
	
		
		<!-- tab栏 -->
<!-- 		<view class="tabLists">
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
		
		<!-- 正式用户使用 -->
		<block v-if="$store.getters.status==1">
			<block v-if="this.tabIndex<4">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
					
		<!-- 			<view style="width:690rpx;height: 180rpx;margin:280rpx auto 0;border-radius: 20rpx;overflow: hidden;" 
					class="banner" v-if="imgUrlLists[this.tabIndex]">
						<image style="width:100%;height: 180rpx;" 
						:src="imgUrlLists[this.tabIndex]" mode=""></image>
					</view> -->
					<view class="content">
						<block v-for="(item,index) in contentLists" :key="index">
							<view class="list" @click="intoShopInfo(item)" v-if="item.imgUrl">
								<view class="img">
									<image :src="item.imgUrl" mode=""></image>
								</view>
								<view class="text">
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
						</block>				
					</view>
				</mescroll-body>
			</block>
					
			<view class="none" v-else>
				<image src="../../static/tip/tip.png" mode=""></image>
				<view class="text">
					正在建设中，敬请期待…
				</view>
			</view>
		</block>
		
		<!-- appStore审核 -->
		<block v-if="$store.getters.status==0">
			<block v-if="this.tabIndex==0||this.tabIndex==1||this.tabIndex==3">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
					
		<!-- 			<view style="width:690rpx;height: 180rpx;margin:280rpx auto 0;border-radius: 20rpx;overflow: hidden;" 
					class="banner" v-if="imgUrlLists[this.tabIndex]">
						<image style="width:100%;height: 180rpx;" 
						:src="imgUrlLists[this.tabIndex]" mode=""></image>
					</view> -->
					<view class="content">
						<block v-for="(item,index) in contentLists" :key="index">
							<view class="list" @click="intoShopInfo(item)" v-if="item.imgUrl">
								<view class="img">
									<image :src="item.imgUrl" mode=""></image>
								</view>
								<view class="text">
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
						</block>				
					</view>
				</mescroll-body>
			</block>
					
			<view class="none" v-else>
				<image src="../../static/tip/tip.png" mode=""></image>
				<view class="text">
					正在建设中，敬请期待…
				</view>
			</view>
		</block>
	</block>	

	<!-- 非包邮商品有购物车 -->
	<block v-else>
		<view class="secondBox">
			<view class="secondTabs">
				<scroll-view scroll-x="true">  
					<view :class="shopTabIndex==index?'secondTab active':'secondTab'"
					 v-for="(item,index) in shopTabs" :key="index"
					 @click="shopChangeTab(index)">
						{{item}}
					</view>
				</scroll-view>
			</view>
			
		</view>
		
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
					
			<view class="content">
				<block v-for="(item,index) in contentLists" :key="index">
					<view class="list" @click="intoShopInfo2(item)" v-if="item.imgUrl">
						<view class="img">
							<image :src="item.imgUrl" mode=""></image>
						</view>
						<view class="text">
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
				</block>				
			</view>
		</mescroll-body>
	</block>
		
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import {getVersionStatus} from '@/api/home/home.js'
	import {getShopLists,getShopTypeLists,getShopGoodsLists} from '@/api/shop/shop.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
			    tabs: [],
				tabIndex:0,
				idList:[],
				// 购物车商城
				shopTabs:[],
				shopTabIndex:0,
				shopIdList:[],
				// tabs: ['扶贫商城', '数字商城', '苏宁商城', '福利商城'],
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
					textNoMore:'持续更新中，敬请期待'
				},
				contentLists:[],
				status:null,
				// 包邮非包邮
				firstTabIndex:1,
				firstTabs:['热卖专区','好货推荐']
			}
		},
		onLoad() {
			getShopTypeLists({
				version:2
			}).then(res=>{
				console.log(res,'购物车商城列表')
				var arr = [];
				var shopIds = []
				res.data.data.forEach(ele=>{
					if(!ele.isFreePostage){
						arr.push(ele.groupName);
						shopIds.push(ele.id);
					}
				})
				this.shopTabs = arr;
				this.shopIdList = shopIds;
			})
			
			getShopTypeLists().then(res=>{
				console.log(res,'商城列表');
				var arr = [];
				var ids = [];
				var imgUrlLists = [];
				res.data.data.forEach(ele=>{
					arr.push(ele.groupName);
					ids.push(ele.id);
					imgUrlLists.push(ele.imgUrl);
				})
				if(this.$store.getters.status==1){
					this.tabs = arr;
				}else{
					// appStore审核
					this.tabs = ['扶贫商城', '福利商城', '朵朵商城','彩云商城','苏宁商城']
				}			
				this.idList = ids;
				this.imgUrlLists = imgUrlLists;
				this.changeTab(0);
			})
			
			getVersionStatus({
				version:plus.runtime.version,
				platform:uni.getSystemInfoSync().platform,
				channel:plus.runtime.channel
			}).then(res=>{
				console.log(res.data.data.status);
				this.$store.dispatch('setStatus',res.data.data.status);
				this.status = res.data.data.status;//版本号 0是给appStore审核，1是上线版本
			})
		},
		methods: {
			// 包邮和非包邮
			firstChangeTab(index){
				this.firstTabIndex = index;
				this.mescroll.resetUpScroll();
			},
			// tab切换
			changeTab(index) {
				console.log('当前选中的项：' + index)
				this.tabIndex = index
				this.mescroll.resetUpScroll();
			},
			// 购物车商城切换
			shopChangeTab(index){
				console.log('购物车商品当前选中的项：' + index)
				this.shopTabIndex = index
				this.mescroll.resetUpScroll();
			},
			// 跳转商品详情页
			intoShopInfo(item){
				uni.navigateTo({
					url:'/pages/shop/shopInfo?index='+this.tabs[this.tabIndex]+'&id='+item.id
				})
			},
			// 跳转不包邮商品详情页有购物车
			intoShopInfo2(item){
				uni.navigateTo({
					url:'/pages/shop/shopInfo2/shopInfo2?index='+this.shopTabs[this.shopTabIndex]+'&id='+item.id
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
				
				getShopGoodsLists({
					 page: page.num,
					 groupId:this.firstTabIndex==1?this.idList[this.tabIndex]:this.shopIdList[this.shopTabIndex],
					 version:1
				}).then(res=>{
					if(page.num == 1){
						this.contentLists = []; //如果是第一页需手动置空列表
					}
					this.contentLists = this.contentLists.concat(res.data.data); //追加新数据
					this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
				})
				
				// getShopLists({
				// 	  "page": page.num,
				// 	  "type": this.tabIndex
				// }).then(res=>{			
				// 	if(page.num == 1){
				// 		this.contentLists = []; //如果是第一页需手动置空列表
				// 	}
				// 	this.contentLists = this.contentLists.concat(res.data.data); //追加新数据
				// 	this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
				// })
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
	.shop{	
		
		.none{
			width: 522rpx;
			margin: 400rpx auto 0;
			image{
				width: 522rpx;
				height: 328rpx;
			}
			.text{
				margin-top: 60rpx;			
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				text-align: center;
			}
		}
		
		padding-bottom: 240rpx;//给底部导航栏留空间都应该写在最外层
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
		.secondBox{
			position: fixed;
			z-index: 999;
			background: #F6F6F6;
			top: 249rpx;
			// top:149rpx;//1.0.13临时
			width: 100%;
			height: 120rpx;
			.secondTabs{
				display: flex;
				align-items: center;
				height: 120rpx;
				padding:0 30rpx;
				white-space: nowrap;//scroll-view的外层元素需要
				.secondTab{
					display: inline-block;//scroll-view的内层元素需要
					width: 180rpx;
					height: 60rpx;
					background: #E8E8E8;
					border-radius: 30rpx;
					margin-right: 20rpx;
					text-align: center;
					line-height: 60rpx;
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #666666;
					&.active{
						color: #FFFFFF;			
						background: #D71507;
					}
				}
			}
		}
		
		.firstTabLists{
			position: fixed;
			z-index: 999;
			top: 150rpx;
			width: 100%;
			height: 100rpx;
			background: #FFFFFF;
			box-shadow: 0px 2px 12px 0px rgba(169, 169, 169, 0.18);
			/deep/ .v-tabs__container-item{
				width: 50%;
				justify-content: center;
			}
		}
		// .tabLists{
		// 	position: fixed;
		// 	z-index: 999;
		// 	top: 150rpx;
		// 	width: 100%;
		// 	height: 100rpx;
		// 	background: #FFFFFF;
		// 	box-shadow: 0px 2px 12px 0px rgba(169, 169, 169, 0.18);
		// 	/deep/ .v-tabs__container-item{
		// 		// width: 25%;
		// 		justify-content: center;
		// 	}
		// }
		.content{
			padding: 0 30rpx;
			// margin-top:256rpx;//1.0.13临时改
			margin-top:340rpx;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.list{
				width: 334rpx;
				// height: 502rpx;
				height:532rpx;
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
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					
					// white-space: nowrap;
					// text-overflow: ellipsis;
					// overflow: hidden;
					// word-break: break-all;
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
