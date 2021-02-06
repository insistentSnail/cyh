<template>
	<view class="forgetPassword">
		<view class="inputBox">
			<view class="input" v-if="havePassword">
				<input type="text" autocomplete="off" placeholder="请输入原密码" v-model="form.pas"  class="uni-input" />
			</view>
			<view class="input">
				<input type="text" autocomplete="off" :placeholder="havePassword?'请输入新密码':'请输入密码'" v-model="form.pas2"  class="uni-input" />
			</view>
			<view class="input none">
				<input type="text" autocomplete="off" placeholder="确认密码" v-model="form.pas3"  class="uni-input" />
			</view>
		</view>
		
		<view class="submit" @click="submit">
			确认修改
		</view>
	</view>
</template>

<script>
	import {changePassword} from "@/api/login.js"
	import {getUserInfo} from '@/api/my/my.js'
	export default {
		data() {
			return {
				form:{
					pas:"",
					pas2:"",
					pas3:"",
				},
				havePassword:null
			};
		},
		onLoad() {
			getUserInfo().then(res=>{
				console.log(res,'用户信息',res.data.data.havePassword);
				this.havePassword = res.data.data.havePassword;
			})	
		},
		methods:{
			submit(){
				changePassword({
					  "originPassword": this.form.pas,
					  "newPassword": this.form.pas2,
					  "newPasswordRepeat": this.form.pas3
				}).then(res=>{
					console.log(res,'修改密码');
					if(res.data.code==0){
						this.$store.dispatch('LogOut');
						uni.showToast({
							title:'修改成功',
							icon:"none"
						})
						setTimeout(()=>{
							uni.reLaunch({
								url:'/pages/wxLogin/wxLogin'
							})
						},1000)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						})
					}
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
	.forgetPassword{
		.inputBox{
			background-color: #fff;
			padding-left: 30rpx;
			.input{
				height: 110rpx;
				border-bottom: 1px solid #eee;
				display: flex;
				align-items: center;
				&.none{
					border: none;
				}
			}	
		}
		.submit{
			margin-top: 24rpx;
			width: 100%;
			height: 112rpx;
			background: #FFFFFF;	
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #D71507;
			text-align: center;
			line-height: 112rpx;
		}
	}
</style>
