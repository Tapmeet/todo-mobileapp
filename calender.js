//https://github.com/wix/react-native-calendars
import React, { PureComponent } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ImageBackground,
  ScrollView,
  Alert, ActivityIndicator, KeyboardAvoidingView, Modal,
} from 'react-native';
import * as _ from 'lodash';
import { Text, Button, Icon, Toast } from 'native-base';
import { CalendarList, Calendar } from 'react-native-calendars';
import { styles } from './CustomStyleSheet';
import NotifService from './NotifService';
import {
  heightPercentageToDP,
  PixelToDP, responsiveFontSize,
  widthPercentageToDP,
} from './PixelRatio';
import { AddTaskDialog } from './AddTaskDialog';
import SQLdatabase from './SQLdatabase';
import { Progress, Priority } from './InsertInToDatabase';
import { CancelNotificationOfCompleteTask, setNotificationOfInCompleteTask } from './setNotification';

const db = new SQLdatabase();
var task,
  taskDescription,
  currentMonth = '',
  currentDate = '',
  selectedTask = [],
  repeatDays = [];
var logo =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAiCAYAAACnSgJKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIQSURBVHgBtVftccIwDFV6/V9G8AbNCOkG3QA2gE4AG5QNaCegnQA2gE5gNgidQJVqpxhFTk2cvDudkyD7WbI+TAEZQMQJDVOSkuRMciyK4h3GBJOSvKIOS2JgDNDCFUmN3bDeK4MSLyNEa5I3sakFDAWFuJYE9D4jOfjfNzAEFGJLUip6ZUC+g1zQInNMDCh08WC93hpywCSpxF5/SbL1us/QF+jSyQryMmEOk1vIAbbzOCl6/Yan0Bf+7EIknR+7mmQFORDu5uekguGDs39xQZerIZJdiLlVTVi9hRFxL4hnNJjg0wtkAi+dz5Dw817tfMLqrPKIl86nNaHD1REpZ22gJ9CVWYvdWIUT7BBWo6uK0lp+5863Qln7sZ3XFfSAJ7ZirYXilV1IvgmUe5dGsQ5jFtGb/3lX7LZXaURX3fQzbetyfJnGDSEM3Ai/Ri3O2KRMnOW4XCFGTAzYO3DX3gZfcAPQtVgOHFlWP1PmM/lj8H6ERHQQM06KPsfERJJ3TooQTwUxzzsHKpNAt/JpxX2ikgsd/ksNoa/e6dDlrvxea7oQWK7uWCH9rdX0GF4sTiRP1Ch4lM3CKOudrr6hu+w32EWIw1upaoXXW6GOHWr1A9sNpZTWRhYzEPdQ5YXTMH7B8Mq1sGiD7TNskHcfT7A+5roKxgDGz6v1n2woFGIDhgYmeiD5JvmgSN7DSPgBqqqp0csGMeQAAAAASUVORK5CYII=';
export class calender extends PureComponent {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      SelectedDayTasks: [],
      taskOnMonth: [],
      task: '',
      Tasks: [],
      MonthTasks: [],
      TaskToday: [],
      currentDate: '',
      currentMonth: '',
      TaskInMonth: [],
      tasksDate: [],
      marked: null,
      selected: '',
      taskDescription: '',
      AddTaskVisible: false,
      isTaskLoading: true
    };
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
    this.onDayPress = this.onDayPress.bind(this);
    this.getCurrentDate = this.getCurrentDate.bind(this);
    this.getTaskInMonth = this.getTaskInMonth.bind(this);
  }
  onRegister(token) {
    console.log('Registered !', JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }
  onNotif(notif) {
    console.log(notif);
    console.log(notif.title, notif.message);
  }
  handlePerm(perms) {
    console.log('Permissions', JSON.stringify(perms));
  }
  getCurrentDate = () => {
    let cDate;
    cDate = new Date();
    currentDate =
      cDate.getFullYear() +
      '-' +
      ('0' + (cDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + cDate.getDate()).slice(-2);
    currentMonth =
      cDate.getFullYear() + '-' + ('0' + (cDate.getMonth() + 1)).slice(-2);
    console.log('current currentMonth: ' + currentMonth);
    this.setState({
      selected: currentDate,
    });
    this.getTasks();
  };
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getCurrentDate();
    });
  }
  getUSADateFormate = () => {
    let uSADateString = '';
    if (currentDate != null && currentDate != undefined) {
      let uSADate = currentDate.split('-');
      uSADateString = uSADate[1] + '/' + uSADate[2] + '/' + uSADate[0];
      return uSADateString;
    }
    return uSADateString;
  }
  onDayPress(day) {
    this.setState({
      selected: day.dateString,
    });
    console.log('day :' + day.dateString);
    currentDate = day.dateString;
    this.getTaskOnDate(currentDate);
  }
  onMonthChange(month) {
    console.log('month : ', month);
    let m = month.year + '-' + ('0' + (month.month)).slice(-2);
    console.log('m :', m);
    // currentMonth = m;
    this.getTaskInMonth(m);
  }
  getTaskOnDate = date => {
    // this.setState({
    //
    // });
    let TaskToday = [];
    console.log('getTaskOnDate method is executed', date);
    console.log('getTaskOnDate taskOnMOnth', this.state.taskOnMonth);
    if (this.state.taskOnMonth != null) {
      for (let i = 0; i < this.state.taskOnMonth.length; i++) {
        let d = this.state.taskOnMonth[i].date.slice(0, 10)
        if (date == d) {
          let task = this.state.tasks.find(
            t => t.Id == this.state.taskOnMonth[i].refTask
          );
          if (TaskToday.find(o => o.Id == this.state.task.Id) == null) {
            TaskToday.push({
              Id: task.Id,
              refTaskOnDate: this.state.taskOnMonth[i].Id,
              task: task.task,
              taskDescription: task.taskDescription,
              refGoal: task.refGoal,
              refAddTo: task.refAddTo,
              startDate: task.startDate,
              refTaskRepeat: task.refTaskRepeat,
              refTaskRepeatEnd: task.refTaskRepeatEnd,
              endOnDate: task.endOnDate,
              refProgress: task.refProgress,
              refPriority: task.refPriority,
              orderIndex: task.orderIndex,
              notifyId: this.state.taskOnMonth[i].notifyId,
              isTaskOnDateCompleted: this.state.taskOnMonth[i].isCompleted,
              Progress: Progress.find(
                pr => pr.Id == task.refProgress && pr.isActive == 1,
              ).image,
              Priority: Priority.find(
                pri => pri.Id == task.refPriority && pri.isActive == 1,
              ).color,
              goalIcon: task.refGoal
                ? this.state.taskIcon.find(
                  ti =>
                    ti.Id ==
                    this.state.goals.find(g => g.Id == task.refGoal && g.isActive == 1).refTaskIcon && ti.isActive == 1,
                ).icon
                : logo,
              customImg: task.refGoal
                ? this.state.taskIcon.find(
                  ti =>
                    ti.Id ==
                    this.state.goals.find(
                      g => g.Id == task.refGoal && g.isActive == 1,
                    ).refTaskIcon && ti.isActive == 1,
                ).customImage
                : 0,
              isActive: task.isActive,
            });
          }
        }
      }
      const complete = { key: 'complete', color: 'green' };
      // const incomplete = {key: 'incomplete', color: 'red'};
      const obj = this.state.tasksDate.reduce(
        (c, v) =>
          Object.assign(c, {
            [v]: {
              dots: [complete]
              , selected: ([v] == date) ? true : false
            },
          }),
        {},
      );
      console.log('obj :', obj);
      this.setState({
        TaskToday,
        marked: obj,
        isTaskLoading: false
      }, () => {

        this.setState({
          marked: {
            ...this.state.marked, [date]:
            {
              selected: true
            }
          }
        }, () => console.log("marked:", this.state.marked));

      })
    }
    console.log('today task :', TaskToday);
  };
  getTaskInMonth = month => {
    console.log('getTaskInMonth method is executed', month);
    // const [taskOnDate,goals,priority,progress,tasks] = this.state
    let tasksDate = [];
    this.setState({
      marked: null,
      // tasksDate:[]
    });
    let date;
    if (
      this.state.taskOnDate != null &&
      this.state.tasks != null &&
      this.state.goals != null
    ) {
      console.log("if condition is true", this.state.taskOnDate);
      let taskOnMonth = [];
      for (let i = 0; i < this.state.taskOnDate.length; i++) {
        if (this.state.taskOnDate[i].date != null) {
          let m = this.state.taskOnDate[i].date.slice(0, 7);
          // let today = this.state.taskOnDate[i].date.slice(0, 10);
          if (month == m) {
            let task = this.state.tasks.find(
              t => (t.Id == this.state.taskOnDate[i].refTask) && (t.isActive == 1)
            );
            if (task != null) {
              // console.log(task.refGoal +","+ this.state.goals.find(g => g.Id == task.refGoal).isActive)
              if (
                (task.refGoal &&
                  this.state.goals.find(g => g.Id == task.refGoal).isActive ==
                  1) ||
                (task.refGoal == null)
              ) {
                taskOnMonth.push(this.state.taskOnDate[i]);
                console.log('taskOnMonth :', taskOnMonth);
                tasksDate.push(this.state.taskOnDate[i].date.slice(0, 10));
                console.log('tasksDate :', tasksDate);
              }
            }
          }
        }
      }
      console.log('taskOnMonth :', taskOnMonth);
      console.log('tasksDate :', tasksDate);

      if (month == currentMonth) {
        date = currentDate;
      } else {
        date = month + '-01';
      }
      this.setState({
        tasksDate,
        taskOnMonth,
        isTaskLoading: true
      }, () => {
        console.log("this.state.tasksDate :", this.state.tasksDate);
        this.getTaskOnDate(date);
      });
    } else {
      console.log('list should not be null');
    }
  };
  getTasks = () => {
    console.log('To Do getTasks method is executed');
    let TaskToday = [];
    db.getTask().then(tasks => {
      db.getGoals().then(goals => {
        db.getTaskIcon().then(taskIcon => {
          db.getTaskOnDate().then(taskOnDateResult => {
            // let taskOnDate = taskOnDateResult;
            // console.log(taskOnDate);
            let taskOnDate = _.filter(taskOnDateResult, { isActive: 1 });
            this.setState({
              taskOnDate,
              tasks,
              goals,
              taskIcon,
            });
            this.getTaskInMonth(currentMonth);
          });
        });
      });
    });
  };
  updateTask = (selectedTask, isActive, isCompleted) => {
    let taskOnMonth = [];
    console.log("selected Task:", selectedTask);
    let tod = this.state.taskOnDate.find(t => t.Id == selectedTask.refTaskOnDate);
    tod.isCompleted = isCompleted;
    tod.completedDate = currentDate;
    tod.isActive = isActive;
    if (isActive == 0)
      tod.isNotificationCancel = 1;
    db.updateTaskOnDate(tod.Id, tod).then((results) => {
      console.log("TaskOnDate update successfully");
      if (isActive == 0) {
        this.notif.checkPermission(this.handlePerm.bind(this));
        this.notif.configure(
          this.onRegister.bind(this),
          this.onNotif.bind(this),
        );
        this.notif.cancelNotif(tod.notifyId);
      }
      else if (isCompleted == 1)
        CancelNotificationOfCompleteTask(tod, this.notif);
      else if (isCompleted == 0)
        setNotificationOfInCompleteTask(tod, selectedTask.task, this.notif);
      let TMonth = [];
      TMonth = this.state.taskOnMonth;
      for (let i = 0; i < TMonth.length; i++) {
        if (TMonth[i].Id == selectedTask.refTaskOnDate) {
          if (isActive == 0)
            continue;
          TMonth[i].isCompleted = isCompleted
        }
        taskOnMonth.push(TMonth[i]);
      }
      console.log("TaskToday :", taskOnMonth)
      this.setState({
        // marked:obj,
        taskOnMonth
      }, () => {
        console.log("TaskToday2 :", this.state.taskOnMonth);
        this.getTaskOnDate(currentDate);
      })
    })
  };
  render() {
    return (
      <View style={styles.flexScreen}>
        <ImageBackground
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('./Images/gradient.png')}
          resizeMode={'stretch'}>
          <SafeAreaView style={styles.titlebar}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}
              style={styles.backTouch}>
              <Image
                style={styles.backImageIcon}
                resizeMode={'stretch'}
                source={require('./Images/back.png')}
              />
              <Text style={styles.backLogo}>CC</Text>
            </TouchableOpacity>
            <Text style={[styles.titleText, { textTransform: 'uppercase' }]}>Calendar</Text>
            <View style={styles.titleRightView} />
          </SafeAreaView>
          <ScrollView>
            <View
              style={{
                marginBottom: PixelToDP(60),
              }}>
              <View
                style={{
                  width: widthPercentageToDP(90),
                  alignSelf: 'center',
                  // backgroundColor:'red',
                  height: 'auto',
                  marginTop: PixelToDP(20),
                  padding: PixelToDP(10),
                  borderRadius: PixelToDP(30),
                  backgroundColor: 'white',
                }}>
                <Calendar
                  // markingType={'custom'}
                  markingType={'multi-dot'}
                  markedDates={this.state.marked}

                  onDayPress={day => this.onDayPress(day)}
                  onMonthChange={months => this.onMonthChange(months)}
                  theme={{
                    selectedDayBackgroundColor: '#30B3AB',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#30B3AB',
                    todayTextBackgroundColor: 'black',
                    textMonthFontSize: PixelToDP(15),
                  }}>
                  <CalendarList
                    pastScrollRange={24}
                    futureScrollRange={24}
                    displayLoadingIndicator={true}
                    scrollEnabled={true}
                    showScrollIndicator={true}
                    horizontal={true}
                    pagingEnabled={true}
                    current={this.state.currentDate}
                    // onVisibleMonthsChange={months => this.onMonthChange(months)}
                    // pagingEnabled
                    style={{ borderBottomWidth: 1, borderBottomColor: ' black' }}
                  />
                </Calendar>
              </View>
              <Text
                style={[
                  styles.settingHeading,
                  {
                    fontSize: PixelToDP(16),
                    width: widthPercentageToDP(80),
                    alignSelf: 'center',
                    marginTop: PixelToDP(10),
                  },
                ]}>
                Tasks - {(currentDate != '') ? this.getUSADateFormate() : ''}
              </Text>
              {this.state.isTaskLoading ? (
                <View
                  style={{
                    // position: 'absolute',
                    // left: 0,
                    // right: 0,
                    // top: 0,
                    // bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                  <ActivityIndicator size="large" color="black" />
                </View>
              ) : (
                <View
                  style={{
                    width: widthPercentageToDP(80),
                    alignSelf: 'center',
                    height: 'auto',
                  }}>
                  <FlatList
                    data={this.state.TaskToday}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          height: PixelToDP(65),
                          alignItems: 'center',
                          // backgroundColor:'black',
                          // justifyContent:'center',
                          borderBottomColor: 'white',
                          alignSelf: 'center',
                          borderBottomWidth: PixelToDP(1),
                        }}
                      >
                        <View style={styles.taskImageBorderGreen}>
                          <Image
                            resizeMode={'contain'}
                            style={[item.customImg == 1 ? styles.customImage : styles.nonCustomTODoImage, {
                            }]}
                            source={{ uri: item.goalIcon }}
                          />
                        </View>
                        <Text
                          style={[
                            styles.settingText,
                            { marginLeft: PixelToDP(10), borderBottomWidth: 0 },
                          ]}>
                          {item.task}
                        </Text>
                        <View
                          style={{
                            position: 'absolute',
                            right: 0,
                            marginTop: PixelToDP(10),
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: widthPercentageToDP(30),
                          }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#30B3AB',
                              borderRadius: PixelToDP(30),
                              // width: PixelToDP(35),
                              // height: PixelToDP(35),
                              width: responsiveFontSize(4),
                              height: responsiveFontSize(4),
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              selectedTask = item;
                              this.setState({
                                AddTaskVisible: !this.state.AddTaskVisible,
                              });
                              console.log('selected Task :', selectedTask);
                            }}>
                            <Icon
                              name="edit"
                              type="Feather"
                              style={{
                                // fontSize: PixelToDP(16),
                                fontSize: responsiveFontSize(2),
                                color: 'white',
                                alignSelf: 'center',
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#325859',
                              borderRadius: PixelToDP(30),
                              // width: PixelToDP(35),
                              // height: PixelToDP(35),
                              width: responsiveFontSize(4),
                              height: responsiveFontSize(4),
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              Alert.alert(
                                'Alert',
                                'Are you sure you want to delete this task ?',
                                [
                                  {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'OK',
                                    onPress: () => {
                                      this.updateTask(item, 0, item.isTaskOnDateCompleted)
                                    },
                                  },
                                ],
                                { cancelable: false },
                              );
                            }}>
                            <Icon
                              name="trash-2"
                              type="Feather"
                              style={{
                                fontSize: responsiveFontSize(2),
                                color: 'white',
                                alignSelf: 'center',
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={
                              item.isTaskOnDateCompleted == 1
                                ? styles.taskCompleted
                                : styles.taskInCompleted
                            } onPress={() => {
                              if (!item.isTaskOnDateCompleted) {
                                Alert.alert(
                                  'Alert',
                                  'Are you sure you want to complete this task ?',
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () => console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'OK',
                                      onPress: () => this.updateTask(item, 1, 1),
                                    },
                                  ],
                                  { cancelable: false },
                                );
                              } else {
                                Alert.alert(
                                  'Alert',
                                  'Are you sure you want to incomplete this task ?',
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () => console.log('Cancel Pressed'),
                                      style: 'cancel',
                                    },
                                    {
                                      text: 'OK',
                                      onPress: () => this.updateTask(item, 1, 0),
                                    },
                                  ],
                                  { cancelable: false },
                                );
                              }
                            }}>
                            {item.isTaskOnDateCompleted == 1 && (
                              <Icon
                                name="check"
                                type="Feather"
                                style={{
                                  color: 'white',
                                  alignSelf: 'center',
                                  fontSize: PixelToDP(16),
                                }}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          {/* <TouchableOpacity
            style={{
              alignSelf: 'center',
              position: 'absolute',
              bottom: PixelToDP(10),
            }}
            onPress={() => {
              selectedTask = null;
              this.setState({ AddTaskVisible: !this.state.AddTaskVisible });
            }}>
            <Image
              style={{
                // height: PixelToDP(55),
                // width: PixelToDP(55),
                height: responsiveFontSize(7),
                width: responsiveFontSize(7)
              }}
              resizeMode={'contain'}
              source={require('./Images/add.png')}
            />
          </TouchableOpacity> */}
            <View style={[styles.buttonsFooter,{justifyContent:"center"}]}>
            <TouchableOpacity
              style={{
                height: 'auto',
                alignItems: 'center',
              }}
              onPress={() => {
                selectedTask = null;
                this.setState({ AddTaskVisible: !this.state.AddTaskVisible });
              }}
            >
              <Image
                style={{
                  alignSelf: 'center',
                  height: heightPercentageToDP(10.5),
                  width: heightPercentageToDP(10.5),
                }}
                resizeMode={'contain'}
                source={require('./Images/plus.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonsFooterText, ,{justifyContent:"center"}]}>
            <Text style={[styles.buttonsFooterTextTitle, {
              top: 5
            }]}>Add</Text>

          </View>
          <AddTaskDialog
            visible={this.state.AddTaskVisible}
            addTo={2}
            selectedTask={selectedTask}
            onClose={(t, tD) => {
              this.setState({
                AddTaskVisible: false,
              });
              if ((t != undefined && tD != undefined) && (t != '' && tD != '')) {
                if (selectedTask == null) {
                  db.getTask().then(result => {
                    let len = result.length;
                    let data = {
                      Id: len + 1,
                      task: t,
                      taskDescription: tD,
                      refGoal: null,
                      refAddTo: 2,
                      startDate: null,
                      refTaskRepeat: null,
                      refTaskRepeatEnd: null,
                      endOnDate: null,
                      refProgress: 1,
                      refPriority: 1,
                      orderIndex: len,
                      isActive: 1,
                    };
                    this.props.navigation.navigate('AddToCalendar', {
                      data: data,
                      FromCalenderOrGoal: 'calender',
                      isEdited: 'false',
                    });
                  });
                } else {
                  selectedTask.task = t;
                  selectedTask.taskDescription = tD;
                  this.props.navigation.navigate('AddToCalendar', {
                    data: selectedTask,
                    FromCalenderOrGoal: 'calender',
                    isEdited: 'true',
                  });
                }
              }
            }}
          />

        </ImageBackground>
      </View>
    );
  }
}
