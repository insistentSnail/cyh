<template>
	<view class="shipAddress">
		<view class="formBox">
			<view class="formList">
				<view class="label">
					收货人
				</view>
				<view class="inputBox">
					<input type="text" placeholder="请输入收货人姓名" v-model="name"  class="uni-input" />
				</view>
			</view>
			<view class="formList">
				<view class="label">
					联系电话
				</view>
				<view class="inputBox">
					<input type="number" placeholder="请输入收货人号码" v-model="phone"  class="uni-input" />
				</view>
			</view>
			
			<view class="formList">
				<view class="label">
					所在地区
				</view>
				<view class="inputBox">
					<pick-regions @getRegion="handleGetRegion">
					   <view class="des">
							{{regionName?regionName:'点击请选择省市'}}
					   </view>
					</pick-regions>
				</view>
			</view>
			
			<view class="formList bigInput">
				<view class="label">
					详细地址
				</view>
				<view class="inputBox">
					<textarea class="textarea" placeholder="请输入详细地址"  v-model="info" auto-height />
				</view>
			</view>
		</view>
		
		<view class="line">
			
		</view>
		<!-- 设为默认地址 -->
		<view class="defaultAddress">
			<view class="text">
				设为默认地址
			</view>
			<switch :checked='isDefault' color="#D71507" @change="switchChange" />
		</view>
		
		
		<view class="btn" v-if="isUpdate" @click="UpdateAddress">
			修改地址
		</view>
		<view class="btn" @click="AddAddress" v-else>
			新增地址
		</view>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	import {addAddress,updateAddress,getAddressDetail} from '@/api/address/address.js'
	export default {
		components: {
			pickRegions
		},
		data() {
			return {
				name:"",
				phone:"",
				info:"",
				// 三级联动城市选择
				region:[],
				isDefault:true,
				isUpdate:null,
				addressId:null
			};
		},
		computed:{
			regionName(){
				// 转为字符串
				return this.region.map(item=>item.name).join(' ')
			}
		},
		onLoad(e) {
			
			// 假如是修改地址
			if(e.update){
				this.isUpdate=e.update;
				this.addressId = e.id;//地址id
				getAddressDetail({
					id:e.id
				}).then(res=>{
					console.log(res,"地址详情");
					this.name = res.data.data.name;
					this.phone = res.data.data.phone;
					this.info = res.data.data.address;
					this.isDefault = res.data.data.isDefault;
					// this.regionName = res.data.data.area;
					var arr = res.data.data.area.split(" ");
					this.region.push({name:arr[0]},{name:arr[1]},{name:arr[2]});
				})
			}
		},
		methods:{
			// 三级联动城市选择
			   // 获取选择的地区
			handleGetRegion(region){
				this.region = region
			},
			// 设为默认地址
			switchChange(e){
				console.log(e.detail.value);
				this.isDefault = e.detail.value;
			},
			// 新增地址
			AddAddress(){
				addAddress({
					name:this.name,
					phone:this.phone,
					area:this.regionName,
					address:this.info,
					isDefault:this.isDefault
				}).then(res=>{
					console.log(res,'新增地址');
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					if(res.data.code==0){
						setTimeout(()=>{
							uni.navigateTo({
								url:'../myAddress'
							})
						},1000)
					}
				})
			},
			// 修改地址
			UpdateAddress(){
				updateAddress({
					id:Number(this.addressId),
					name:this.name,
					phone:this.phone,
					area:this.regionName,
					address:this.info,
					isDefault:this.isDefault
				}).then(res=>{
					console.log(res,'修改地址');
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					})
					if(res.data.code==0){
						setTimeout(()=>{
							uni.navigateTo({
								url:'../myAddress'
							})
						},1000)
					}
				})
			}
		}
	}
</script>
<style>
/* 	page{
		background: #F6F6F6;
	} */
</style>
<style lang="scss" scoped>
	.shipAddress{
		.formBox{
			// height: 534rpx;
			background: #FFFFFF;
			padding: 0 30rpx;
			.formList{
				// height: 108rpx;
				width: 100%;
				border-bottom:1px solid #eee;
				display: flex;
				align-items: center;
				&.bigInput{
					height: 240rpx;
					border-bottom:none;
					.label{
						align-items: flex-start;
						height: 200rpx;
					}
					.inputBox{
						height: 200rpx;
					}
				}
				.label{
					height: 108rpx;
					width: 160rpx;
					font-size: 14px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					display: flex;
					align-items: center;
				}
				.inputBox{
					height: 108rpx;
					width: 100%;
					.uni-input{
						height: 100%;		
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
					.textarea{
						height: 200rpx;
						width: 100%;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
					.des{
						height: 108rpx;
						font-size: 14px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
						display: flex;
						align-items: center;
					}
				}
			}
		}
		.line{
			height: 24rpx;
			background: #f6f6f6;
			width: 100%;
		}
		.defaultAddress{
			padding: 40rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.text{	
				font-size: 14px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
		}
		.btn{
			margin: 40rpx auto;
			width: 690rpx;
			height: 100rpx;
			background: #D71507;
			box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 17px;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
		}
	}
</style>
