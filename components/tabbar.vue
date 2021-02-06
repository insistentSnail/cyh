<template>
	<view class="navBox">
		<block v-for="(item,index) in $store.getters.tabList" :key="index">
			<view class="nav" @tap="switchTab(item)">
				<view class="noCenter" v-if="index==2">
					<view class="center">
						<image  class="titleImg centerImg" :src="item.img" mode=""></image>
					</view>
					<text class="title titleCenter" :style="$store.getters.currentTabIndex==item.id?(`color:#D71507`):(`color:#999999`)">{{item.title}}</text>
				</view>
				<view class="noCenter" v-else>
					<image class="titleImg" :src="$store.getters.currentTabIndex==item.id?item.activeImg:item.img" mode=""></image>
					<text class="title" :style="$store.getters.currentTabIndex==item.id?(`color:#D71507`):(`color:#999999`)">{{item.title}}</text>
				</view>

			</view>		
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods:{
			switchTab(item){
				this.$store.commit('switchTab',item.id);
			}
		}
	}
</script>

<style lang="scss" scoped>
.navBox{
	position: fixed;
	z-index: 9999;
	display: flex;
	bottom: 0;
	width: 100%;
	height: 165rpx;
	background: #fff;
	box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(143, 143, 143, 0.24), 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
	.nav{
		margin-top: 10px;
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		.noCenter{
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.titleImg{
			width: 48rpx;
			height:48rpx;
		}
		.titleCenter{
			margin-top: 48rpx;
		}
		.center{
			width: 108rpx;
			height: 108rpx;
			border-radius:50%;
			box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(143, 143, 143, 0.24), 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
			z-index: 999;
			top: -74rpx;
			background: #FEFEFE;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			.centerImg{
				width: 88rpx;
				height: 88rpx;
			}
		}
		.title{	
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}
	}
}
</style>
