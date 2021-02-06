<template>
	<view class="container">
		<view class="top"></view>
		<view class="middle">
			<view style="padding-bottom: 40rpx; border-bottom: 2rpx solid #eee;">
				<view style="font-size: 36rpx; color: #333; font-weight: 500; padding-left: 30rpx;">请选择反馈类型</view>
				<view style="font-size: 26rpx; color: #999; margin-top: 16rpx; padding-left: 30rpx;">以便我们能更快速地处理您的问题</view>
			</view>
			<view>
				<view style="padding-left: 30rpx; font-size: 30rpx; color: #333; padding-top: 28rpx;">问题场景</view>
				<view style="display: flex; margin-top: 24rpx;">
					<view class="problems" :class="{'active' : tag === 0}" @click="handlePro(0)">平台使用</view>
					<view class="problems" :class="{'active' : tag === 1}" @click="handlePro(1)">商品问题</view>
					<view class="problems" :class="{'active' : tag === 2}" @click="handlePro(2)">其他问题</view>
				</view>
			</view>

		</view>
		<view class="separate"></view>
		<view class="problem-content">
			<textarea class="advise" maxlength="200" @input="handleInputAdvise" placeholder-class="reason" placeholder="描述您的问题或建议"
			 v-model="content" />
			<view class="fl-col-e" style="font-size: 24rpx;color: #999;padding-right: 18rpx;padding-bottom: 12rpx;padding-top: 12rpx;">{{excel}}/200</view>
		</view>
		<view class="submit-pictures">
			<view class="text">添加照片(最多上传3张照片)</view>
			
			<view class="photo">
				<view v-if="photoList.length != 3" class="one-pic"><image src="@/static/my/choose.png" @click="chooseImage" mode=""></image></view>
				<view v-for="(item, index) in photoList" v-if="photoList.length != 0" @click="deleteItem(index)" :key="index" class="one-pic"><image :src="item" mode=""></image></view>
			</view>
		</view>
		<view class="phone">
			<view style="font-size: 30rpx; color: #333;">客服热线：{{phoneNum}}</view>
			<view class="now" @click="makePhone">立即拨号</view>
		</view>
		<view class="btn-area"><button @click="submitProblem">提交</button></view>
		<view v-if="isSuccess" class="message">
			<view class="area">
				<image src="@/static/my/success.png" style="width: 104rpx; height: 104rpx; margin-top: 50rpx;"></image>
				<view style="color: #333; font-size: 34rpx; margin-top: 34rpx; margin-left: 16rpx;">感谢您的反馈！</view>
				<view style="color: #999; font-size: 24rpx; margin-top: 16rpx;">我们将会尽快处理</view>
				<view style="color: #999; font-size: 28rpx; margin-top: 40rpx; padding-bottom: 36rpx;" @click="handleOk">好的</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getQiNiuUploadToken, commitFeedback } from '@/api/my/my'
	export default {
		onLoad () {
			getQiNiuUploadToken().then(res => {
				if (res.data.code === 0) {
					this.qnToken = res.data.data
				}
			})
		},
		data() {
			return {
				tag: 0,
				excel: 0,
				photoList: [],
				content: '',
				isSuccess: false,
				phoneNum: '17779737581',
				qnToken: '',
				imgList: [],
				photoListFiles: []
			}
		},
		methods: {
			handleOk () {
				this.isSuccess = false
				uni.navigateBack({
					delta: 1
				})
			},
			deleteItem(index) {
				this.photoList.splice(index, 1);
				this.imgList.splice(index, 1);
			},
			chooseImage() {
				uni.chooseImage({
					count: 3, //默认9
					success: res => {
						const tempPaths = res.tempFilePaths
						if (tempPaths.length + this.photoList.length > 3) {
							uni.showToast({
								title: '上传图片最多可选3张',
								icon: 'none'
							})
						} else {
							this.photoList = this.photoList.concat(tempPaths)
							for (let i = 0; i < this.photoList.length; i++) {
								this.uploadFile(this.photoList[i])
							}
						}
					}
				})
			},
			uploadFile(file) {
				const fileTypeArray = file.split('.')
				uni.uploadFile({
					url: 'https://upload-z2.qiniup.com/',
					filePath: file,
					name: 'file',
					formData: {
						key: `userUploads/${this.uuid()}.${fileTypeArray[fileTypeArray.length - 1]}`,
						token: this.qnToken
					},
					success: res => {
						const imgUrl = 'https://ctfiles.yunduancn.com/' + JSON.parse(res.data).key
						console.log(imgUrl)
						this.imgList.push(imgUrl)
					},
					fail() {
						uni.showToast({
						title: '上传失败，请稍后再试！',
						duration: 3000,
						icon: 'none'
						})
					}
				})
			},
			uuid() {
				return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16))
			},
			makePhone () {
				uni.makePhoneCall({
					phoneNumber: '17779737581'
				})
			},
			handlePro(num) {
				this.tag = num
			},
			submitProblem () {
				if (!this.content) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				
				if (!this.photoList.length) {
					uni.showToast({
						title: '请上传图片',
						icon: 'none'
					})
					return
				}
				
				commitFeedback({
					type: this.tag,
					content: this.content,
					imgUrls: this.imgList.join(',')
				}).then( res => {
					if (res.data.code === 0) {
						this.isSuccess = true
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
					}
				})
			},
			handleInputAdvise(e) {
				this.excel = e.target.value.length
			}
		}
	}
