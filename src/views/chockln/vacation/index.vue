<template>
  <div class="pandle-box">
    <div class="pandle-box-right">
      <div class="pandle-box-right-serach">
        <div class="calendar-header-box">
          <a-input-search
            v-model:value="searchValue"
            placeholder="请输入日程关键词"
            style="width: 180px"
          />
        </div>
        <div class="calendar-header-box calendar-header">
          <a @click="handleChangeTime('prive')"><i class="el-icon-arrow-left"></i></a>
          <span class="calendar-header-time">{{currentTimeShow}}</span>
          <span @click="handleChangeTime('next')"><i class="el-icon-arrow-right"></i></span>
        </div>
        <div class="calendar-header-box" style="display: flex">
          <el-button icon="el-icon-plus" class='btn-mg' @click="setCurrentTime">今天</el-button>
        </div>
      </div>
      <div class="CalendarBox" ref="CalendarBox">
        <FullCalendar :options="calendarOptions" ref="calendarRef" class="eventDeal-wrap" id="calendarRef">
          <template v-slot:eventContent="arg">
            <div>
              <div>
                <p>{{arg.event.title}}</p>
              </div>
            </div>
          </template>
        </FullCalendar>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogDay"  width="60%" center>
      <div>
        <el-radio-group v-model="query.type" @change="initVacation">
          <el-radio-button
            v-for="item in types"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >{{item.label}}</el-radio-button>
        </el-radio-group>

        <el-table :data="vacationData">
          <el-table-column label="昵称" align="center" prop="uname" width="100"/>
          <el-table-column label="部门" align="center" prop="deptName" width="100"/>
          <el-table-column label="签到类型" align="center"
                           prop="signInImg,signOutImg,signInTime,signOutTime,signInRemark,signOutRemark"
                           width="200" >
            <template slot-scope="scope">
              <div v-if="scope.row.type === 1">
                <!-- 签到 -->
                <div v-if="scope.row.signInTime"  style="display: flex;justify-content: space-around;align-items: center;margin-bottom: 10px;">
                  <div >
                    上班卡： {{ JSON.parse(scope.row.signInRemark).type }}
                    {{ JSON.parse(scope.row.signInRemark).msg ? JSON.parse(scope.row.signInRemark).msg + "分钟" : "" }}
                  </div>
