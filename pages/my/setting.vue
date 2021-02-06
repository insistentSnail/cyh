<template>
	<view class="setting">
		<view style="padding: 0 40rpx; background-color: #fff;">
			<view style="display: flex; align-items: center; justify-content: space-between;" class="item" @click="handlePhone">
				<view class="set-text">修改手机号</view>
				<image src="@/static/common/back.png" class="set-img"></image>
			</view>
			
			<view style="display: flex; align-items: center; justify-content: space-between;" class="item" @click="forgetPas">
				<view class="set-text">修改密码</view>
				<image src="@/static/common/back.png" class="set-img"></image>
			</view>
			
			<view style="display: flex; align-items: center; justify-content: space-between;" class="item" @click="toMyAddress">
				<view class="set-text">收货地址</view>
				<image src="@/static/common/back.png" class="set-img"></image>
			</view>
			<view style="display: flex; align-items: center; justify-content: space-between;" class="item" @click="handleUserContent">
				<view class="set-text">用户协议</view>
				<image src="@/static/common/back.png" class="set-img"></image>
			</view>
			<view style="display: flex; align-items: center; justify-content: space-between;" class="item" @click="handleruleContent">
				<view class="set-text">隐私协议</view>
				<image src="@/static/common/back.png" class="set-img"></image>
			</view>
			<view style="display: flex; align-items: center; justify-content: space-between;border-bottom: none;" class="item" @click="updateVersion">
				<view class="set-text">版本更新</view>
				<view style="display: flex; align-items: center;">
					<text style="color:#ccc;margin-right: 8rpx;">当前版本：{{version}}</text>
					<image src="@/static/common/back.png" class="set-img"></image>
				</view>
				
			</view>
		</view>
		<view class="quit" @click="quit">退出登录</view>
		
		
		<!-- 更新提示弹窗 -->
		<view class="mask" v-if="updateShow">
			<view class="updateBox">
				<view class="top">
					<view class="topText">
						发现新版本啦！
					</view>
				</view>
				<view class="content">
					<view class="newVersion">
						最新版本V{{updateInfo.version}}
					</view>
					<view class="versionSize">
						新版本大小：{{updateInfo.size}}
					</view>
					<view class="cont" v-html="updateInfo.content.replace(/\n/g,'<br/>')">
						
					</view>
					<view class="btn" @click="updateGo(updateInfo.downloadUrl)">
						立即升级
					</view>
				</view>
				
				<view class="close" @click="closeUpdate">
					
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {getVersionStatus,getNewVersion} from '@/api/home/home.js'
	export default {
		data() {
			return {
				status:null,
				version:"",
				updateShow:false,
				updateInfo:{}
			}
		},
		onLoad() {
			this.version = plus.runtime.version;
			getVersionStatus({
				version:plus.runtime.version,
				platform:uni.getSystemInfoSync().platform,
				channel:plus.runtime.channel
			}).then(res=>{
				console.log(res.data.data.status);
				this.status = res.data.data.status;//版本号 0是给appStore审核，1是上线版本
			})
		},
		// 防止点击返回按钮 反复回退
		onBackPress(event){
			uni.redirectTo({
				url:'./my'
			});
			return true;
		},
		methods: {
			forgetPas(){
				uni.navigateTo({
					url:'/pages/wxLogin/forgetPassword/forgetPassword'
				})
			},
			updateVersion(){
				// 判断是否需要更新版本
				getNewVersion({
					platform:uni.getSystemInfoSync().platform,
					channel:plus.runtime.channel
				}).then(res=>{
					if(res.data.code==0){
						if(Number(res.data.data.versionValue)>(Number(plus.runtime.version.split(".").join(""))+1001)){
							// 需要更新
							this.updateInfo = res.data.data;
							this.updateShow = true;	
						}else{
							uni.showToast({
								title: '当前已是最新版本',
								icon: 'none'
							})
						}
					}
				})
			},
			closeUpdate(){
				this.updateShow = false;
			},
			// 立即升级
			updateGo(url){
				this.updateShow = false;
				// plus.runtime.openURL(url);
				// uni.navigateTo({
				// 	url:'/pages/activity/activityInfo/activityInfo?url='+url
				// })
				if(uni.getSystemInfoSync().platform=="android"){
					uni.showLoading({
						title: '下载中'
					});
					var dtask = plus.downloader.createDownload( url, {}, function ( d, status ) {
						// 下载完成  
						if ( status == 200 ) {   
							plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename),{},function(){
								// 安装成功
								uni.hideLoading();
								// uni.clearStorageSync();//每次安装成功清一次缓存
								uni.showToast({
									title: '安装成功',  
									mask: false,  
									duration: 1000  
								});  
							},function(error){  
								// 安装失败
								uni.hideLoading();
								uni.showToast({  
									title: '安装失败',  
									mask: false,  
									duration: 1000  
								});  
							})  
						} else {  
							 uni.hideLoading();
							 uni.showToast({  
								title: '更新失败',  
								mask: false,  
								duration: 1500  
							 });  
						}    
					});  
					dtask.start(); 
				}else{
					plus.runtime.openURL(url);
				}
			},
			quit () {
				this.$store.dispatch('LogOut');
				uni.showToast({
					title: '退出成功',
					icon: 'none'
				})
				setTimeout(()=>{
					
					if(this.status ==1 ){
						uni.reLaunch({
							url:'/pages/wxLogin/wxLogin'
						})
					}else{
						// appStore审核用
						uni.reLaunch({
							url:'/pages/testLogin/testLogin'
						})
					}
				},1000)
			},
			handlePhone () {
				uni.navigateTo({
					url: '/pages/my/phone'
				})
			},
			handleUserContent () {
				uni.navigateTo({
					url: '/pages/my/userContent'
				})
			},
			handleruleContent () {
				uni.navigateTo({
					url: '/pages/my/ruleContent'
				})
			},
			// 跳转我的地址页面
			toMyAddress(){
				uni.navigateTo({
					url:'./myAddress/myAddress'
				})
			}
		}
	}
