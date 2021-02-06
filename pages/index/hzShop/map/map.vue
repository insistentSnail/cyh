<template>
	<view class="map">
		 <map style="width: 100%; height:100vh;" 
		 :latitude="latitude" 
		 :longitude="longitude" 
		 :markers="covers">
		 </map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'map',
				longitude: 115.841724,//经度
				latitude: 28.657095,//纬度
				covers: [{
					width : 40,
					height: 40,
					longitude: 115.841724,
					latitude: 28.657095,
					iconPath: '/static/homePage/dh.png'
				}]
				        
			};
		}
	}
</script>

<style lang="scss" scoped>
	.map{
		
	}
</style>