</script>

<style lang="scss" scoped>
.message {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	height: 100%;
	background: rgba(0,0,0,.18);
	z-index: 9;
	
	.area {
		width: 420rpx;
		background-color: #fff;
		margin: 0 auto;
		margin-top: 35vh;
		box-shadow: 0  -4rpx 30rpx 0 rgba(0, 0, 0, 0.04);
		border-radius: 20rpx;
		text-align: center;
	}
}
.container {
	padding-bottom: 68rpx;
	.top {
		width: 100%;
		height: 326rpx;
		background: url('@/static/my/22.png') no-repeat 0 / 100% 100%;
	}
	
	.phone {
		padding: 26rpx 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.now {
			width: 168rpx;
			height: 60rpx;
			line-height: 60rpx;
			color: #D71507;
			font-size: 26rpx;
			text-align: center;
			border-radius: 34rpx;
			border: 2rpx solid #D71507;
		}
	}
	
	.middle {
		.problems {
			width: 200rpx;
			height: 68rpx;
			background: #EEEEEE;
			border-radius: 4rpx;
			line-height: 68rpx;
			text-align: center;
			font-size: 28rpx;
			color: #333;
			margin-left: 30rpx;
			box-sizing: border-box;
			&.active {
				color: #D71507;
				border: 2rpx solid #D71507;
				background: #FFECEB;
				line-height: 64rpx;
			}
		}
	}
	
	.separate {
		width: 100%;
		height: 16rpx;
		background: #F6F6F6;
		margin-top: 26rpx;

	}
	
	.problem-content {
		border-radius: 12rpx;
		background-color: #f1f1f1;
		margin: 30rpx;
		.advise {
			box-sizing: border-box;
			padding: 27rpx 24rpx 0 24rpx;
			width: 690rpx;
			height: 300rpx;
			line-height: 30rpx;
			font-size: 26rpx;
			color: #999;
		}
	}
	.submit-pictures {
		margin: 0 30rpx;
		padding-bottom: 36rpx;
		border-bottom: 2rpx solid #eee;
		.photo {
			// padding-left: 30rpx;
			display: flex;
			.one-pic {
				margin-right: 20rpx;
				image {
					width: 160rpx;
					height: 160rpx;
				}
			}
		}
		.text {
			// padding-left: 30rpx;
			font-size: 26rpx;
			color: #666;
			padding-bottom: 14rpx;
		}
	}
}
.reason {
	font-size: 26rpx;
	color: #999;
}

.fl-col-e {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.btn-area {
	margin: 52rpx 0 0rpx 0;
	button {
		line-height: 100rpx;
		margin: 0 auto;
		font-size: 34rpx;
		text-align: center;
		color: #fff;
		width: 690rpx;
		height: 100rpx;
		background: #D71507;
		box-shadow: 0px 6px 16px 0px rgba(186, 121, 121, 0.4);
		border-radius: 20rpx;

	}
}
</style>