<!--                  <el-button type="primary" plain @click="showImage(scope.row.signInImg)" size="mini">查看图片</el-button>-->
                </div>
                <el-button type="danger" plain v-else size="mini">未签到</el-button>
                <el-button type="danger" plain v-if="!scope.row.signOutTime" size="mini">未签退</el-button>
                <!-- 签退 -->
                <div style="display: flex;justify-content: space-around;align-items: center;" v-else>
                  <div>
                    <div>下班卡{{ JSON.parse(scope.row.signOutRemark).type }}{{ JSON.parse(scope.row.signOutRemark).msg ?
                      JSON.parse(scope.row.signOutRemark).msg + "分钟" : "" }}</div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div>备注:{{ scope.row.askForLeave }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="打卡位置" align="center" prop="signInLocation">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 1">
                <div>{{ scope.row.signInLocation }}</div>
                <div>{{ scope.row.signOutLocation }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="外勤签到" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.tfwChocklnOutsides.length }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize"
                    @pagination="initVacation" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDay = false">取 消</el-button>
        <el-button type="primary" @click="dialogDay = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from '@fullcalendar/daygrid'//日历格子显示
import interactionPlugin from "@fullcalendar/interaction";//交互
import timeGridPlugin from "@fullcalendar/timegrid";//日历时间轴显示
import zhLocale from "@fullcalendar/core/locales/zh-cn";//中文
import dayjs from 'dayjs';
import { queryMonth,listChockln } from '@/api/chockln/chockln'
export default {
  name: 'HelloWorld',
  dicts: ['tfw_qqlx','tfw_daka'],
  components: {
    FullCalendar,
  },
  props: {
  },
  data(){
    return {
      dayjs,
      loading: false, //加载框
      queryPrams: {
        month: null,
        deptId: null,
      }, //查询条件
      searchValue:'',
      currentType:'month',//默认月份面板
      currentDefaultType:'month',//默认月份面板
      currentTime:dayjs(),//默认当前时间
      calendarApi:null,
      currentTimeShow:null, //当前显示title时间
      calendarOptions: {//日历配置
        plugins: [dayGridPlugin, timeGridPlugin,interactionPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar:false,
        firstDay: '0', // 设置一周中显示的第一天是周几，周日是0，周一是1，以此类推
        // locales: [zhLocale],
        handleWindowResize: true,
        locale: "zh-cn",
        allDaySlot: true, // 不显示all-day
        weekNumberCalculation: 'ISO', // 与firstDay配套使用
        eventCOlor: '#3d8eec', // 全部日历日程背景色timeGridEventMinHeight: '20', // 设置事件的最小高度
        slotEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认true允许
        aspectRatio: '2', // 设置日历单元格宽高比
        height:'100%',
        fixedWeekCount:false,
        // displayEventTime: false, // 是否显示事件时间
        // allDaySlot: false, // 周、日视图时，all-day不显示
        events: [], // 日程数组
        eventTimeFormat: { // like '14:30:00'
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        },
        // 事件
        editable: false, // 是否可以进行（拖动、缩放）修改
        // eventStartEditable: true, // Event日程开始时间可以改变，默认为true，若为false,则表示开始结束时间范围不能拉伸，只能拖拽
        // eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认为true,若为false，则表示开始结束时间范围不能拉伸，只能拖拽
        selectable: true, // 是否可以选中日历格
        selectMirror: true,
        selectMinDistance: 0, // 选中日历格的最小距离
        dayMaxEventRows: true, // for all non-TimeGrid views
        moreLinkContent: this.moreLinkContent, //当一块区域内容太多以"+2 more"格式显示时，这个more的名称自定义
        weekends: true,
        navLinks: false, // “xx周”是否可以被点击，默认false，如果为true则周视图“周几”被点击之后进入日视图
        selectHelper: false,
        selectEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认为true，允许
        nowIndicator: true, //周/日视图中显示今天当前时间点（以红线标记），默认false不显示
        // dayMaxEvents: true,
        // select: this.handleDateClick, //选中日历格事件
        dateClick: this.handleDateClick, // 日期点击
        // eventsSet: this.handleEvents, // 事件点击（--暂未发现作用）
        eventClick: this.handleEventClick, // 日程点击信息展示
        eventResize: this.onEventResize, // 事件时间区间调
        // eventDrop: this.handleEventDrop, // 日程拖动事件
        // eventResize: this.eventResize // 日程缩放事件
        // windowResize: function (view) {
        //   this.$refs.calendarRef.fullCalendar('destroy'); //销毁原来的日历
        //   initial() //生成新的日历
        // }
      },
      title: '', //弹框标题
      dialogDay: false, //弹框控制
      types: [{
        label: '上班',
        value: '1',
      },{
        label: '休假',
        value: '4',
      }],
      query: {
        type: '1',
        pageNum: 1,
        pageSize: 10,
      },
      vacationData : null,
      total: 0,
    }
  },
  mounted(){
    // 获取用户信息
    this.queryPrams.deptId = this.$store.state.user.companyDept.deptId;
    this.calendarApi = this.$refs.calendarRef.getApi();
    this.currentTimeShow = dayjs(this.currentTime).format('YYYY-MM')
    this.getScheduleList()
  },
  created() {
    let tfw_daka = dict.type.tfw_daka
    console.log(tfw_daka)
    this.spinningBoxRight = true
  },
  methods:{
    // 获取日程列表
    getScheduleList() {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.queryPrams.month = this.currentTimeShow;
      queryMonth(this.queryPrams).then(res => {
        this.calendarOptions.events = res.data
        setTimeout(() => {
          this.autoScaleFullCalendar();
        },1000)
        loading.close();
      })
    },
    // 点击日程事件-查看对应日程
    handleEventClick(clickInfo){
      this.checkVacation(clickInfo.event.startStr)
      console.log(clickInfo,'点击日程事件-查看对应日程')
    },
    //事件时间区间调
    onEventResize(clickInfo) {
      console.log(clickInfo,'事件时间区间调')
    },
    //选中日历格事件
    handleDateClick(clickInfo) {
      this.checkVacation(clickInfo.dateStr)
      console.log(clickInfo,'选中日历格事件')
    },
    // 返回至当前日期
    setCurrentTime(){
      this.currentTime = dayjs()
      this.currentTimeShow = dayjs(this.currentTime).format('YYYY-MM')
      this.calendarApi.today();
      this.getScheduleList();
    },
    // 日程视图-切换
    handleChangeTime(type){
      // this.loading = true
      let changeTime = null
      if(type === 'prive'){
        // this.calendarApi.prev();
        // changeTime = dayjs(this.calendarApi.getDate())
        changeTime = dayjs(this.currentTime).subtract(1,this.currentType)
      }else{
        // this.calendarApi.next();
        changeTime = dayjs(this.currentTime).add(1,this.currentType)
      }
      this.currentTime = changeTime
      this.currentTimeShow = this.currentType === 'day' ? dayjs(this.currentTime).format('YYYY-MM-DD'):(this.currentType === 'week' ?
        this.calendarApi.view.title:
        dayjs(this.currentTime).format('YYYY-MM'))
      this.calendarApi.gotoDate(dayjs(changeTime).format('YYYY-MM-DD HH:mm'))
      this.getScheduleList();
    },
    // 增加自适应大小调整的特性
    autoScaleFullCalendar() {
      document.getElementsByClassName('fc-col-header') && document.getElementsByClassName('fc-col-header')[0].removeAttribute('style');
      document.getElementsByClassName('fc-daygrid-body') && document.getElementsByClassName('fc-daygrid-body')[0].removeAttribute('style');
      let defaultHeigth = document.getElementsByClassName('fc-scrollgrid-sync-table') && document.getElementsByClassName('fc-scrollgrid-sync-table')[0] && document.getElementsByClassName('fc-scrollgrid-sync-table')[0].style.height?document.getElementsByClassName('fc-scrollgrid-sync-table')[0].style.height:''
      console.log('defaultHeigth',defaultHeigth)
      document.getElementsByClassName('fc-scrollgrid-sync-table') && document.getElementsByClassName('fc-scrollgrid-sync-table')[0].removeAttribute('style');
      if(document.getElementsByClassName('fc-timegrid-body')&& document.getElementsByClassName('fc-timegrid-body')[0]){
        // 针对周时间轴的设置
        document.getElementsByClassName('fc-timegrid-body')[0].removeAttribute('style');
        document.querySelector('.fc-timegrid-slots table').removeAttribute('style')
        document.querySelector('.fc-timegrid-cols table').removeAttribute('style')
      }
      document.getElementsByClassName('fc-scrollgrid-sync-table')[0].style.height = defaultHeigth
    },
    // 月视图日程过多显示样式
    moreLinkContent(arg){
      return '还有'+ arg.num +'个日程'
    },
    // 判断日程是否跨天
    isAllDay(startTime,endTime){
      return dayjs(startTime).format('YYYY-MM-DD') != dayjs(endTime).format('YYYY-MM-DD') || (dayjs(startTime).format('YYYY-MM-DD') == dayjs(endTime).format('YYYY-MM-DD') && dayjs(startTime).format('HH:mm') == '00:00'&& dayjs(endTime).format('HH:mm') == '23:59')
    },
    // 重新渲染日历
    renderCalendar(){
      this.calendarApi.render()
    },
    //根据“,”换行
    formattedTitle(title) {
      // 使用逗号分割字符串，并用 <br> 标签连接
      return title.split(',').join('<br>');
    },

    /**
     * el-table-column 自适应列宽
     * @param prop_label: 表名
     * @param table_data: 表格数据
     *
     */
    flexColumnWidth(label, prop, a) {
      const arr = this.chocklnList.map(x => x[a])
      let flag=false
      for (const arrElement of arr) {
        if (arrElement !=null){
          flag=true
        }
      }
      if (flag) {
        arr.push(label) // 把每列的表头也加进去算
        // console.log(arr)
        // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
        return (this.getMaxLength(arr) + 25) + 'px'
      } else {
        // 1.获取该列的所有数据
        const arr = this.chocklnList.map(x => x[prop])
        arr.push(label) // 把每列的表头也加进去算
        // console.log(arr)
        // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
        return (this.getMaxLength(arr) + 25) + 'px'
      }

    },
    //处理事件
    //检查当前日期是否有日程信息
    checkVacation(date) {
      let loading = this.$loading({ fullscreen: true })
      listChockln({
        params: {
          beginTime: date,
          endTime: date
        }
      }).then(res => {
        loading.close()
        if(res.total > 0) {
          this.title = date + "考勤一览";
          this.dialogDay = true
          this.query.type = "1";
          this.query.params = {
            beginTime: date,
            endTime: date
          };
          this.initVacation();
        }
      })
    },
    initVacation() {
      let loading = this.$loading({ fullscreen: true })
      console.log(this.query, 'query')
      listChockln(this.query).then(res => {
        loading.close()
        this.vacationData = res.rows;
        this.total = res.total;
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 自定义事件标题的样式 */
/* 自定义 FullCalendar 事件标题的样式 */
.fc-daygrid-event .fc-event-main {
  /* 如果 FullCalendar 版本或主题不同，可能需要调整选择器 */
  /* 针对事件内部的 p 标签设置样式 */
}

.fc-daygrid-event p {
  /* 直接针对 p 标签应用样式 */
  word-wrap: break-word; /* 或者使用 overflow-wrap: break-word; */
  white-space: normal;  /* 允许文本换行 */
  margin: 0; /* 移除默认的外边距（如果需要） */
  padding: 0 5px;
}
.calendar-operation-box {
  .checkbox-group-item-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    padding: 3px 10px;
    cursor: pointer;
    .op-btn {
      padding: 3px;
      border-radius: 2px;
      &:hover {
        background-color: rgba(187, 187, 187, 0.3);
      }
    }
    &:hover {
      background-color: rgba(187, 187, 187, 0.2);
    }
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .checkbox-group-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden; /* 解决省略号不生效的问题 */
    .checkbox-wrapper {
      overflow: hidden;
      flex: 1; /* 让复选框占据剩余空间 */
    }
    .checkbox-item {
      width: 100%;
      display: flex;
      align-items: center;
      >>> .ant-checkbox {
        top: 0;
      }
      .checkbox-label-item {
        width: 100%;
        line-height: 1;
        display: inline-block; /* 取消span格式，从而可以设置span的宽度和高度 */
        overflow: hidden; /* 表示超出宽度的部分隐藏 */
        text-overflow: ellipsis; /* 表示显示省略符号来代表被修剪的文本 */
        white-space: normal; /* 规定段落中的文本换行 */
      }
    }
    .hover-buttons {
      display: none;
    }
    >>> .checkbox-item > span {
      &:nth-child(2) {
        display: inline-flex;
        width: calc(100% - 16px);
      }
    }
    .checkbox-group-item-box:hover .hover-buttons {
      display: block;
    }
    .checkbox-group-btn-box {
      white-space: normal;
    }
    .ant-checkbox-wrapper + .ant-checkbox-wrapper {
      margin-left: 6px;
    }
    >>> .ant-checkbox-checked {
      .ant-checkbox-inner {
        background-color: var(--fill-color);
        border-color: var(--fill-color);
        // background-color: red;
        // border-color: #1890ff;
      }
    }
  }
}

.calendar-click{
  cursor: pointer;
}
.pandle-box{
  width: 100%;
}
.eventDeal-wrap {
  width: 100%;
  /* 深度作用选择器 */
  >>> .fc-event-title-container {
    padding: 0px 8px;
    word-wrap: break-word; /* 或者使用 overflow-wrap: break-word; */
    white-space: normal;  /* 允许文本换行 */
  }

  >>> .fc-popover-body {
    max-width: 150px;
    min-width: auto;
  }

  >>> .fc-event .fc-event-main {
    overflow: hidden;
  }

  >>> .fc-event .fc-event-title {
    text-overflow: ellipsis;
  }

  >>> .fc-timegrid-event-short .fc-event-time::after {
    content: '';
  }

  >>> .fc-timegrid-event-short .fc-event-time::before {
    content: " - ";
  }

  >>> a {
    color: #272727;
  }

  >>> .text-normal {
    .fc-sticky {
      font-weight: bold;
    }
  }

  >>> .text-normal-gary {
    &:after {
      background-color: #fff;
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
      bottom: -1px;
      content: "";
      left: -1px;
      opacity: 0.55;
      pointer-events: none;
      position: absolute;
      right: -1px;
      top: -1px;
      z-index: 2;
    }
  }

  >>> .gb-hight {
    background-color: rgba(24, 144, 255, 0.2) !important;
  }
}
.font-bold{
  font-weight: 600;
}
.day-list-item{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;
  background-color: rgba($color: #2097f3, $alpha: 0.1);
  border-left: 5px solid #2097f3;
  border-radius:5px;
  h3{
    font-weight: 700;
  }
  .time-gary{
    color: #666;
    flex-shrink: 0;
  }
  .day-list-item-right{
    display: flex;
    align-items: center;
    .day-list-item-right-item{
      display: flex;
      align-items: center;
    }
    .day-list-item-right-text{
      display: inline-block;
      max-width:250px; /* 定义容器宽度 */
      white-space: normal; /* 允许换行 */
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 使用省略号 */
    }
    span{
      margin-left: 10px;
    }
  }
}
.day-list-item-gary{
  background-color: rgba($color: #838688, $alpha: 0.1) !important;
  border-left: 5px solid #838688 !important;
}
.pandle-box{
  display: flex;
  width: 100%;
  height:calc(100vh - 100px);
  min-height: 670px;
  .pandle-box-right{
    width:calc(100%);
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .CalendarBox{
      flex: 1;
      .CalendarItem{
        padding-left: 8px;
        position: relative;
        .calendar-label{
          position: absolute;
          top: -1px;
          left:-1px;
          bottom: -1px;
          width: 5px;
          z-index: 999;
          border-radius: 3px 0 0 3px;
        }
      }
    }
    .pandle-box-right-serach{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      flex-wrap: wrap;
      .btn-mg{
        margin-right: 10px;
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .calendar-header-box{
      margin-bottom: 10px;
    }
    .calendar-header{
      font-size: 16px;
    }
    .calendar-header-time{
      padding: 0 15px;
    }
  }
}

</style>
