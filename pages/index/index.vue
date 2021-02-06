<template>
	<view class="content">
	<!-- 	<view class="headerBox">
			<view class="header">
				<view class="icon">
					
				</view>
				<input type="text"
				   placeholder="请输入你要查询的内容"
					v-model="value"
					@input="onKeyInput"
				/>
			</view>
		</view> -->
	
		
		<!-- 轮播 -->
		<view class="banner">
			<swiper class="swiper-banner" @change="changeSwiper" autoplay="true" circular="true">
				<swiper-item v-for="(item,index) in bannerLists" :key="index">
					<view class="swiper-item">
						<image class="img" :src="item.imgUrl"
						 @click="toActivityInfo(item)"></image>					
					</view>
				</swiper-item>		
			</swiper>
			<!-- 轮播指示点样式修改 -->
			<view class="dots">
				<block v-for="(item,index) in bannerLists.length" :key="index">
					<view class="dot" :class="index==swiperCurrent ? ' active' : ''"></view>
				</block>
			</view>
		</view>
		<!-- nav列表 -->
		<!-- appStore审核用 -->
		<view class="navLists" v-if="status==0">
			<view style="width: 33.3%;" :class="index==3?'navList three':'navList'" v-for="(item,index) in navLists" :key="index" @click="routerTo(item)">
				<image :src="item.iconUrl" mode=""></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<!-- 正式用户使用 -->
		<view class="navLists" v-if="status==1">
			<view style="width: 25%;" class="navList" v-for="(item,index) in navLists" :key="index" @click="routerTo(item)">
				<image :src="item.iconUrl" mode=""></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<view class="line">
			
		</view>
		<!-- 资讯 -->
	<!-- 	<view class="information">
			<view class="title">
				<image src="../../static/homePage/zx.png" mode=""></image>
				<text>资讯</text>
			</view>
			<view class="contentLists">
				<view class="contentList" v-for="(item,index) in informationLists"
				:key="index"
				@click="intoInfo(item)">
					<view class="con-l">
						<image :src="item.imgUrl" mode=""></image>
					</view>
					<view class="con-r">
						<view class="con-title">
							{{item.title}}
						</view>
						<view class="readNum">
							{{item.hitTimes}} 阅读
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<view class="shopBox">
			<view class="shopTitle">
				<view class="title-l">
					<view style="margin-left: 0rpx;" :class="typeIndex==1?'jx':'new'" @click="chooseType(1)">
						<image :src="typeIndex==1?'../../static/homePage/jxIconActive.png':'../../static/homePage/jxIcon.png'" mode=""></image>
						<text>精选</text>
					</view>
					<view style="margin-left: 40rpx;" :class="typeIndex==2?'jx':'new'" @click="chooseType(2)">
						<image :src="typeIndex==2?'../../static/homePage/newIconActive.png':'../../static/homePage/newIcon.png'" mode=""></image>
						<text>新品</text>
					</view>
				</view>
				<view class="title-r" @click="toShop">
					<text>更多</text>
					<image src="../../static/homePage/toShop.png" mode=""></image>
				</view>
			</view>
			
			<view class="shopLists">
				<view class="shopList" v-for="(item,index) in shopList" 
				@click="intoShopInfo(item)"
				:key="index">
					<view class="imgBox">
						<image :src="item.imgUrl" mode=""></image>
					</view>
					<view class="shopName">
						{{item.name}}
					</view>
					<view class="price">
						{{item.price}}元
					</view>
					<view class="saleNum">
						已售{{item.salesVolume}}件
					</view>
				</view>
			</view>
		</view>
		
		<tab-bar></tab-bar>
		
		<!-- 更新提示弹窗 -->
		<view class="mask" v-if="updateShow">
			<view class="updateBox">
				<view class="top">
					<view class="topText">
						发现新版本啦！
					</view>
				</view>
				<view class="content">
					<view class="newVersion">
						最新版本V{{updateInfo.version}}
					</view>
					<view class="versionSize">
						新版本大小：{{updateInfo.size}}
					</view>
					<view class="cont" v-html="updateInfo.content.replace(/\n/g,'<br/>')">
						
					</view>
					<view class="btn" @click="updateGo(updateInfo.downloadUrl)">
						立即升级
					</view>
				</view>
				
				<view class="close" @click="closeUpdate" v-show="!isForceUpdate">
					
				</view>
			</view>
	
		</view>
	</view>
