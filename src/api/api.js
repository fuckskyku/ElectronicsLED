import req from './apiSetting'

//获取七牛token
export const getQiniuToken = param => { return req.get('/bp/getQiniuToken', param) }

//帐号登录
export const login = param => { return req.post('/admin/login', param) }

export const getSchoolNameAndLogo=param => { return req.get('/admin/getSchoolNameAndLogo', param) }

//【首页】获取学校统计
export const getSchoolStatistic = param => { return req.get('/admin/getSchoolStatistic', param) }

//获取用户列表
export const getUserList = param => { return req.get('/admin/getUserList', param) }

//获取用户明细
export const getUserDetail = param => { return req.get('/admin/getUserDetail', param) }

//新增/编辑用户
export const editUser = param => { return req.post('/admin/editUser', param) }

//获取学校列表
export const getMySchoolList = param => { return req.get('/admin/getMySchoolList', param) }

//切换学校
export const setSchoolCredential = param => { return req.get('/admin/setSchoolCredential', param) }

//获取学校信息
export const getSchoolInfo = param => { return req.get('/admin/getSchoolInfo', param) }

//编辑学校信息
export const editSchoolInfo = param => { return req.post('/admin/editSchoolInfo', param) }

//班级管理
export const getClassList = param => { return req.get('/admin/getClassList', param) }

//获取班级信息
export const getClassDetail = param => { return req.get('/admin/getClassDetail', param) }

//获取班级树
export const getClassTree = param => { return req.get('/admin/getClassTree', param) }

//新增、编辑班级
export const editClass = param => { return req.post('/admin/editClass', param) }

//删除班级
export const delClass = param => { return req.get('/admin/delClass', param) }

//职务管理
export const getDutyList = param => { return req.get('/admin/getDutyList', param) }

//获取职务信息
export const getDutyDetail = param => { return req.get('/admin/getDutyDetail', param) }

//新增、编辑职务
export const editDuty = param => { return req.post('/admin/editDuty', param) }

//删除职务
export const delDuty = param => { return req.get('/admin/delDuty', param) }


//学生管理
export const getStudentList = param => { return req.get('/admin/getStudentList', param) }

//获取学生信息
export const getStudentDetail = param => { return req.get('/admin/getStudentDetail', param) }

//新增、编辑学生
export const editStudent = param => { return req.post('/admin/editStudent', param) }

//删除学生
export const delStudent = param => { return req.get('/admin/delStudent', param) }

//获取年级列表
export const getSchoolGradeList = param => { return req.get('/admin/getSchoolGradeList', param) }

//获取教室列表
export const getBuildingList = param => { return req.get('/admin/getBuildingList', param) }

//删除教室
export const delBuilding = param => { return req.get('/admin/delBuilding', param) }

//新增、编辑教室
export const editBuilding = param => { return req.post('/admin/editBuilding', param) }

//获取教室信息
export const getBuildingDetail = param => { return req.get('/admin/getBuildingDetail', param) }

//获取科目列表
export const getSubjectList = param => { return req.get('/admin/getSubjectList', param) }

//获取科目信息
export const getSubjectDetail = param => { return req.get('/admin/getSubjectDetail', param) }

//新增、编辑科目
export const editSubject = param => { return req.post('/admin/editSubject', param) }

//删除科目
export const delSubject = param => { return req.get('/admin/delSubject', param) }

//获取通知列表
export const getNoticeList = param => { return req.get('admin/getNoticeList',param) }

//删除通知
export const delNotice = param => { return req.get('admin/delNotice',param) }

//获取通知信息
export const getNoticeDetail = param => { return req.get('admin/getNoticeDetail',param) }

//新增/编辑通知
export const editNotice = param => { return req.post('admin/editNotice',param) }

//获取设备列表
export const getClientList = param => { return req.get('/admin/getClientList', param) }

//获取设备信息
export const getClientDetail = param => { return req.get('/admin/getClientDetail', param) }

//新增、编辑设备
export const editClient = param => { return req.post('/admin/editClient', param) }

//删除设备
export const delClient = param => { return req.get('/admin/delClient', param) }

//获取教师列表
export const getTeacherList = param => { return req.get('/admin/getTeacherList', param) }

//获取教师信息
export const getTeacherDetail = param => { return req.get('/admin/getTeacherDetail', param) }

//新增、编辑教师
export const editTeacher = param => { return req.post('/admin/editTeacher', param) }

//删除教师
export const delTeacher = param => { return req.get('/admin/delTeacher', param) }


//获取教师职务列表
export const getTeacherDutyList = param => { return req.get('/admin/getTeacherDutyList', param) }

