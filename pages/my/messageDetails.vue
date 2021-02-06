<template>
	<view class="messageDetails">
		<view style="text-align: center; color: #333; font-size: 36rpx; margin-top: 10rpx;word-break:break-all;">{{message.title}}</view>
		<view class="msgInfo" v-html="message.content" style="padding: 10rpx 30rpx 0;"></view>
	</view>
</template>

<script>
	import { getNotifiDetail } from '@/api/my/my'
	export default {
		data() {
			return {
				message: {}
			};
		},
		onLoad (option) {
			if (option.id) {
				getNotifiDetail({ id: option.id }).then(res => {
					if (res.data.code === 0) {
						this.message = res.data.data
					} 
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.messageDetails{
		width: 100%;
		overflow: hidden;
		.msgInfo{
		 // WORD-WRAP:break-word;
		 // TABLE-LAYOUT:fixed;
			word-break:break-all;//解决css（富文本内容）连续数字、字母，特殊符号不自动换行
			/deep/ img{
				width: 100%;
			}
		}
	}
</style>