</template>

<script>
	import {getHome,getCommodityListIndex,getVersionStatus,getNewVersion} from '@/api/home/home.js'	
	export default {
		data() {
			return {
				value:"",
				swiperCurrent: 0,
				bannerLists:[],
				navLists:[],
				informationLists:[],
				shopList:[],
				typeIndex:1,
				status:null,
				updateShow:false,
				updateInfo:{},
				isForceUpdate:false//强制更新
			}
		},
		onLoad() {	
			// 判断是否需要更新
			getNewVersion({
				platform:uni.getSystemInfoSync().platform,
				channel:plus.runtime.channel
			}).then(res=>{
				if(res.data.code==0){
					if(Number(res.data.data.versionValue)>(Number(plus.runtime.version.split(".").join(""))+1001)){
						// // 需要更新
						// // 第一次进来没有存最新版本
						// if(!this.$store.getters.newestVersion){
						// 	// 弹窗出现,
						// 	this.updateInfo = res.data.data;
						// 	this.updateShow = true;	
						// 	this.$store.dispatch('setNewestVersion',res.data.data.versionValue);
						// }else{
						// 	// 有缓存的新版本 每次有更新的版本出来再弹一次更新
						// 	if(res.data.data.versionValue>this.$store.getters.newestVersion){
						// 		this.updateInfo = res.data.data;
						// 		this.updateShow = true;	
						// 		this.$store.dispatch('setNewestVersion',res.data.data.versionValue);
						// 	}
						// }
						
						// 改成强制更新
						console.log(res.data.data.isForceUpdate,'isForceUpdate')
						this.isForceUpdate = res.data.data.isForceUpdate;
						this.updateInfo = res.data.data;
						this.updateShow = true;	
					}
				}
			})
			
			
			getCommodityListIndex({
				type:1
			}).then(res=>{
				console.log(res,"首页商城");
				this.shopList = res.data.data;
			})
			getVersionStatus({
				version:plus.runtime.version,
				platform:uni.getSystemInfoSync().platform,
				channel:plus.runtime.channel
			}).then(res=>{
				console.log(res.data,'版本号状态');	
				if(res.data.code==0){
					this.$store.dispatch('setStatus',res.data.data.status);
					this.status = res.data.data.status;//版本号 0是给appStore审核，1是上线版本
					getHome().then(res=>{
						console.log(res,"首页数据")
						this.bannerLists = res.data.data.indexBanners;
						if(this.status==1){
							this.navLists = res.data.data.indexIcons;
						}else{
							// appStore审核用
							this.navLists = res.data.data.indexIcons.slice(0,6);
						}			
						this.informationLists = res.data.data.indexNewses;
					})
				}	
			})
		},
		// onShow() {
		// 	console.log('我到首页了created')
		// },
		methods: {
			closeUpdate(){
				this.updateShow = false;
			},
			// 立即升级
			updateGo(url){
				this.updateShow = false;
				// plus.runtime.openURL(url);
				// uni.navigateTo({
				// 	url:'/pages/activity/activityInfo/activityInfo?url='+url
				// })
				if(uni.getSystemInfoSync().platform=="android"){
					uni.showLoading({
						title: '下载中'
					});
					var dtask = plus.downloader.createDownload( url, {}, function ( d, status ) {
						if ( status == 200 ) {   
							// 下载完成  
							// 文件路径转换
							// plus.io.convertLocalFileSystemURL(d.filename)
							plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename),{},function(){
								// 安装成功
								uni.hideLoading();
								// uni.clearStorageSync();//每次安装成功清一次缓存
								uni.showToast({
									title: '安装成功',  
									mask: false,  
									duration: 1000  
								});  
							},function(error){  
								// 安装失败
								uni.hideLoading();
								uni.showToast({  
									title: '安装失败',  
									mask: false,  
									duration: 1000  
								});  
							})  
						} else { 
							 uni.hideLoading();
							// 下载失败
							 uni.showToast({  
								title: '更新失败',  
								mask: false,  
								duration: 1000  
							 });  
						}    
					});  
					dtask.start(); 
				}else{
					// ios
					plus.runtime.openURL(url);
				}
			},
			// 点击轮播图跳转外链
			toActivityInfo(item){
				console.log(item,'url');
				// 检查app是否安装
				// if(plus.runtime.isApplicationExist({  
				//     pname: 'cmb.pb',  
				//     action: 'cmbmobilebank://'  
				// })){ 
				// 	console.log('已安装');
				// }else{
				// 	console.log('未安装');
				// }
				if(item.redirectUrl){
					if(item.isInsideBrowser){
						// 走内部浏览器
						uni.navigateTo({
							url:'/pages/activity/activityInfo/activityInfo?url='+item.redirectUrl
						})
					}else{
						// 外部浏览器
						plus.runtime.openURL(encodeURI(item.redirectUrl), function(res) {
							console.log(res);  
						});  
					}
				}
		
			},
			chooseType(num){
				this.typeIndex = num;
				getCommodityListIndex({
					type:num
				}).then(res=>{
					console.log(res,"首页商城");
					this.shopList = res.data.data;
				})
			},
			onKeyInput(){
				
			},
			changeSwiper(e) {
				this.swiperCurrent = e.detail.current;
				// console.log(e)
			},
			// 页面跳转
			routerTo(item){
				if(item.id==1){
					this.$store.commit('switchTab',2);
				}
				if(item.id==2){
					// uni.navigateTo({
					// 	url:'/pages/hotelOrder/hotelOrder'
					// })
					uni.navigateTo({
						url:'./hotelOrder/hotelOrder'
					})
				}
				if(item.id==3){
					// uni.navigateTo({
					// 	url:'/pages/hotelOrder/hotelOrder'
					// })
					uni.navigateTo({
						url:'./consult/consult'
					})
				}
				if(item.id==4){
					// uni.navigateTo({
					// 	url:'/pages/hotelOrder/hotelOrder'
					// })
					uni.navigateTo({
						url:'./unionShop/unionShop'
					})
				}
				if(item.id==11){
					if(this.status==0){
						uni.navigateTo({
							url:'/pages/hotelOrder/hotelOrder'
						})
					}else{
						uni.navigateTo({
							url:'/pages/telephoneCharge/telephoneCharge'
						})
					}
					// uni.navigateTo({
					// 	url:'/pages/hotelOrder/hotelOrder'
					// })
				}
				if(item.id==12){
					// uni.navigateTo({
					// 	url:'/pages/gasShop/gasShop'
					// })
					// uni.navigateTo({
					// 	url:'/pages/hotelOrder/hotelOrder'
					// })
					if(this.status==0){
						uni.navigateTo({
							url:'/pages/hotelOrder/hotelOrder'
						})
					}else{
						uni.navigateTo({
							url:'/pages/gasoline/gasoline'
						})
					}
				}
				if(item.id==7){
					// 0审核用  1上线用户用
					if(this.status==0){
						uni.navigateTo({
							url:'/pages/hotelOrder/hotelOrder'
						})
					}else{
						// uni.navigateTo({
						// 	url:'/pages/videoCharge/videoCharge'
						// })
						uni.navigateTo({
							url:'./hzShop/hzShop'
						})
					}		
				}
				if(item.id==8){
					// 0审核用  1上线用户用
					if(this.status==0){
						uni.navigateTo({
							url:'/pages/hotelOrder/hotelOrder'
						})
					}else{
						uni.navigateTo({
							url:'/pages/activity/activityInfo/activityInfo?url=https://www.yixiaoshuedu.com/'
						})
					}
				}
			},
			// 更多商品
			toShop(){
				this.$store.commit('switchTab',2);
			},
			// 跳转资讯详情
			intoInfo(item){
				console.log(item)
				uni.navigateTo({
					url: '/pages/informationInfo/informationInfo?info=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			// 跳转商品详情页
			intoShopInfo(item){
				// 包邮
				if(item.isFreePostage){
					uni.navigateTo({
						url:'/pages/shop/shopInfo?index='+this.tabIndex+'&id='+item.id
					})
				}else{
					// 非包邮
					uni.navigateTo({
						url:'/pages/shop/shopInfo2/shopInfo2?id='+item.id
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.content {
		overflow: hidden;
		.mask{
			z-index: 99999;
			top: 0;
			position: fixed;
			width: 100vw;
			height: 100vh;	
			background: rgba($color: #000000, $alpha: 0.45);
			.updateBox{
				width: 578rpx;
				// height: 736rpx;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 44rpx 0px rgba(0, 0, 0, 0.08);
				border-radius: 16rpx;
				position: fixed;
				left: 50%;
				transform: translate(-50%,-50%);
				top: 40%;
				.top{
					width: 100%;
					position: absolute;
					height: 280rpx;
					background: url(../../static/homePage/updateImg.png) no-repeat;
					background-size: 100% 100%;
					top: -30rpx;
					.topText{	
						margin-top: 96rpx;
						margin-left: 48rpx;
						font-size: 18px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #FFFFFF;
					}
				}
				.content{
					margin-top: 250rpx;
					padding: 0 48rpx 40rpx;
					.newVersion{
						margin-top: 30rpx;
						font-size: 17px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #3D3D3D;
					}
					.versionSize{
						margin-top: 30rpx;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #A6A6A6;
					}
					.cont{	
						margin-top: 12rpx;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #A6A6A6;
						line-height: 56rpx;
					}
					.btn{
						margin-top: 48rpx;
						width: 100%;
						height: 80rpx;
						background: #D71507;
						box-shadow: 0px 6rpx 24rpx 0px rgba(190, 86, 86, 0.4);
						border-radius: 10px;
						text-align: center;
						line-height: 80rpx;
						font-size: 15px;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #FFFFFF;
					}
				}
				.close{
					width: 74rpx;
					height: 72rpx;
					background: url(../../static/homePage/close.png) no-repeat;
					background-size: 100% 100%;
					position: absolute;
					bottom: -160rpx;
					left: 50%;
					transform: translateX(-50%);
					z-index: 999999;
				}
			}
		}
		.headerBox{
			width: 100%;
			height: 180rpx;
			position: fixed;
			z-index: 999;
			display: flex;
			justify-content: center;
			background: #fff;
			overflow: hidden;
			.header{
				width: 690rpx;
				height: 70rpx;
				margin-top: 80rpx;
				background: #EEEEEE;
				border-radius: 36rpx;
				display: flex;
				align-items: center;
				.icon{
					width: 34rpx;
					height: 34rpx;
					margin-left: 30rpx;
					margin-right: 16rpx;
					background: url(../../static/homePage/searchIcon.png) no-repeat;
				}
				input{
					height: 100%;
					width: 80%;
					.uni-input-placeholder{	
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #565656;
					}
				}
			}
		}
		// 轮播
		.banner{
			width: 690rpx;
			height: 280rpx;
			margin: 80rpx auto 0;
			// margin: 180rpx auto 0;
			position: relative;
			border-radius: 20rpx;
			overflow: hidden;
			.swiper-banner{
				width: 690rpx;
				height: 280rpx;
				border-radius: 20rpx;
				overflow: hidden;
				.swiper-item{
					width: 690rpx;
					height: 280rpx;
					border-radius: 20rpx;
					overflow: hidden;
					.img{
						width: 690rpx;
						height: 280rpx;
						// object-fit:cover;
					}
				}
			}
			.dots {
				position: absolute;
				bottom: 20rpx;
				left: 50%;
				transform: translateX(-50%);
				z-index: 4;
				display: flex;
				justify-content: center;
			
				.dot {
					width: 8rpx;
					height: 8rpx;
					border-radius: 4rpx;
					background: rgba($color: #fff, $alpha: 0.5);
					margin: 0 6rpx;
				}
				.active {
					width: 22rpx;
					height: 8rpx;
					background: #FFFFFF;
					border-radius: 2px;
				}
			}
		}
		
		.navLists{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin: 50rpx auto;
			padding: 0 20rpx;
			.navList{
				// width: 25%;
				width: 33.3%;
				height: 160rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				image{
					height: 100rpx;
					width: 100rpx;
				}
				text{		
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
				// appstore审核
				&.three{
					margin-top: 40rpx;
				}
				//...
				&:nth-child(5){
					margin-top: 40rpx;
				}
				&:nth-child(6){
					margin-top: 40rpx;
				}
				&:nth-child(7){
					margin-top: 40rpx;
				}
				&:nth-child(8){
					margin-top: 40rpx;
				}
			}
		}
		.line{
			width: 100%;
			height: 20rpx;
			background: #F6F6F6;
		}
		// .information{
		// 	padding: 0 30rpx 220rpx;
		// 	.title{
		// 		display: flex;
		// 		align-items: center;
		// 		margin: 44rpx 0 28rpx;
		// 		image{
		// 			width: 34rpx;
		// 			height: 40rpx;
		// 		}
		// 		text{		
		// 			font-size: 18px;
		// 			font-family: PingFangSC-Medium, PingFang SC;
		// 			font-weight: 500;
		// 			color: #333333;
		// 			margin-left: 16rpx;
		// 		}
		// 	}
		// 	.contentLists{
		// 		.contentList{
		// 			height: 176rpx;
		// 			display: flex;
		// 			margin-bottom: 30rpx;
		// 			.con-l{
		// 				width: 276rpx;
		// 				height: 176rpx;
		// 				image{
		// 					width: 276rpx;
		// 					height: 176rpx;
		// 				}
		// 			}
		// 			.con-r{
		// 				margin-left: 22rpx;
		// 				display: flex;
		// 				flex-direction: column;
		// 				justify-content: space-between;
		// 				.con-title{		
		// 					margin-top: 6rpx;
		// 					font-size: 15px;
		// 					font-family: PingFangSC-Medium, PingFang SC;
		// 					font-weight: 500;
		// 					color: #333333;
		// 				}
		// 				.readNum{	
		// 					margin-bottom: 6rpx;
		// 					font-size: 12px;
		// 					font-family: PingFangSC-Regular, PingFang SC;
		// 					font-weight: 400;
		// 					color: #888888;
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		.shopBox{
				padding: 0 30rpx 220rpx;
			.shopTitle{
				height: 120rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.title-l{
					display: flex;
					align-items: center;
					.jx{
						display: flex;
						align-items: center;
						image{
							width: 44rpx;
							height: 44rpx;
						}
						text{
							margin-left:12rpx;				
							font-size: 20px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
					}
					.new{
						margin-left:40rpx;
						display: flex;
						align-items: center;
						image{
							width: 36rpx;
							height: 36rpx;
						}
						text{
							margin-left:12rpx;
							font-size: 16px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #999999;
						}
					}
				}
				.title-r{
					display: flex;
					align-items: center;
					text{
						margin-right: 4rpx;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
					image{
						width: 32rpx;
						height: 32rpx;
					}
				}
			}
			.shopLists{
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.shopList{
					padding: 0 30rpx;
					margin-top: 20rpx;
					width: 274rpx;
					height: 502rpx;
					background: #FEFFFF;
					border-radius: 8rpx;
					border: 1px solid #E4E4E4;
					overflow: hidden;
					.imgBox{
						margin: 30rpx auto;
						width: 274rpx;
						height: 274rpx;
						image{
							width: 274rpx;
							height: 274rpx;
						}
					}
					.shopName{		
						font-size: 15px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
					.price{
						margin-top: 10rpx;
						font-size: 14px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #D71507;
					}
					.saleNum{
						margin-top: 30rpx;
						font-size: 12px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #999999;
					}
				}
			}
		}
	}
</style>
