<template>
	<view class="consult">
		<!-- 老版本 -->
		<!-- 资讯 -->
	<!-- 		<view class="information"> -->
		<!-- 		<view class="title">
					<image src="/static/homePage/zx.png" mode=""></image>
					<text>资讯</text>
				</view> -->
	<!-- 			<view class="contentLists">
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
			
		<!-- 新版本 -->
		<!-- 轮播 -->
		<view class="bannerBox">
			<view class="banner">
				<swiper class="swiper-banner" @change="changeSwiper" circular="true" :current="currentVal">
					<swiper-item v-for="(item,index) in bannerLists" :key="index">
						<view class="swiper-item">
							<image class="img" :src="item"
							></image>					
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
		</view>
		
	
		
		<!-- tab栏 -->
		<view class="tabLists">
			<v-tabs height="90rpx" color="#999"
			activeColor="#333"
			fontSize="30rpx"
			lineColor="#D71507"
			lineHeight="6rpx"
			lineRadius="4rpx"
			:lineScale="1"
			 v-model="tabIndex" :tabs="tabs" @change="changeTab"></v-tabs>
		</view>
		
		<view class="con" v-if="tabIndex==0">
			<view class="conTitle">
				{{title}}
			</view>
			<view class="cont" v-html="content">
				
			</view>

		</view>
		
		<view class="con" v-if="tabIndex==1">
			<view class="list" v-for="item in proList" :key="item.id"
			@click="intoProjectInfo(item.id)">
				<image :src="item.imgUrl" mode=""></image>
				<view class="title">
					{{item.title}}
				</view>
				<view class="address">
					地址：{{item.address}}
				</view>
			</view>
		</view>
		
		<view class="con" v-if="tabIndex==2">
			<view class="card" v-for="item in consultList" :key="item.id"
			@click="intoConsultInfo(item.id)"> 
				<view class="card-l">
					<image :src="item.imgUrl" mode=""></image>
				</view>
				<view class="card-r">
					<view class="cardTitle">
						{{item.title}}
					</view>
					
					<view class="bottom">
						<view class="peopleNum">
							{{item.hitTimes}} 阅读
						</view>
						<view class="time">
							{{item.creationTime.split(" ")[0]}}
						</view>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import common from '@/api/common.js'
	import {getHome} from '@/api/home/home.js'	
	import {getGroupCompanyDesc,getInfoDetail,getInfos,getProjectDetail,getProjects,getBanners} from '@/api/healthy/healthy.js'
	export default {
		data() {
			return {
				// informationLists:[],
				swiperCurrent: 0,//轮播指示点
				currentVal:0,//轮播图
				bannerLists:[],
				tabIndex:0,
				tabs:['集团介绍','项目介绍','资讯动态'],
				content:"",
				title:"",
				proList:[],
				consultList:[]
			}
		},
		onShow() {
			uni.request({
			    url: common.host+'/api/Recuperate/GetInfos', //仅为示例，并非真实接口地址。
				data:{page:1},
			    success: (res) => {
			       this.consultList = res.data.data; 
			    }
			});	
		},
		onLoad() {
			getProjects({
				page:1
			}).then(res=>{
				this.proList = res.data.data;
			})
			//https://changtian.yunduancn.com //正式地址
			// http://cyhapi.gogotoo.net//测试地址
			uni.request({
			    url: common.host+'/api/Recuperate/GetGroupCompanyDesc', //仅为示例，并非真实接口地址。
			    success: (res) => {
			        console.log(res.data);
					this.content = res.data.data.content;
					this.title = res.data.data.title;
			    }
			});
			// getGroupCompanyDesc().then(res=>{
			// 	this.content = res.data.data.content;
			// 	this.title = res.data.data.title;
			// })
			uni.request({
			    url: common.host+'/api/Recuperate/GetInfos', //仅为示例，并非真实接口地址。
				data:{page:1},
			    success: (res) => {
			       this.consultList = res.data.data; 
			    }
			});	
			// getInfos({
			// 	page:1
			// }).then(res=>{
			// 	this.consultList = res.data.data;
			// })
			uni.request({
			    url: common.host+'/api/Recuperate/GetBanners', //仅为示例，并非真实接口地址。
			    success: (res) => {
					this.bannerLists=res.data.data; 
			    }
			});	
			// getBanners().then(res=>{
			// 	this.bannerLists=res.data.data;
			// })
		},
		methods: {
			// 跳转资讯详情
			// intoInfo(item){
			// 	console.log(item)
			// 	uni.navigateTo({
			// 		url: '/pages/informationInfo/informationInfo?info=' + encodeURIComponent(JSON.stringify(item))
			// 	});
			// },
			intoProjectInfo(id){
				uni.navigateTo({
					url:'./projectInfo/projectInfo?id='+id
				})
			},
			intoConsultInfo(id){
				uni.navigateTo({
					url:'./consultInfo/consultInfo?id='+id
				})
			},
			changeSwiper(e) {
				this.swiperCurrent = e.detail.current;
				this.changeTab(this.swiperCurrent);
			},
			// tab切换
			changeTab(index) {
				console.log('当前选中的项：' + index)
				this.tabIndex = index;
				this.swiperCurrent = index;
				this.currentVal = index;
			},
		}
	}
