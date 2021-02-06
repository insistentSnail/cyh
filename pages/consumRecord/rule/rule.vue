<template>
	<view class="rule" v-html="info">

	</view>
</template>

<script>
	import {getCardRule} from '@/api/my/my.js'
	export default {
		data() {
			return {
				info:""
			};
		},
		onLoad(e) {
			if(e.id==1){
				uni.setNavigationBarTitle({
					title: '饭票规则' //这是修改后的导航栏文字
				})
			}
			if(e.id==2){
				uni.setNavigationBarTitle({
					title: '福票规则' //这是修改后的导航栏文字
				})
			}
			
			getCardRule({
				id:e.id
			}).then(res=>{
				console.log(res,"规则");
				this.info = res.data.data.content;
			})
		}
	}
</script>

<style lang="scss" scoped>
	.rule{
		padding: 30rpx;
		word-break:break-all;//解决css（富文本内容）连续数字、字母，特殊符号不自动换行
		/deep/ img{
			width: 100%;
		}
	}	
</style>
