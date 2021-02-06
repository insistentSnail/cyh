<template>
	<view class="messages">
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
			<view v-for="(item, index) in contentLists" :key="index" class="one-message" @click="handleMessage(item.id)">
				<image :src="item.imgUrl" style="width: 80rpx; height: 80rpx;border-radius: 50%;overflow: hidden;"></image>
				<view style="border-bottom: 2rpx solid #eee; padding-bottom: 46rpx; flex: 1; margin-left: 16rpx;word-break:break-all;">
					<view>{{item.title}}</view>
					<view>{{item.desc}}</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
	import { getNotifiList } from "@/api/my/my"
	export default {
		mixins: [MescrollMixin],
		onLoad () {
			// this.mescroll.resetUpScroll()
		},
		data () {
			return {
				contentLists: [],
				downOption: {
					
				},
					// 上拉加载的配置(可选, 90%的情况无需配置)
				upOption: {
					page: {
						size:20 // 每页数据的数量,默认10
					},
					noMoreSize: 5,	 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
									// 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
									// 这就是为什么无更多数据有时候不显示的原因
					empty: {
						tip: '暂无相关数据'
					},
					textNoMore:'别拽了，到底啦'
				}
			}
		},
		methods: {
			downCallback(){
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				console.log(page,'page');
				getNotifiList({
					  "page": page.num,
					  "type": this.tabIndex	  
				}).then(res=>{			
					if(page.num == 1){
						this.contentLists = []; //如果是第一页需手动置空列表
					}
					console.log(res.data.data, 'aaaaaa')
					this.contentLists = this.contentLists.concat(res.data.data); //追加新数据
					this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
				})
			},
			handleMessage (id) {
				uni.navigateTo({
					url: `/pages/my/messageDetails?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.messages {
	.one-message {
		display: flex;
		align-items: center;
		padding: 20rpx 0 0 20rpx;
	}
}
</style>
