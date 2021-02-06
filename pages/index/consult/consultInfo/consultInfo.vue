<template>
	<view class="informationInfo">
		<view class="title">
			{{informationInfo.title}}
		</view>
		<view class="timeBox">
			<view class="time">
				{{informationInfo.creationTime}}
			</view>
			<view class="readNum">
				{{informationInfo.hitTimes}} 阅读 
			</view>
		</view>
		<view class="con" v-html="informationInfo.content">
		
		</view>
	</view>
</template>

<script>
	import common from '@/api/common.js'
	import {getInfoDetail} from '@/api/healthy/healthy.js'
	export default {
		data() {
			return {
				informationInfo:{}
			};
		},
		onLoad(event) {
			uni.request({
			    url: common.host+'/api/Recuperate/GetInfoDetail', //仅为示例，并非真实接口地址。
				data:{id:event.id},
			    success: (res) => {
					this.informationInfo = res.data.data;
					uni.setNavigationBarTitle({
						title: this.informationInfo.title //这是修改后的导航栏文字
					})
			    }
			});	
			// getInfoDetail({
			// 	id:event.id
			// }).then(res=>{
			// 	this.informationInfo = res.data.data;
			// 	uni.setNavigationBarTitle({
			// 		title: this.informationInfo.title //这是修改后的导航栏文字
			// 	})
			// })
		},
	}
</script>

<style lang="scss" scoped>
.informationInfo{
	padding: 30rpx;
	.title{	
		font-size: 20px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
	}
	.timeBox{
		margin-top: 16rpx;
		padding-left:10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.time{		
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;	
		}
		.readNum{	
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}
	}
	.con{	
		margin-top: 30rpx;
		font-size: 15px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 22px;
		/deep/ img{
			width: 100%;
		}
	}
}
</style>