</script>
<style lang="scss">
	page{
		background-color: #f6f6f6;
	}
</style>
<style lang="scss" scoped>
.setting {
	height: 100%;
	width: 100%;
	.mask{
		z-index: 99999;
		top: 0;
		position: fixed;
		width: 100vw;
		height: 100vh;	
		background: rgba($color: #000000, $alpha: 0.45);
		.updateBox{
			width: 578rpx;
			// height: 736rpx;
			background: #FFFFFF;
			box-shadow: 0px 4rpx 44rpx 0px rgba(0, 0, 0, 0.08);
			border-radius: 16rpx;
			position: fixed;
			left: 50%;
			transform: translate(-50%,-50%);
			top: 40%;
			.top{
				width: 100%;
				position: absolute;
				height: 280rpx;
				background: url(../../static/homePage/updateImg.png) no-repeat;
				background-size: 100% 100%;
				top: -30rpx;
				.topText{	
					margin-top: 96rpx;
					margin-left: 48rpx;
					font-size: 18px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
				}
			}
			.content{
				margin-top: 250rpx;
				padding: 0 48rpx 40rpx;
				.newVersion{
					margin-top: 30rpx;
					font-size: 17px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #3D3D3D;
				}
				.versionSize{
					margin-top: 30rpx;
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #A6A6A6;
				}
				.cont{	
					margin-top: 12rpx;
					font-size: 14px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #A6A6A6;
					line-height: 56rpx;
				}
				.btn{
					margin-top: 48rpx;
					width: 100%;
					height: 80rpx;
					background: #D71507;
					box-shadow: 0px 6rpx 24rpx 0px rgba(190, 86, 86, 0.4);
					border-radius: 10px;
					text-align: center;
					line-height: 80rpx;
					font-size: 15px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
				}
			}
			.close{
				width: 74rpx;
				height: 72rpx;
				background: url(../../static/homePage/close.png) no-repeat;
				background-size: 100% 100%;
				position: absolute;
				bottom: -160rpx;
				left: 50%;
				transform: translateX(-50%);
				z-index: 999999;
			}
		}
	}
	.quit {
		background-color: #fff;
		text-align: center;
		color: #333;
		height: 112rpx;
		line-height: 112rpx;
		margin-top: 20rpx;
		font-size: 32rpx;
	}
	
	.item {
		padding: 36rpx 0;
		border-bottom: 2rpx solid #eee;
	}
	.set-text {
		font-size: 32rpx;
		color: #333;
	}
	
	.set-img {
		width: 40rpx;
		height: 40rpx;
	}
}
</style>
