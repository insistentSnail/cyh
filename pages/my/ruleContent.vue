<template>
	<view>
		<view style="text-align: center; color: #333; font-size: 36rpx; margin-top: 10rpx;">{{message.title}}</view>
		<view class="userCon" v-html="message.content" style="padding: 20rpx 30rpx"></view>
	</view>
</template>

<script>
	import {
		getRuleContent
	} from '@/api/my/my'
	export default {
		data() {
			return {
				message: {}
			};
		},
		onLoad(option) {
			getRuleContent().then(res => {
				console.log(res.data.data)
				if (res.data.code === 0) {
					this.message = res.data.data
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.userCon{
		/deep/ img{
			width: 100%;
		}
	}
</style>