</script>
<style lang="scss">
	page{
		background: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.consult{
		overflow: hidden;
		// .information{
		// 	padding: 0 30rpx 40rpx;
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
		// 		margin-top: 30rpx;
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
		
		// 新版本
		// 轮播
		.bannerBox{
			position: fixed;
			z-index: 999;
			background: #fff;
			width: 100%;
			height: 320rpx;
			padding-top: 20rpx;
			top: 0;
			display: flex;
			justify-content: center;
			overflow: hidden;
		}
		.banner{
			width: 690rpx;
			height: 320rpx;
			border-radius: 20rpx;
			background: #fff;
			.swiper-banner{
				width: 690rpx;
				height: 320rpx;
				border-radius: 20rpx;
				overflow: hidden;
				.swiper-item{
					width: 690rpx;
					height: 320rpx;
					border-radius: 20rpx;
					overflow: hidden;
					.img{
						width: 690rpx;
						height: 320rpx;
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
		.tabLists{
			position: fixed;
			z-index: 999;
			top: 340rpx;
			width: 100%;
			height: 90rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 12rpx rgba(164, 164, 164, 0.16);
			/deep/ .v-tabs__container-item{
				width: 33.3%;
				justify-content: center;
			}
		}
		.con{
			margin-top: 430rpx;
			padding: 30rpx;
			.cont{
				/deep/ img{
					width: 100%;
				}
			}
			.conTitle{
				font-size: 20px;
				font-family: PingFang SC;
				font-weight: bold;
				line-height: 30px;
				color: #333333;
				text-align: center;
				padding-bottom: 10rpx;
			}
			.list{
				overflow: hidden;
				margin: 0 auto 30rpx;
				width: 690rpx;
				height: 412rpx;
				background: #FFFFFF;
				opacity: 1;
				border-radius: 8rpx 8rpx 0px 0px;
				image{
					width: 650rpx;
					height: 274rpx;
					margin: 18rpx auto 0;
					display: block;
				}
				.title{
					margin: 20rpx 20rpx 0 20rpx;	
					font-size: 16px;
					font-family: PingFang SC;
					font-weight: bold;
					line-height: 22px;
					color: #333333;
				}
				.address{
					margin: 0rpx 20rpx;
					overflow: hidden; 
					text-overflow:ellipsis; 
					white-space: nowrap;
					font-size: 14px;
					font-family: PingFang SC;
					font-weight: 400;
					line-height: 20px;
					color: #999999;
				}
			}
			.card{
				height: 170rpx;
				margin-bottom: 30rpx;
				// background: #fff;
				width: 100%;
				display: flex;
				// align-items: center;
				.card-l{
					width: 240rpx;
					height: 170rpx;
					border-radius: 8rpx;
					overflow: hidden;
					min-width:240rpx;
					image{
						width: 240rpx;
						height: 170rpx;
					}
				}
				.card-r{
					width: 100%;
					margin-left: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.cardTitle{
						margin-top: 10rpx;
						font-size: 15px;
						font-family: PingFang SC;
						font-weight: bold;
						line-height: 20px;
						color: #333333;
						opacity: 1;
					}
					.bottom{
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-bottom: 10rpx;
						font-size: 12px;
						font-family: PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
			}
		}
	}
</style>
