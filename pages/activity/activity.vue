<template>
	<view class="activity">
		<view class="header">
			活动
		</view>
		<view class="content">
			<view class="list" v-for="(item,index) in conLists"
			 :key="index"
			 @click="toActivityInfo(item)">
				<view class="list-l">
					<image :src="item.imgUrl" mode=""></image>
				</view>
				<view class="list-r">
					<view class="title">
						{{item.name}}
					</view>
					<view class="time">
						<image src="../../static/activity/time.png" mode=""></image>
						<text>{{item.startTime.split(" ")[0].split("-").join(".")}}-{{item.endTime.split(" ")[0].split("-").join(".")}}</text>
					</view>
					<view class="bottom">
						<view class="peopleNum">
							已有<text>{{item.participationNum}}</text>人参与
						</view>
						<view :class="item.status==0?'btn':item.status==-1?'btn none':'btn finished'">
							   {{item.status==0?'进行中':item.status==-1?'未开始':'已结束'}}	
						</view>
					</view>
				</view>
			</view>
		</view>
		<tab-bar></tab-bar>
	</view>
</template>

<script>
	import {getActivitys} from '@/api/activity/activity.js'
	export default {
		data() {
			return {
				conLists:[]
			}
		},
		onLoad() {
			getActivitys().then(res=>{
				this.conLists = res.data.data;
			})
		},
		methods: {
			toActivityInfo(item){
				if(item.status==1){
					uni.showToast({
						title:'活动已结束',
						icon:"none"
					})
					return false
				}
				
				if(item.status==-1){
					uni.showToast({
						title:'活动未开始',
						icon:"none"
					})
					return false
				}
				
				uni.navigateTo({
					url:'./activityInfo/activityInfo?url='+item.redirectUrl
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
	.activity{
		height: 100%;
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
		.content{
			padding: 155rpx 30rpx 240rpx;
			.list{
				margin-top: 30rpx;
				width: 642rpx;
				height: 174rpx;
				background: #FFFFFF;
				box-shadow: 0px 8rpx 24rpx 0px rgba(169, 169, 169, 0.14);
				border-radius: 12rpx;
				padding: 24rpx;
				display: flex;
				align-items: center;
				.list-l{
					min-width: 174rpx;
					min-height: 174rpx;
					image{
						width: 174rpx;
						height: 174rpx;
					}
				}
				.list-r{
					margin-left: 24rpx;
					width: 100%;
					height: 174rpx;
					.title{		
						margin-top: 6rpx;
						font-size: 15px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						width: 90%;
						white-space: nowrap;/*内容超宽后禁止换行显示*/		
						overflow: hidden;/*超出部分隐藏*/
						text-overflow:ellipsis;/*文字超出部分以省略号显示*/
					}
					.time{
						margin-top: 12rpx;
						display: flex;
						align-items: center;
						image{
							width: 22rpx;
							height: 22rpx;
						}
						text{	
							font-size: 12px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							margin-left: 8rpx;
						}
					}
					.bottom{
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 32rpx;
						.peopleNum{	
							font-size: 12px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							text{
								color: #D71507;
							}
						}
						.btn{
							width: 120rpx;
							height: 50rpx;
							background: #D71507;
							border-radius: 10rpx;	
							text-align: center;
							line-height: 50rpx;
							font-size: 12px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #FFFFFF;
							&.none{		
								background: #F2BF21;
							}
							&.finished{							
								background: #EEEEEE;							
								color: #999999;
							}
						}
					}
				}
			}
		}
	}
</style>
