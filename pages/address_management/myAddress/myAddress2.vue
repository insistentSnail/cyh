<template>
	<view class="myAddress">
		<view class="addressList" v-for="(item,index) in addressLists"
		:key="index"
		>
			<view class="addressContent">
				<view class="addressContent-t">
					<view class="address-l">
						<text class="name">
							{{item.name}}
						</text>
						<text class="phone">
							{{item.phone}}
						</text>
					</view>
					<view class="address-r" @click="setAddress(item)">
						<view class="icon">
							<image src="/static/my/setDefault.png" mode="" v-show="item.isDefault"></image>
						</view>
						<text :class="item.isDefault?'active':''">默认地址</text>
					</view>
				</view>
				
				<view class="addressContent-b">
					{{item.area}} {{item.address}}
				</view>
			</view>
			
			<view class="addressBtn">
				<view class="edit">
					<image src="/static/my/updateAddress.png" mode=""></image>
					<text @click="editAddress(item.id)">编辑</text>
				</view>
				<view class="remove">
					<image src="/static/my/removeAddress.png" mode=""></image>
					<text @click="removeAddress(item.id)">删除</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {getAllAddress,deleteAddress,setDefaultAddress} from '@/api/address/address.js'
	export default {
		data() {
			return {
				addressLists:[],
				shopId:null,
				commoditys:[]
			};
		},
		onLoad(e) {
			this.shopId = e.shopId;//保存商品id
			this.commoditys = JSON.parse(e.commoditys);//保存购物车结算过来的数据
			getAllAddress().then(res=>{
				console.log(res,'地址列表');
				this.addressLists = res.data.data;
			})
		},
		onNavigationBarButtonTap(val) {
		    console.log(val);
			// 添加地址
			uni.redirectTo({
				url:'./addressInfo/addressInfo2?shopId='+this.shopId+'&commoditys='+JSON.stringify(this.commoditys)
			})
		},
		// 防止点击返回按钮 反复回退
		onBackPress(event){
			uni.redirectTo({
				url:'../welfareShopOrder/welfareShopOrder2?id='+this.shopId+'&commoditys='+JSON.stringify(this.commoditys)
			});
			return true;
		},
		methods:{
			// 修改地址
			editAddress(id){
				uni.redirectTo({
					url:'./addressInfo/addressInfo2?update=1&id='+id+'&shopId='+this.shopId+'&commoditys='+JSON.stringify(this.commoditys)
				})
			},
			// 删除地址
			removeAddress(id){
				deleteAddress({
					id:id
				}).then(res=>{
					console.log(res,'删除地址');
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					getAllAddress().then(res=>{
						console.log(res,'地址列表');
						this.addressLists = res.data.data;
					})
				})
			},
			// 设置默认地址
			setAddress(item){
				// 已经是默认地址再点击就不做处理
				if(item.isDefault){
					return false
				}
				
				setDefaultAddress({
					id:item.id
				}).then(res=>{
					console.log(res,"设置默认地址");
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					getAllAddress().then(res=>{
						console.log(res,'地址列表');
						this.addressLists = res.data.data;
					})
				})
			}
		}
	}
</script>
<style>
	page{
		background: #f6f6f6;
	}
</style>
<style lang="scss" scoped>
	.myAddress{	
		.addressList{
			// width: 100%;
			// height: 240rpx;
			background: #FFFFFF;
			margin-bottom: 24rpx;
			padding:0 30rpx;
			.addressContent{
				overflow: hidden;
				// height: 160rpx;
				border-bottom:1px solid #eee;
				.addressContent-t{
					margin-top: 24rpx;
					// height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.address-l{
						max-width: 75%;
						height:100%;
						display: flex;
						align-items: flex-end;
						.name{
							font-size: 17px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
						.phone{
							margin-left: 12rpx;
							font-size: 14px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
						}
					}
					.address-r{
						height:100%;
						display: flex;
						align-items: center;
						.icon{
							width: 34rpx;
							height: 34rpx;
							border-radius: 50%;	
							background: #EEEEEE;
							image{
								width: 34rpx;
								height: 34rpx;
							}
						}
						text{	
							margin-left: 12rpx;
							font-size: 13px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							&.active{	
								color: #D71507;
							}
						}
					}
				}
				.addressContent-b{
					margin: 24rpx 0;
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
			}
			.addressBtn{
				padding: 24rpx 0;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.edit{
					display: flex;
					align-items: center;
					image{
						width: 32rpx;
						height: 32rpx;
					}
					text{	
						font-size: 13px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						margin-left: 8rpx;
					}
				}
				.remove{
					display: flex;
					align-items: center;
					margin-left: 60rpx;
					image{
						width: 32rpx;
						height: 32rpx;
					}
					text{
						font-size: 13px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						margin-left: 8rpx;
					}
				}
			}
		}
	}
</style>

