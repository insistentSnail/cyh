import request from '../request.js'
// 获得康养服务-项目列表
export const 
getProjects= params => request({ url: '/api/Recuperate/GetProjects', methods: 'GET' , data: params });
// 获得康养服务-项目详情
export const 
getProjectDetail= params => request({ url: '/api/Recuperate/GetProjectDetail', methods: 'GET' , data: params });
// 获得康养服务-资讯列表
export const 
getInfos= params => request({ url: '​/api/Recuperate/GetInfos', methods: 'GET' , data: params });
// 获得康养服务-资讯详情
export const 
getInfoDetail= params => request({ url: '​/api/Recuperate/GetInfoDetail', methods: 'GET' , data: params });
// 获得集团介绍
export const 
getGroupCompanyDesc= params => request({ url: '​/api/Recuperate/GetGroupCompanyDesc', methods: 'GET' , data: params });
// 获取banner图
export const 
getBanners= params => request({ url: '​/api/Recuperate/GetBanners', methods: 'GET' , data: params });