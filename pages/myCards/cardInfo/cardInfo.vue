<template>
	<view class="cardInfo">
	
		<view class="cardName">
			<view class="cardImg">
				<image :src="info.commodityTempImgUrl" mode=""></image>
			</view>
			<view class="name">
				{{info.cardName}}
			</view>
		</view>
		<view class="cardIcon">
			<image src="../../../static/my/cardInfoIcon.png" mode=""></image>
			<text>不支持退换</text>
		</view>
		
		<view class="cardNum">
			<view class="num" v-show="!info.onlyPwd">
				<view class="num-l">
					<text class="hxm">卡号</text>
					<text class="number">{{info.cardNo}}</text>
				</view>
				<view class="num-r" @click="copy(info.cardNo)">
					复制卡号
				</view>
			</view>
			<view class="num">
				<view class="num-l">
					<text class="hxm">卡密</text>
					<text class="number">{{info.cardPwd}}</text>
				</view>
				<view class="num-r" @click="copy(info.cardPwd)">
					{{isHttp?'去使用':'复制卡密'}}
				</view>
			</view>
			<view class="time">
				<text class="hxm">有效期</text>
				<text class="number">{{createTime}} - {{info.expireTime}}</text>
			</view>
		</view>
		
		<view class="rule">
			<view class="ruleTitle">
				使用规则
			</view>
			<!-- 兼容处理 -->
			<block v-if="info.useRule&&info.useRule.indexOf('\n')!=-1">
				<view class="ruleContent" v-html="info.useRule.replace(/\n/g,'<br/>')">
					
				</view>
			</block>	
			<block v-if="info.useRule&&info.useRule.indexOf('\n')==-1">
				<view class="ruleContent" v-html="info.useRule">
					
				</view>
			</block>	
		</view>
		
		<show-modal></show-modal>
	</view>
</template>

<script>
	import {getMyCouponDetail} from '@/api/my/my.js'
	export default {
		data() {
			return {
				info:{},
				createTime:"",
				isHttp:false
			};
		},
		onLoad(e) {
			getMyCouponDetail({
				id:e.id
			}).then(res=>{
				console.log(res,'卡券详情');
				this.info = res.data.data;
				this.createTime = this.info.creationTime.split(" ")[0];
				if(this.info.cardPwd.indexOf("http")!=-1){
					// 跳转外链
					this.isHttp = true;
				}else{
					this.isHttp = false;
				}
			})
		},
		methods:{
			copy(value) {
				console.log(value)
				if(this.isHttp){
					plus.runtime.openURL(value);
				}else{
					//提示模板
					this.$showModal({
						title: '',
						content: value, //模板中提示的内容
						confirmText: '复制内容',
						cancelText:"取消",
						cancelColor:"#000000",
						confirmColor:"#576b95",
						success: (res) => { //点击复制内容的后调函数
							//uni.setClipboardData方法就是讲内容复制到粘贴板
							// API `setClipboardData` is not yet implemented
							//意思是H5端没有这个接口！！！
							if(res.confirm){
								uni.setClipboardData({
									data: value, //要被复制的内容
									success: function() {
											//重点~做笔记
											//在success中加入uni.hideToast()可以解决
											uni.showToast({
												title: '复制成功',
												duration: 1000,
												icon: 'none'
											});
											//以下就可自定义操作了~
										},
										fail: function(err) {
											uni.showToast({
												title: '复制失败',
												duration: 1000,
												icon: 'none'
											});
										}
								});
									           
							}else{
							   
							}
						}
					});
				}

			}
		}
	}
</script>
<style>
	page{	
		background: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.cardInfo{
		.cardName{
			padding: 0 30rpx;
			height: 220rpx;
			background: #fff;
			display: flex;
			align-items: center;
			.cardImg{
				width: 216rpx;
				height: 160rpx;
				image{
					width: 216rpx;
					height: 160rpx;
				}
			}
			.name{
				font-size: 17px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				margin-left: 32rpx;
			}
		}
		.cardIcon{
			margin: 20rpx 0;
			height: 104rpx;
			background: #FFFFFF;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			image{
				width: 40rpx;
				height: 40rpx;
			}
			text{
				margin-left: 20rpx;
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
			}
		}
		.cardNum{
			padding:0 30rpx;
			// height: 334rpx;
			background: #FFFFFF;
			.num{
				height: 108rpx;
				border-bottom: 1px solid #eee;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.num-l{
					width: 75%;
					overflow:hidden;
					white-space:nowrap;
					text-overflow:ellipsis;
					.hxm{
						font-size: 15px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
					}
					.number{
						margin-left: 30rpx;
						font-size: 15px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
				.num-r{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 136rpx;
					height: 52rpx;
					background: #D71507;
					border-radius: 8rpx;
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}
			}
			.time{
				height: 112rpx;
				display: flex;
				align-items: center;
				.hxm{
					font-size: 15px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
				}
				.number{
					margin-left: 30rpx;
					font-size: 15px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
			}
		}
		.rule{
			padding: 30rpx;
			.ruleTitle{		
				font-size: 15px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
			}
			.ruleContent{	
				margin-top: 8rpx;
				font-size: 13px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				line-height: 40rpx;
			}
		}
	}
</style>
