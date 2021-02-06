<template>
	<view class="shopCar">
		
		<view class="header">
			<image @click="goBack" src="../../../../static/shop/goBack.png" mode=""></image>
			<view class="title">
				购物车
			</view>
			<view :class="remove?'order active':'order'" @click="edit">
				{{btn}}
			</view>
		</view>
		
		<!-- 分商城 -->
		<view class="card" v-if="this.shopList.length>0">
			<view class="shopType">
				<view :class="allChecked?'choose active':'choose'" @click="allCheck">
					<image v-show="allChecked" src="/static/shop/check.png" mode=""></image>
				</view>
				<view class="shopType-r">
					<view class="shopName">
						{{groupName}}
					</view>
					<view class="tip">
						满{{freePostageAmmount}}包邮
					</view>
				</view>
			</view>
			
			<view class="shopList" v-for="(item,index) in shopList" :key="index">
				<view :class="item.isChecked?'choose active':'choose'" @click="check(item)">
					<image v-show="item.isChecked" src="/static/shop/check.png" mode=""></image>
				</view>
				<view class="shopList-r">
					<view class="shopImg">
						<image :src="item.imgUrl" mode=""></image>
					</view>
					<view class="shop-r">
						<view class="shopText">
							{{item.name}}
						</view>
						<view class="bottom">
							<view class="price">
								¥{{item.price}}
							</view>
							<view class="numberBox">
								<view class="subtract" @click="subtract(item)">
									<image src="/static/shop/subtract.png" mode=""></image>
								</view>
								<view class="num">
									{{item.itemAmmount}}
								</view>
								<view class="add" @click="add(item)">
									<image src="/static/shop/add.png" mode=""></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="totalPrice" v-if="!remove">
				<view class="totalPrice-l">
					
				</view>
				<view class="totalPrice-r">
					<view class="top">
						<view class="top-l">
							合计：
						</view>
						<view class="top-r">
							¥{{totalPrice}}
						</view>
					</view>
					<view class="btns">
						<view class="quit" @click="quit">
							再逛逛
						</view>
						<view class="toOrder" @click="intoOrder">
							去结算
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fBottom" v-if="remove&&this.shopList.length>0">
			<view class="left">
				<view :class="allChecked?'checkAll active':'checkAll'" @click="allCheck">
					<image v-show="allChecked" src="/static/shop/check.png" mode=""></image>
				</view>
				<view class="checkAllText">
					全选（{{checkLength}}）
				</view>
			</view>
			<view class="right" @click="removeShop">
				删除
			</view>
		</view>
	</view>
</template>

