<template>
	<view class="daohang">
		<web-view :src="url" :progress="false">
			
		</web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:"",
				longitude: null,//经度
				latitude: null,//纬度
				address:"",
				selfLongitude:null,// 自身的经度
				selfLatitude:null//自身的纬度
			};
		},
		onLoad(e) {
			console.log(JSON.parse(e.info));
			this.longitude = JSON.parse(e.info).longitude;
			this.latitude = JSON.parse(e.info).latitude;
			this.address = JSON.parse(e.info).name;
			uni.showLoading({
				title: '加载中...'
			});
			uni.getLocation({
				// type: 'wgs84',
				type:'gcj02',
			　　geocode:true,
				success: res=> {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);	
					this.selfLongitude = res.longitude;
					this.selfLatitude = res.latitude;
					this.navigation();
					uni.hideLoading();
				},
				fail: (err) => {
					console.log(err,'定位失败');
					uni.showToast({title: "获取定位失败"});
					uni.hideLoading();
				}
			});
		},
		methods:{
			navigation(){
				this.url = `https://uri.amap.com/navigation?from=${this.selfLongitude},${this.selfLatitude},我的位置&to=${this.longitude},${this.latitude},${this.address}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.daohang{
		
	}
</style>