//获取教师职务信息
export const getTeacherDutyDetail = param => { return req.get('/admin/getTeacherDutyDetail', param) }

//新增、编辑教师职务
export const editTeacherDuty = param => { return req.post('/admin/editTeacherDuty', param) }

//删除教师职务
export const delTeacherDuty = param => { return req.get('/admin/delTeacherDuty', param) }



//获取教师任课列表
export const getTeacherSubjectList = param => { return req.get('/admin/getTeacherSubjectList', param) }

//获取教师任课信息
export const getTeacherSubjectDetail = param => { return req.get('/admin/getTeacherSubjectDetail', param) }

//新增、编辑任课
export const editTeacherSubject = param => { return req.post('/admin/editTeacherSubject', param) }

//删除任课
export const delTeacherSubject = param => { return req.get('/admin/delTeacherSubject', param) }



//获取重大事项倒计时列表
export const getMajormattersList = param => { return req.get('/admin/getMajormattersList', param) }

//获取重大事项倒计时信息
export const getMajormattersDetail = param => { return req.get('/admin/getMajormattersDetail', param) }

//新增、编辑重大事项倒计时
export const editMajormatters = param => { return req.post('/admin/editMajormatters', param) }

//删除重大事项倒计时
export const delMajormatters = param => { return req.get('/admin/delMajormatters', param) }

//获取会议列表
export const getMeetingList = param => { return req.get('/admin/getMeetingList', param) }

//获取会议信息
export const getMeetingDetail = param => { return req.get('/admin/getMeetingDetail', param) }

//新增、编辑会议
export const editMeeting = param => { return req.post('/admin/editMeeting', param) }

//删除会议
export const delMeeting = param => { return req.get('/admin/delMeeting', param) }

//获取资讯列表
export const getNewsList = param => { return req.get('/admin/getNewsList', param) }

//删除新闻
export const delNews = param => { return req.get('/admin/delNews', param) }

//
//获取资讯信息
export const getNewsDetail = param => { return req.get('/admin/getNewsDetail', param) }

//新增/编辑新闻
export const editNews = param => { return req.post('/admin/editNews', param) }

//获取资讯类别信息
export const getNewsTypeDetail = param => { return req.get('/admin/getNewsTypeDetail', param) }

//获取资讯类别列表
export const getNewsTypeList = param => { return req.get('/admin/getNewsTypeList', param) }

//新增/编辑资讯类别列表
export const editNewsType = param => { return req.post('/admin/editNewsType', param) }

//获取相册列表
export const getPhotoList = param => { return req.get('/admin/getPhotoList', param) }

//删除相册
export const delPhoto = param => { return req.get('/admin/delPhoto', param) }

//获取相册信息
export const getPhotoDetail = param => { return req.get('/admin/getPhotoDetail', param) }

//新增/编辑相册
export const editPhoto = param => { return req.post('/admin/editPhoto', param) }

//获取作息表列表
export const getScheduleList = param => { return req.get('/admin/getScheduleList', param) }

//获取作息表信息
export const getScheduleDetail = param => { return req.get('/admin/getScheduleDetail', param) }

//新增、编辑作息表
export const editSchedule = param => { return req.postFormData('/admin/editSchedule', param) }

//删除作息表
export const delSchedule = param => { return req.get('/admin/delSchedule', param) }

//获取课程表列表
export const getCurriculumList = param => { return req.get('/admin/getCurriculumList', param) }

//获取课程表信息
export const getCurriculumDetail = param => { return req.get('/admin/getCurriculumDetail', param) }

//新增、编辑课程表
export const editCurriculum = param => { return req.postFormData('/admin/editCurriculum', param) }

//删除课程表
export const delCurriculum = param => { return req.get('/admin/delCurriculum', param) }
//
//获取班级活动列表
export const getClassactivityList = param => { return req.get('/admin/getClassactivityList', param) }

//删除班级活动
export const delClassactivity = param => { return req.get('/admin/delClassactivity', param) }

//新增/编辑班级活动
export const editClassactivity = param => { return req.post('/admin/editClassactivity', param) }

//获取班级活动信息
export const getClassactivityDetail = param => { return req.get('/admin/getClassactivityDetail', param) }

//获取班级荣誉列表
export const getClassgloryList = param => { return req.get('/admin/getClassgloryList', param) }

//获取班级荣誉信息
export const getClassgloryDetail = param => { return req.get('/admin/getClassgloryDetail', param) }

//删除班级荣誉
export const delClassglory = param => { return req.get('/admin/delClassglory', param) }

