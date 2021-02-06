<template>
	<view class="consult">
		<!-- 资讯 -->
			<view class="information">
		<!-- 		<view class="title">
					<image src="/static/homePage/zx.png" mode=""></image>
					<text>资讯</text>
				</view> -->
				<view class="contentLists">
					<view class="contentList" v-for="(item,index) in informationLists"
					:key="index"
					@click="intoInfo(item)">
						<view class="con-l">
							<image :src="item.banner" mode=""></image>
						</view>
						<view class="con-r">
							<view class="con-title">
								{{item.name}}
							</view>
							<view class="readNum">
								地址：{{item.address}}
							</view>
						</view>
					</view>
				</view>
			</view>
	</view>
</template>

<script>
	import {getList} from '@/api/home/home.js'	
	export default {
		data() {
			return {
				informationLists:[]
			}
		},
		onShow() {
			getList({
				page:1
			}).then(res=>{
				console.log(res,"酒店列表")
				this.informationLists = res.data.data;
			})
		},
		methods: {
			// 跳转资讯详情
			intoInfo(item){
				console.log(item)
				uni.navigateTo({
					url: './hotelInfo/hotelInfo?info=' + encodeURIComponent(JSON.stringify(item))
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.consult{
		.information{
			padding: 0 30rpx 40rpx;
			.title{
				display: flex;
				align-items: center;
				margin: 44rpx 0 28rpx;
				image{
					width: 34rpx;
					height: 40rpx;
				}
				text{		
					font-size: 18px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					margin-left: 16rpx;
				}
			}
			.contentLists{
				margin-top: 30rpx;
				.contentList{
					height: 176rpx;
					display: flex;
					margin-bottom: 30rpx;
					.con-l{
						width: 276rpx;
						height: 176rpx;
						image{
							width: 276rpx;
							height: 176rpx;
						}
					}
					.con-r{
						margin-left: 22rpx;
						display: flex;
						flex-direction: column;
						// justify-content: space-between;
						.con-title{		
							margin-top: 6rpx;
							font-size: 15px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
						.readNum{	
							margin-top: 10rpx;
							margin-bottom: 6rpx;
							font-size: 12px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #888888;
						}
					}
				}
			}
		}
	}
</style>
