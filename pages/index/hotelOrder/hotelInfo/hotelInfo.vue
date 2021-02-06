<template>
	<view class="hotelInfo">
		<image class="hotelBanner" :src="hotelInfo.banner" mode=""></image>
		<view class="content">
			<view class="hotelName">
				{{hotelInfo.name}}
			</view>
			<view class="addressAndTel">
				<view class="address">
					{{hotelInfo.address}}
				</view>
				<view class="tel" @click="call(hotelInfo.tel)">
					<image src="../../../../static/my/tel.png" mode=""></image>
					<view class="telText">
						电话
					</view>
				</view>
			</view>
			
			<view class="con" v-html="hotelInfo.desc">
				
			</view>
		</view>
	</view>
</template>

<script>
	import {getDetail} from '@/api/home/home.js'
	export default {
		data() {
			return {
				info:{},
				hotelInfo:{}
			};
		},
		onLoad(event) {
			this.info = JSON.parse(decodeURIComponent(event.info));
			console.log(this.info);
			getDetail({
				id:this.info.id
			}).then(res=>{
				this.hotelInfo = res.data.data;
			})
		},
		methods:{
			call(tel){
				uni.makePhoneCall({
					phoneNumber: tel
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hotelInfo{
		// padding: 30rpx;
		.hotelBanner{
			width: 100%;
			height: 400rpx;
		}
		.content{
			padding: 30rpx;
			.hotelName{
				font-size: 22px;
				color: #333;
				font-weight: bold;
			}
			.addressAndTel{
				margin-top: 8rpx;
				display: flex;
				height: 120rpx;
				.address{
					width: 80%;
					border-right: 1px solid #ccc;
					padding-right: 20rpx;
				}
				.tel{
					width: 18%;
					display: flex;
					flex-direction: column;
					align-items: center;
					.telText{
						margin-top: 8rpx;
						color: #d81e06;
					}
					image{
						width: 48rpx;
						height: 48rpx;
					}
				}
			}
			.con{
				margin-top: 10rpx;
				/deep/ img{
					width: 100%;
				}
			}
		}
	}
</style>
