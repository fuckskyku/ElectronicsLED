import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import commandPost from '@/components/commandPost'
import ForgetPassword from '@/components/ForgetPassword'
import Register from '@/components/Register'
import Home from '@/components/Home'
import NotFoundPage from '@/components/NotFoundPage'
import BaseSettingIndex from '@/components/baseSetting/BaseIndex'
import SchoolInfo from '@/components/baseSetting/SchoolInfo'
import EditSchoolInfo from '@/components/baseSetting/EditSchoolInfo'
import UserDutyList from '@/components/baseSetting/UserDutyList'
import EditUserDuty from '@/components/baseSetting/EditUserDuty'
import UserList from '@/components/baseSetting/UserList'
import EditUser from '@/components/baseSetting/EditUser'
import TeacherList from '@/components/baseSetting/TeacherList'
import EditTeacher from '@/components/baseSetting/EditTeacher'
import ImportTeacher from '@/components/baseSetting/ImportTeacher'
import TeacherSubjectlist from '@/components/baseSetting/TeacherSubjectlist'
import EditTeacherSubject from '@/components/baseSetting/EditTeacherSubject'
import SchoolDutyList from '@/components/baseSetting/SchoolDutyList'
import EditSchoolDuty from '@/components/baseSetting/EditSchoolDuty'
import StudentList from '@/components/baseSetting/StudentList'
import EditStudent from '@/components/baseSetting/EditStudent'
import ImportStudent from '@/components/baseSetting/ImportStudent'
import ClassRoomList from '@/components/baseSetting/ClassRoomList'
import EditClassRoom from '@/components/baseSetting/EditClassRoom'
import ImportClassRoom from '@/components/baseSetting/ImportClassRoom'
import DeviceList from '@/components/baseSetting/DeviceList'
import EditDevice from '@/components/baseSetting/EditDevice'
import ClassList from '@/components/baseSetting/ClassList'
import EditClass from '@/components/baseSetting/EditClass'
import ImportClass from '@/components/baseSetting/ImportClass'
import SubjectList from '@/components/baseSetting/SubjectList'
import EditSubject from '@/components/baseSetting/EditSubject'
import ImportSubject from '@/components/baseSetting/ImportSubject'
import ReleaseIndex from '@/components/releasemanage/ReleaseIndex'
import NoticeList from '@/components/releasemanage/NoticeList'
import EditNotice from '@/components/releasemanage/EditNotice'
import NewsList from '@/components/releasemanage/NewsList'
import EditNews from '@/components/releasemanage/EditNews'
import EditNewsType from '@/components/releasemanage/EditNewsType'
import PhotoList from '@/components/releasemanage/PhotoList'
import EditPhoto from '@/components/releasemanage/EditPhoto'
import ClassgloryList from '@/components/releasemanage/ClassgloryList'
import EditClassGlory from '@/components/releasemanage/EditClassGlory'
import ClassActivityList from '@/components/releasemanage/ClassActivityList'
import EditClassActivity from '@/components/releasemanage/EditClassActivity'
import ClassInfoList from '@/components/releasemanage/ClassInfoList'
import EditClassInfo from '@/components/releasemanage/EditClassInfo'
import GloryList from '@/components/releasemanage/GloryList'
import EditGlory from '@/components/releasemanage/EditGlory'
import MottoList from '@/components/releasemanage/MottoList'
import EditMotto from '@/components/releasemanage/EditMotto'
import ReadingList from '@/components/releasemanage/ReadingList'
import EditReading from '@/components/releasemanage/EditReading'
import EducationIndex from '@/components/educationalmanage/EducationIndex'
import Attendancesetting from '@/components/educationalmanage/Attendancesetting'
import Attendancelist from '@/components/educationalmanage/Attendancelist'
import CurriculumList from '@/components/educationalmanage/CurriculumList'
import EditCurriculum from '@/components/educationalmanage/EditCurriculum'
import CurriculumDetail from '@/components/educationalmanage/CurriculumDetail'
import ScheduleList from '@/components/educationalmanage/ScheduleList'
import EditSchedule from '@/components/educationalmanage/EditSchedule'
import ScheduleDetail from '@/components/educationalmanage/ScheduleDetail'
import MeetingList from '@/components/educationalmanage/MeetingList'
import EditMeeting from '@/components/educationalmanage/EditMeeting'
import ExaminationRoomList from '@/components/educationalmanage/ExaminationRoomList'
import EditExaminationRoom from '@/components/educationalmanage/EditExaminationRoom'
import ExaminationRoomDetailList from '@/components/educationalmanage/ExaminationRoomDetailList'
import EditExaminationRoomDetail from '@/components/educationalmanage/EditExaminationRoomDetail'
import MajorMattersList from '@/components/educationalmanage/MajorMattersList'
import EditMajorMatters from '@/components/educationalmanage/EditMajorMatters'
import FixedScreenList from '@/components/educationalmanage/FixedScreenList'
import EditFixedScreen from '@/components/educationalmanage/EditFixedScreen'
import SchoolCustomList from '@/components/releasemanage/SchoolCustomList'
import EditSchoolCustom from '@/components/releasemanage/EditSchoolCustom'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
    { path: '/', redirect: '/home'},
    { path: '/commandpost',name: 'commandpost',component: commandPost,chilidren:[], meta: {title: '总后台登录' }},
    { path: '/login',name: 'login',component: Login,chilidren:[], meta: {title: '登录' }},
    { path: '/home', name: 'home',   meta: {requireAuth: true,},component: Home, meta: {title: '首页' }},// 添加该字段，表示进入这个路由是需要登录的
    { path: '/forgetpassword', name: 'forgetpassword',   meta: {requireAuth: true,},component: ForgetPassword, meta: {title: '忘记密码' }},
    { path: '/register', name: 'register',   meta: {requireAuth: true,},component: Register, meta: {title: '用户注册' }},
    { path: '/notfoundpage', name: 'notfoundpage',   meta: {requireAuth: true,},component: NotFoundPage, meta: {title: '没有发现指定页面' }},
    { path: '/basesettingindex',name: 'basesettingindex',component: BaseSettingIndex,chilidren:[], meta: {title: '基础设置' }},
    { path: '/schoolinfo',name: 'schoolinfo', component: SchoolInfo,children: [], meta: {title: '学校信息管理' } },
    { path: '/editschoolinfo',name: 'editschoolinfo', component: EditSchoolInfo,children: [], meta: {title: '编辑学校信息' } },
    { path: '/userlist',name: 'userlist', component: UserList,children: [], meta: {title: '用户管理' } },
    { path: '/edituser/:id',name: 'edituser', component: EditUser,children: [], meta: {title: '编辑用户' } },
    { path: '/userdutylist',name: 'userdutylist', component: UserDutyList,children: [], meta: {title: '职务管理' } },
    { path: '/edituserduty/:id',name: 'edituserduty', component: EditUserDuty,children: [], meta: {title: '编辑职务' } },
    { path: '/teacherlist',name: 'teacherlist', component: TeacherList,children: [], meta: {title: '老师管理' } },
    { path: '/editteacher/:teacherId',name: 'editteacher', component: EditTeacher,children: [], meta: {title: '编辑老师' } },
    { path: '/importteacher',name: 'importteacher', component: ImportTeacher,children: [], meta: {title: '导入老师' }  },
    { path: '/teachersubjectlist/:teacherId',name: 'teachersubjectlist', component: TeacherSubjectlist,children: [], meta: {title: '任课管理' } },
    { path: '/editteachersubject/:teacherId/:id',name: 'editteachersubject', component: EditTeacherSubject,children: [], meta: {title: '编辑任课' } },
    { path: '/schooldutylist/:teacherId',name: 'schooldutylist', component: SchoolDutyList,children: [], meta: {title: '职务管理' } },
    { path: '/editschoolduty/:teacherId/:id',name: 'editschoolduty', component: EditSchoolDuty,children: [], meta: {title: '编辑职务' } },
    { path: '/studentlist',name: 'studentlist', component: StudentList,children: [], meta: {title: '学生管理' } },
    { path: '/editstudent/:id',name: 'editstudent', component: EditStudent,children: [], meta: {title: '编辑学生' }},
    { path: '/importstudent',name: 'importstudent', component: ImportStudent,children: [], meta: {title: '导入学生' } },
    { path: '/editclassroom/:id',name: 'editclassroom', component: EditClassRoom,children: [], meta: {title: '编辑教室' } },
    { path: '/importclassroom',name: 'importclassroom', component: ImportClassRoom,children: [], meta: {title: '导入教室' } },
    { path: '/classroomlist',name: 'classroomlist', component: ClassRoomList,children: [], meta: {title: '教室管理' } },
    { path: '/devicelist',name: 'devicelist', component: DeviceList,children: [], meta: {title: '设备管理' }  },
    { path: '/editdevice/:id',name: 'editdevice', component: EditDevice,children: [], meta: {title: '编辑设备' }  },
    { path: '/classlist',name: 'classlist', component: ClassList,children: [], meta: {title: '班级管理' } },
    { path: '/editclass/:id',name: 'editclass', component: EditClass,children: [], meta: {title: '编辑编辑' } },
    { path: '/importclass',name: 'importclass', component: ImportClass,children: [], meta: {title: '导入班级' } },
    { path: '/subjectlist',name: 'subjectlist', component: SubjectList,children: [], meta: {title: '科目管理' } },
    { path: '/editsubject/:id',name: 'editsubject', component: EditSubject,children: [], meta: {title: '编辑科目' } },
    { path: '/importsubject',name: 'importsubject', component: ImportSubject,children: [], meta: {title: '导入科目' } },
    { path: '/releaseindex',name: 'releaseindex', component: ReleaseIndex,children: [] , meta: {title: '发布管理' }},
    { path: '/noticelist',name: 'noticelist', component: NoticeList,children: [], meta: { title: '通知管理' }  },
    { path: '/editnotice/:id',name: 'editnotice', component: EditNotice,children: [], meta: { title: '编辑通知' }  },
    { path: '/newslist',name: 'newslist', component: NewsList,children: [], meta: { title: '资讯管理' }  },
    { path: '/editnews/:id',name: 'editnews', component: EditNews,children: [], meta: { title: '编辑资讯' }  },
    { path: '/editnewstype/:id',name: 'editnewstype', component: EditNewsType,children: [], meta: { title: '编辑资讯类别' }  },
    { path: '/photolist',name: 'photolist', component: PhotoList,children: [], meta: { title: '班级相册' }  },
    { path: '/editphoto/:id',name: 'editphoto', component: EditPhoto,children: [], meta: { title: '编辑相册' }  },
    { path: '/classglorylist',name: 'classglorylist', component: ClassgloryList,children: [], meta: { title: '班级荣誉' } },
    { path: '/editclassglory/:id',name: 'editclassglory', component: EditClassGlory,children: [], meta: { title: '编辑班级荣誉' } },
    { path: '/classactivitylist',name: 'classactivitylist', component: ClassActivityList,children: [], meta: { title: '班级活动' }  },
    { path: '/editclassactivity/:id',name: 'editclassactivity', component: EditClassActivity,children: [], meta: { title: '编辑班级活动' } },
    { path: '/classinfolist',name: 'classinfolist', component: ClassInfoList,children: [],meta:{title:'班级介绍&班规'} },
    { path: '/editclassinfo/:id',name: 'editclassinfo', component: EditClassInfo,children: [], meta: { title: '编辑班级介绍' } },
    { path: '/glorylist',name: 'glorylist', component: GloryList,children: [], meta: { title: '校园风采' } },
    { path: '/editglory/:id',name: 'editglory', component: EditGlory,children: [], meta: { title: '编辑校园风采' } },
    { path: '/mottolist',name: 'mottolist', component: MottoList,children: [], meta: { title: '知识点管理' } },
    { path: '/editmotto/:id',name: 'editmotto', component: EditMotto,children: [], meta: { title: '编辑知识点' } },
    { path: '/readinglist',name: 'readinglist', component: ReadingList,children: [], meta: { title: '读书推荐' } },
    { path: '/editreading/:id',name: 'editreading', component: EditReading,children: [], meta: { title: '编辑读书推荐' } },
    { path: '/educationindex',name: 'educationindex', component: EducationIndex,children: [], meta: { title: '教务管理' }},
    { path: '/attendancesetting',name: 'attendancesetting', component: Attendancesetting,children: [], meta: { title: '考勤设置' } },
    { path: '/attendancelist',name: 'attendancelist', component: Attendancelist,children: [], meta: { title: '考勤管理' }  },
    { path: '/curriculumlist',name: 'curriculumlist', component: CurriculumList,children: [], meta: { title: '课程表管理' }  },
    { path: '/editcurriculum/:id',name: 'editcurriculum', component: EditCurriculum,children: [], meta: { title: '编辑课程表' } },
    { path: '/curriculumdetail/:id',name: 'curriculumdetail', component: CurriculumDetail,children: [], meta: { title: '查看课程表' } },
    { path: '/schedulelist',name: 'schedulelist', component: ScheduleList,children: [], meta: { title: '作息表管理' } },
    { path: '/editschedule/:id',name: 'editschedule', component: EditSchedule,children: [], meta: { title: '编辑作息表' }  },
    { path: '/scheduledetail/:id',name: 'scheduledetail', component: ScheduleDetail,children: [], meta: { title: '查看作息表明细' }  },
    { path: '/meetinglist',name: 'meetinglist', component: MeetingList,children: [], meta: { title: '会议管理' } },
    { path: '/editmeeting/:id',name: 'editmeeting', component: EditMeeting,children: [], meta: { title: '编辑会议' } },
    { path: '/examinationroomlist',name: 'examinationroomlist', component: ExaminationRoomList,children: [], meta: { title: '考试管理' }  },
    { path: '/editexaminationroom/:id',name: 'editexaminationroom', component: EditExaminationRoom,children: [] , meta: { title: '编辑考试' } },
    { path: '/examinationroomdetaillist/:roomid',name: 'examinationroomdetaillist', component: ExaminationRoomDetailList,children: [], meta: { title: '设置考场信息' } },
    { path: '/editexaminationroomdetail/:roomid/:id',name: 'editexaminationroomdetail', component: EditExaminationRoomDetail,children: [] , meta: { title: '编辑考场信息' }},
    { path: '/majormatterslist',name: 'majormatterslist', component: MajorMattersList,children: [], meta: { title: '重大事件倒计时管理' } },
    { path: '/editmajormatters/:id',name: 'editmajormatters', component: EditMajorMatters,children: [], meta: { title: '编辑重大事件倒计时' } },
    { path: '/fixedscreenlist',name: 'fixedscreenlist', component: FixedScreenList,children: [], meta: { title: '占屏管理' }  },
    { path: '/editfixedscreen/:id',name: 'editfixedscreen', component: EditFixedScreen,children: [], meta: { title: '编辑占屏' } },
    { path: '/schoolcustomlist',name: 'schoolcustomlist', component: SchoolCustomList,children: [], meta: { title: '自定义显示管理' }  },
    { path: '/editschoolcustom/:id',name: 'editschoolcustom', component: EditSchoolCustom,children: [], meta: { title: '编辑自定义显示' } },
  ]
});