<script>
	import {GetCart,UpdateCart} from '@/api/shop/shop.js'
	export default {
		data() {
			return {
				shopList:[],
				btn:"编辑",
				remove:false,
				groupName:"",
				freePostageAmmount:""
			};
		},
		computed: {
		    // 计算总价
		    totalPrice: function () {
				var total=0;
		      // `this` points to the vm instance
		     this.shopList.forEach(ele=>{
				 if(ele.isChecked==true){
					 total+=ele.price*ele.itemAmmount
				 }	  
			  })
			  return total.toFixed(2)
		    },
			// 全选标识
			allChecked:function(){
			    if(this.shopList.every(ele=>ele.isChecked==true)){
			        return true;
			    }else{
			        return false;
			    }
			},
			// 全选数量
			checkLength(){
				var arr = []
				this.shopList.forEach(ele=>{
					if(ele.isChecked==true){
						arr.push(ele)
					}
				})
				return arr.length
			}
		},
		onLoad(e) {
			// 购物车数据
			this.getShopCar();
		},
		// 编辑
		onNavigationBarButtonTap(val) {
		    console.log(val);	    
		},
		methods:{
			getShopCar(){
				GetCart().then(res=>{
					console.log(res.data,"购物车数据22");
					if(res.data.data.length==0){
						this.shopList = []
					}else{		
						this.groupName = res.data.data[0].groupName;
						this.freePostageAmmount = res.data.data[0].freePostageAmmount;
						// 初始化都不选中
						res.data.data[0].groupDatas.forEach(ele=>{
							// ele.isChecked = false;//响应式问题
							this.$set(ele,'isChecked',false);
						})
						this.shopList = res.data.data[0].groupDatas;
					}
				})
			},
			subtract(item){
				if(item.itemAmmount==0){
					return false;
				}else{
					item.itemAmmount--
				}
			},
			add(item){
				item.itemAmmount++
			},
			goBack(){
				uni.navigateBack();
			},
			edit(){
				if(this.btn=="编辑"){
					// 可删除
					this.btn="完成";
					this.remove = true;
				}else{
					this.btn="编辑";
					this.remove = false;
				}
			},
			// 点击单选按钮
			check(item){
				console.log(item);
				item.isChecked = !item.isChecked;
			},
			// 点击全选按钮
			allCheck(){
				if(this.shopList.every(ele=>ele.isChecked==true)){
					this.shopList.forEach(ele=>ele.isChecked=false);
				}else{
					this.shopList.forEach(ele=>ele.isChecked=true);
				}
			},
			// 删除
			removeShop(){
				var arr = []
				this.shopList.forEach(ele=>{
					var obj = {}
					if(ele.isChecked==true){
						obj.commodityTempId = ele.id;
						// obj.itemAmmount = ele.itemAmmount;
						obj.itemAmmount = 0;
						arr.push(obj)
					}
				})
				if(arr.length<=0){
					uni.showToast({
						title:"请选择需要移除的商品",
						icon:"none"
					})
					return false;
				}
				console.log(arr,'需要删除的商品id');
				UpdateCart(arr).then(res=>{
					console.log(res,'删除购物车商品');
					if(res.data.code==0){
						uni.showToast({
							title:"删除成功",
							icon:"none"
						})
						this.getShopCar();
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
				})
			},
			// 再逛逛
			quit(){
				uni.navigateBack();
			},
			// 去结算 订单页
			intoOrder(){
				var arr = []
				this.shopList.forEach(ele=>{
					var obj = {}
					if(ele.isChecked==true){
						obj.commodityTempId = ele.id;
						obj.itemAmmount = ele.itemAmmount;
						arr.push(obj)
					}
				})
				if(arr.length<=0){
					uni.showToast({
						title:"请选择需要结算的商品",
						icon:"none"
					})
					return false;
				}
				console.log(arr,"结算数组对象");
				uni.navigateTo({
					url:'../../../address_management/welfareShopOrder/welfareShopOrder2?commoditys='+JSON.stringify(arr)
				})
			}
		}
	}
</script>
<style lang="scss">
	page{
		background: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.shopCar{
		overflow: hidden;
		padding-bottom: 200rpx;
		.fBottom{
			width: calc(100% - 60rpx);
			height: 168rpx;
			background: #FFFFFF;
			box-shadow: 0px -8rpx 12rpx 0px rgba(204, 204, 204, 0.16);
			position: fixed;
			z-index: 9999;
			bottom: 0;
			padding: 20rpx 30rpx 0;
			display: flex;
			justify-content: space-between;
			.left{
				height: 100rpx;
				display: flex;
				align-items: center;
				.checkAll{
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					border: 1px solid #DCDCDC;
					margin-right: 16rpx;
					&.active{
						border: none;
					}
					image{
						width: 30rpx;
						height: 30rpx;
					}
				}
				.checkAllText{
					font-size: 15px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
			}
			.right{
				width: 216rpx;
				height: 100rpx;
				background: #D71507;
				box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
				border-radius: 12rpx;
				line-height: 100rpx;
				text-align: center;
				font-size: 15px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #FFFFFF;
			}
		}
		.header{
			background: #F6F6F6;
			z-index: 9999;
			position: fixed;
			width: calc(100% - 60rpx);
			padding:0 30rpx;
			padding-top: 50rpx;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title{
				margin-left: 50rpx;
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			.order{
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				&.active{		
					color: #D71506;
				}
			}
			image{
				width: 36rpx;
				height: 36rpx;
			}
		}
		.card{
			margin: 180rpx auto 30rpx;
			width: 690rpx;
			// height: 728rpx;
			background: #FFFFFF;
			box-shadow: 0px 8rpx 24rpx 0px rgba(169, 169, 169, 0.14);
			border-radius: 12rpx;
			.shopType{
				height: 100rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.choose{
					width: 30rpx;
					height: 30rpx;
					border: 1px solid #DCDCDC;
					border-radius: 50%;
					&.active{
						border: none;
					}
					image{
						width: 30rpx;
						height: 30rpx;
					}
				}
				.shopType-r{
					height: 100rpx;
					width: calc(100% - 60rpx);
					border-bottom: 1px solid #eee;
					display: flex;
					align-items: center;
					.shopName{
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
					}
					.tip{
						margin-top: 6rpx;
						margin-left: 12rpx;
						font-size: 12px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #D71506;
					}
				}
			}
			.shopList{
				height: 206rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.choose{
					width: 30rpx;
					height: 30rpx;
					border: 1px solid #DCDCDC;
					border-radius: 50%;
					&.active{
						border: none;
					}
					image{
						width: 30rpx;
						height: 30rpx;
					}
				}
				.shopList-r{
					height: 206rpx;
					border-bottom: 1px solid #eee;
					width: calc(100% - 60rpx);
					display: flex;
					align-items: center;
					.shopImg{
						min-width: 160rpx;
						width: 160rpx;
						height: 160rpx;
						border-radius:12rpx;
						overflow: hidden;
						image{
							width: 160rpx;
							height: 160rpx;
						}
					}
				}
				.shop-r{
					width:100%;
					height: 160rpx;
					margin-left: 18rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.shopText{
						font-size: 15px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						overflow : hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.bottom{
						height: 60rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.price{			
							font-size: 14px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #D71507;
						}
						.numberBox{
							height: 48rpx;
							display: flex;
							align-items: center;
							.num{
								line-height: 48rpx;
								margin: 0 24rpx;
								font-size: 13px;
								font-family: PingFangSC-Semibold, PingFang SC;
								font-weight: 600;
								color: #333333;
							}
							image{
								width: 48rpx;
								height: 48rpx;
							}
						}
					}
				}
			}
			.totalPrice{
				height: 200rpx;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.totalPrice-l{
					width: 30rpx;
				}
				.totalPrice-r{
					height: 200rpx;
					width: calc(100% - 60rpx);
					.top{
						display: flex;
						align-items: center;
						justify-content: space-between;
						height: 88rpx;
						.top-l{
							font-size: 15px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
						.top-r{
							font-size: 15px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
					}
					.btns{
						display: flex;
						justify-content: flex-end;
						align-items: center;
						.quit{
							margin-right: 50rpx;
							font-size: 15px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #999999;
						}
						.toOrder{
							width: 216rpx;
							height: 80rpx;
							background: #D71507;
							box-shadow: 0px 6rpx 16rpx 0px rgba(186, 121, 121, 0.4);
							border-radius: 12rpx;
							line-height: 80rpx;
							text-align: center;
							font-size: 15px;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: #FFFFFF;
						}
					}
				}
			}
		}
	}
</style>
