<template>
	<view class="myBill">
		<view class="tab">
			<view :class="welTabIndex==index?'tabIcon active':'tabIcon'" 
			v-for="(item,index) in welfareTabs"
			@click="welClick(index)"
			:key="index">
				{{item}}
			</view>
			<view class="tabIcon" @click="openPop">
				筛选
				<image src="../../../static/my/xia.png" mode=""></image>
			</view>
		</view>
		
		<view class="total">
			<text>
				支出 ¥ {{totalExpenses}}
			</text>
			<text>
				收入 ¥ {{totalIncome}}
			</text>  
		</view>
	
	<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">	
		<view class="conlists">
			<view class="conlist" v-for="(item,index) in cardList" :key="index">
				<view class="conIcon">
					<!-- <image src="../../../static/my/fu.png" mode=""></image> -->
					<view class="image" :style="item.backgroundSytle">
						{{item.paymentName.substr(0, 1)}}
					</view>
				</view>
				<view class="card">
					<view class="card-l">
						<view class="one">
							{{item.cardLogTypeStr}}
						</view>
						<view class="two">
							{{item.paymentName}}
						</view>
						<view class="time">
							{{item.creationTime}}
						</view>
					</view>
					<view :class="item.ammount>0?'card-r active':'card-r'">
						{{item.ammount>0?'+'+item.ammount:item.ammount}}元
					</view>
				</view>
			</view>
			
		</view>
	</mescroll-body>	
		
		<u-popup v-model="show" mode="top" border-radius="28">
			<view class="content">
				<view class="tab">
					<view class="tabIcon">
						全部
					</view>
					<view class="tabIcon">
						收入
					</view>
					<view class="tabIcon">
						支出
					</view>
					<view class="tabIcon active">
						筛选
						<image src="../../../static/my/shang.png" mode=""></image>
					</view>
				</view>
				
				<view class="search">
					快捷筛选
				</view>
				
				<view class="searchLists">
					<view :class="index==searchIndex?'searchList active':'searchList'" 
					@click="searchTab(index)"
					v-for="(item,index) in searchList"
					:key="index">
						{{item.name}}
					</view>
				</view>
				
				<view class="btns">
					<view class="cancel" @click="cancel">
						取消
					</view>
					<view class="submit" @click="submit">
						确定
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {getCardDetailMenu,getCardDetail} from '@/api/my/my.js'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				show:false,
				searchList:[],
				searchIndex:0,//筛选条件，支付方式
				cardList:[],
				totalExpenses:"",
				totalIncome:"",
				welfareTabs:['全部','收入','支出'],
				welTabIndex:0,
				// 下拉刷新的配置(可选, 90%的情况无需配置)
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
			};
		},
		onLoad(e) {
			getCardDetailMenu().then(res=>{
				res.data.data.unshift({
					name:'全部',
					type: -1,
					cardId: 0
				})
				this.searchList = res.data.data;
				this.searchTab(e.index);//0是全部,1是饭卡,2是福卡,3是生日票
			})
		},
		methods:{
			openPop(){
				this.show=true;
			},
			cancel(){
				this.show = false;
			},
			submit(){
				this.show = false;
			},
			// 收入还是支出
			welClick(index){
				this.welTabIndex= index;
				this.mescroll.resetUpScroll();
			},
			// 消费方式选择
			searchTab(index){
				this.searchIndex = index;
				this.mescroll.resetUpScroll();
				this.show = false;
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback(){
				// 第2种: 下拉刷新和上拉加载调同样的接口, 那么不用第1种方式, 直接mescroll.resetUpScroll()即可
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				console.log(page,'page');
				getCardDetail({
					"cardId": this.searchList[this.searchIndex].cardId,
					"page": page.num,
					 "valueFilter": this.welTabIndex,//0全部,1收入,2支出
					 "type": this.searchList[this.searchIndex].type
				}).then(res=>{
					console.log(res,'账单数据');
					if(page.num == 1){
						this.cardList = []; //如果是第一页需手动置空列表
					}
					this.cardList = this.cardList.concat(res.data.data); //追加新数据
					this.mescroll.endSuccess(res.data.data.length,res.data.data.length>=20); 
					this.totalExpenses = res.data.totalExpenses;
					this.totalIncome = res.data.totalIncome;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myBill{
		// 弹窗
		.content{
			// height: 460rpx;
			padding-bottom: 100rpx;
			.tab{
				border-top:1px solid #eee;
				display: flex;
				align-items: center;
				justify-content: space-around;
				height: 90rpx;
				background-color: #fff;
				position: relative;
				width: 100%;
				.tabIcon{
					font-size: 15px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					display: flex;
					align-items: center;
					&.active{	
						color: #D71507;
					}
					image{
						width: 16rpx;
						height: 16rpx;
						margin-left: 12rpx;
					}
				}
			}
			.search{
				padding-left: 30rpx;
				margin-top: 10rpx;
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
			}
			.searchLists{
				padding: 10rpx 30rpx 40rpx;
				display: flex;
				flex-wrap: wrap;
				.searchList{
					margin-right: 16rpx;
					margin-top: 16rpx;
					&:nth-child(3n+3){
						margin-right: 0rpx;
					}
					&.active{
						color: #D71506;
						border: 1px solid #D71506;
					}
					width: 218rpx;
					height: 72rpx;
					background: #F6F6F6;
					border-radius: 4rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 13px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
				}
			}
			.btns{
				height: 100rpx;
				position: fixed;
				bottom: 0;
				border-top: 1px solid #eee;
				width: 100%;
				display: flex;
				.cancel{
					width: calc(50% - 1px);
					border-right: 1px solid #eee;
					display: flex;
					align-items:center;
					justify-content: center;	
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}
				.submit{
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #D71506;
					width: 50%;
					display: flex;
					align-items:center;
					justify-content: center;
				}
			}
		}
		
		.tab{
			border-top:1px solid #eee;
			display: flex;
			align-items: center;
			justify-content: space-around;
			height: 90rpx;
			position: fixed;
			background-color: #fff;
			z-index: 9999;
			width: 100%;
			top: 0;
			.tabIcon{
				font-size: 15px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				display: flex;
				align-items: center;
				&.active{	
					color: #D71507;
				}
				image{
					width: 16rpx;
					height: 16rpx;
					margin-left: 12rpx;
				}
			}
		}
		.total{
			position: fixed;
			top: 92rpx;
			height: 90rpx;
			width: 100%;
			background: #F5F5F5;
			z-index: 9999;
			display: flex;
			align-items: center;
			font-size: 13px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			text{
				margin-left: 30rpx;
			}
		}
		.conlists{
			margin-top: 182rpx;
			.conlist{
				height: 206rpx;
				display: flex;
				justify-content: space-between;
				.conIcon{
					height: 206rpx;
					width: calc(100% - 630rpx);
					// text-align: center;
					.image{
						margin: 26rpx auto;
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						background: linear-gradient(150deg, #F15838 0%, #D71506 100%);
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
				.card{
					width: 630rpx;
					height: 162rpx;
					border-bottom:1px solid #eee;
					padding-top: 44rpx;
					display: flex;
					justify-content: space-between;
					.card-l{
						width: 70%;
						.one{
							overflow: hidden;    
							text-overflow: ellipsis;      //超出部分以省略号显示
							white-space: nowrap;
							font-size: 16px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #333333;
						}
						.two{
							margin-top: 8rpx;
							font-size: 13px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
						}
						.time{
							margin-top: 6rpx;
							font-size: 13px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
						}
					}
					.card-r{
						margin-right: 30rpx;
						font-size: 18px;
						font-family: DINAlternate-Bold, DINAlternate;
						font-weight: bold;
						color: #333333;
						&.active{	
							color: #F3A10F;
						}
					}
				}
			}
		}
	}
</style>
