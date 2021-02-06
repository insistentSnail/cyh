<template>
	<view class="hotelOrder">
		<view class="none">
			<image src="../../static/tip/tip.png" mode=""></image>
			<view class="text">
				{{status==1?'正在建设中，敬请期待…':'暂无数据'}}	
			</view>
		</view>
	</view>
</template>

<script>
	import {getVersionStatus} from '@/api/home/home.js'
	export default {
		data() {
			return {
				status:null
			};
		},
		onLoad() {
			getVersionStatus({
				version:plus.runtime.version,
				platform:uni.getSystemInfoSync().platform,
				channel:plus.runtime.channel
			}).then(res=>{
				console.log(res.data.data.status);
				this.$store.dispatch('setStatus',res.data.data.status);
				this.status = res.data.data.status;//版本号 0是给appStore审核，1是上线版本
			})
		}
	}
</script>
<style>
	page{
		background: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	page{
		background: #F6F6F6;//写在这里app内不生效
	}
	.hotelOrder{
		width: 100%;
		.none{
			width: 522rpx;
			margin: 280rpx auto 0;
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
	}
</style>
