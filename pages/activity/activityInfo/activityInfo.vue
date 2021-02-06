<template>
	<view class="activityInfo">
		<!-- 外链 -->
		<web-view :src="url" :progress="false">
			
		</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:""
			};
		},
		onLoad(e) {
			this.url = e.url;
		},
	}
</script>

<style lang="scss" scoped>
	.activityInfo{
		
	}
</style>