//新增/编辑班级荣誉
export const editClassglory = param => { return req.post('/admin/editClassglory', param) }

//获取班级介绍列表
export const getClassInfoList = param => { return req.get('/admin/getClassInfoList', param) }

//获取班级介绍信息
export const getClassInfoDetail = param => { return req.get('/admin/getClassInfoDetail', param) }

//编辑班级介绍
export const editClassInfo = param => { return req.post('/admin/editClassInfo', param) }

//删除班级介绍
export const delClassInfo = param => { return req.get('/admin/delClassInfo', param) }

//获取读书推荐列表
export const getReadingList = param => { return req.get('/admin/getReadingList', param) }

//获取读书推荐信息
export const getReadingDetail = param => { return req.get('/admin/getReadingDetail', param) }

//新增/编辑读书推荐
export const editReading = param => { return req.post('/admin/editReading', param) }

//删除读书推荐
export const delReading = param => { return req.get('/admin/delReading', param) }

//获取校园风采列表
export const getGloryList = param => { return req.get('/admin/getGloryList', param) }

//获取校园风采信息
export const getGloryDetail = param => { return req.get('/admin/getGloryDetail', param) }

//新增/编辑校园风采
export const editGlory = param => { return req.post('/admin/editGlory', param) }

//删除校园风采
export const delGlory = param => { return req.get('/admin/delGlory', param) }

//获取知识点列表
export const getMottoList = param => { return req.get('/admin/getMottoList', param) }

//获取知识点信息
export const getMottoDetail = param => { return req.get('/admin/getMottoDetail', param) }

//新增/编辑知识点
export const editMotto = param => { return req.post('/admin/editMotto', param) }

//删除知识点
export const delMotto = param => { return req.get('/admin/delMotto', param) }

//获取考勤列表
export const getAttendanceList = param => { return req.get('/admin/getAttendanceList', param) }

//获取考勤设置信息
export const getAttendanceSetting = param => { return req.get('/admin/getAttendanceSetting', param) }

//编辑考勤设置
export const attendanceSetting = param => { return req.post('/admin/attendanceSetting', param) }

//获取占屏信息
export const getFixedScreenDetail = param => { return req.get('/admin/getFixedScreenDetail', param) }

//获取占屏记录列表
export const getFixedScreenList = param => { return req.get('/admin/getFixedScreenList', param) }

//获取轮播页列表
export const getScreenList = param => { return req.get('/admin/getScreenList', param) }

//删除占屏
export const delFixedScreen = param => { return req.get('/admin/delFixedScreen', param) }

//新增/编辑占屏
export const editFixedScreen = param => { return req.post('/admin/editFixedScreen', param) }

//获取考试列表
export const getExamList = param => { return req.get('/admin/getExamList', param) }

//获取考场列表
export const getExamRoomList = param => { return req.get('/admin/getExamRoomList', param) }

//获取考试信息
export const getExamDetail = param => { return req.get('/admin/getExamDetail', param) }

//获取考场信息
export const getExamRoomDetail = param => { return req.get('/admin/getExamRoomDetail', param) }

//删除考试
export const delExam = param => { return req.get('/admin/delExam', param) }

//删除考场
export const delExamRoom = param => { return req.get('/admin/delExamRoom', param) }

//新增/编辑考试
export const editExam = param => { return req.post('/admin/editExam', param) }

//新增/编辑考场
export const editExamRoom = param => { return req.postFormData('/admin/editExamRoom', param) }

//获取模块权限
export const getModulePermission=param=>{return req.get('/admin/getModulePermission',param)}

//发送验证码
export const getPhoneCode=param=>{return req.get('/admin/getPhoneCode',param)}

//找回密码
export const editUserPwd = param => { return req.post('/admin/editUserPwd', param) }

//获取城市列表
export const getCity = param=>{return req.get('/admin/getCity',param)}

//获取城市列表2
export const getCity2 = param=>{return req.get('/admin/getCity2',param)}

//注册
export const register=param=>{return req.post('/admin/register',param)}

//获取自定义显示列表
export const getSchoolCustomList = param => { return req.get('/admin/getSchoolCustomList', param) }

//获取自定义显示信息
export const getSchoolCustomDetail = param => { return req.get('/admin/getSchoolCustomDetail', param) }

//删除自定义显示
export const delSchoolCustom = param => { return req.get('/admin/delSchoolCustom', param) }

//新增/编辑自定义显示
export const editSchoolCustom = param => { return req.post('/admin/editSchoolCustom', param) }

//上下架自定义显示
export const updateSchoolCustom = param => { return req.post('/admin/updateSchoolCustom', param) }