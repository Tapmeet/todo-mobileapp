import React, {PureComponent} from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ImageBackground,
    Modal,
    AsyncStorage,
    Alert, ActivityIndicator,
} from 'react-native';
import {Text, Icon, Toast, Root} from 'native-base';
import {styles} from './CustomStyleSheet';
import {
    heightPercentageToDP,
    PixelToDP, responsiveFontSize,
    widthPercentageToDP,
} from './PixelRatio';
import DatePicker from 'react-native-date-picker';
import SQLdatabase from './SQLdatabase';
import NotifService from './NotifService';
import Card from 'react-navigation-stack/src/views/StackView/StackViewCard';
const db = new SQLdatabase();
var task,
  taskDesc,
  r,
  re = 'Never',
  reI = 1,
  rI,
  rod,
  oldNotifyId,
  dateList = [],
  interval;
var come;
export class AddToCalendar extends PureComponent {
  // _isMounted = false;
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isTaskStartDateSelected: false,
      sdate: new Date(),
      startDateFormat: '',
      comeF: '',
      repeat: 'Never',
      repeatEnd: 'Never',
      repeatIndex: 1,
      repeatEndIndex: 1,
      repeatOnDate: '',
        isProcess:false,
    };
    console.log('constructor is called');
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
  }
  setStateValueForEdit = () => {
    console.log("setStateValueForEdit method is called", this.props.navigation.getParam('data'))
    let taskData = this.props.navigation.getParam('data');
    this.setState({
      repeatIndex: taskData.refTaskRepeat,
      repeatEndIndex: taskData.refTaskRepeatEnd,
      repeatOnDate: taskData.endOnDate,
      startDateFormat: taskData.startDate,
    },()=>{
      console.log(this.state.repeatOnDate+', '+this.state.startDateFormat+","+this.state.sdate.toISOString());
      oldNotifyId = taskData.notifyId;
      db.getTaskRepeat().then(taskrepeat => {
        this.setState({
          repeat: taskrepeat.find(r => r.Id == taskData.refTaskRepeat).title,
        });
        interval = taskrepeat.find(r => r.Id == taskData.refTaskRepeat).interval;
      });
      db.getTaskRepeatEnd().then(taskEndRepeat => {
        this.setDate({
          repeatEnd: taskEndRepeat.find(re => re.Id == taskData.refTaskRepeatEnd)
              .title,
        });
      });
    });
  };
  onRegister(token) {
    console.log('Registered !', JSON.stringify(token));
    console.log(token);
    this.setState({registerToken: token.token, gcmRegistered: true});
  }

  onNotif(notif) {
    console.log(notif);
    console.log(notif.title, notif.message);
  }

  handlePerm(perms) {
    console.log('Permissions', JSON.stringify(perms));
  }
  setComeFrom = () => {
    console.log('setComeFrom method is executed');
    this.setRepeatState();
  };
  setRepeatState = () => {
    console.log('setRepeatState method is executed');
    r = this.props.navigation.getParam('RepeatDay');
    rI = this.props.navigation.getParam('RepeatDayIndex');
    interval = this.props.navigation.getParam('interval');
    console.log(r + ',' + rI);
    this.setState({
      repeat: r,
      repeatIndex: rI,
    },()=>{
        if(this.state.repeatIndex ==1){
            this.setState({
                repeatEnd: 'Never',
                repeatEndIndex: 1,
                repeatOnDate: '',
            },()=> console.log(
                'Repeat End :' +
                this.state.repeatEnd +
                ' ,' +
                this.state.repeatEndIndex +
                ',' +
                this.state.repeatOnDate,
            ))
        }
    });
    console.log('repeat:' + this.state.repeat + ' ,' + this.state.repeatIndex);
  };
  setEndRepeatState = () => {
    console.log('setEndRepeatState method is executed');
    re = this.props.navigation.getParam('RepeatEndDay');
    reI = this.props.navigation.getParam('RepeatEndDayIndex');
    rod = this.props.navigation.getParam('RepeatEndOnDateFormat')
      ? this.props.navigation.getParam('RepeatEndOnDateFormat')
      : '';
    console.log(re + ',' + reI);
    this.setState({
      repeatEnd: (re=="")?'Never':re,
      repeatEndIndex: (reI=="")?1:reI,
      repeatOnDate: rod,
    });
    console.log(
      'Repeat End :' +
        this.state.repeatEnd +
        ' ,' +
        this.state.repeatEndIndex +
        ',' +
        this.state.repeatOnDate,
    );
  };

  AddDetail = () => {
      let notifyId;
      console.log('start date :' + this.state.startDateFormat);
      console.log(
          this.state.repeat +
          ' ,' +
          this.state.repeatEnd +
          ',' +
          this.state.repeatIndex +
          ',' +
          this.state.repeatEndIndex +
          ',' +
          this.state.repeatOnDate,
      );
      let data = this.props.navigation.getParam('data');
      data.startDate = this.state.startDateFormat;
      data.refTaskRepeat = this.state.repeatIndex;
      data.refTaskRepeatEnd = this.state.repeatEndIndex;
      data.endOnDate = this.state.repeatOnDate;
      let sdfdateTime = this.state.startDateFormat.split(" ");
      let sdfdate = sdfdateTime[0].split("-");
      let sdfTime = sdfdateTime[1].split(":");

      let ed = new Date(sdfdate[0], sdfdate[1] - 1, sdfdate[2], sdfTime[0], sdfTime[1], 0, 0);
      let sd = new Date(sdfdate[0], sdfdate[1] - 1, sdfdate[2], sdfTime[0], sdfTime[1], 0, 0);
      let sdtime = sd.toTimeString().split(" ");
      console.log('Started Date format:' + sd + 'End Date format: ' + ed);
      console.log('Started Date:' + sd);
      if (this.state.repeatIndex != 1) {
          if (this.state.repeatEndIndex == 1) {
              ed.setFullYear(sd.getFullYear() + 1);
          } else {
              let edfdateTime = this.state.repeatOnDate.split(" ");
              let edfdate = edfdateTime[0].split("-");
              ed.setFullYear(edfdate[0], edfdate[1] - 1, edfdate[2]);
              ed.setHours(sdfTime[0], sdfTime[1], 0, 0);
          }
      } else {
          interval = 1;
      }
      console.log(
          'Started Date:' + sd + 'End Date: ' + ed + 'Interval :' + interval,
      );
      let dateList = [],
          i = 0;
      while (sd <= ed) {
          let d = sd.getFullYear() +
              '-' +
              ('0' + (sd.getMonth() + 1)).slice(-2) +
              '-' +
              ('0' + sd.getDate()).slice(-2) +
              ' ' +
              sdtime[0];
          dateList.push(d);
          sd.setDate(sd.getDate() + interval);
          console.log('sd 3:' + sd + 'ed 3:' + ed);
          console.log('dateList :', dateList);
      }
      let dateData = [], taskOnDate = [];
      db.getTaskOnDate().then(async (taskOnDateResponse) => {
          taskOnDate = taskOnDateResponse;
          let taskOnDateLength = taskOnDateResponse.length;
          // Alert.alert("dateList Length :", dateList.length.toString());
          let nd = new Date();
          nd.setDate(nd.getDate() + 14);
          let nextNotificationDateLimit = nd.getFullYear() +
              '-' +
              ('0' + (nd.getMonth()+1)).slice(-2) +
              '-' +
              ('0' + nd.getDate()).slice(-2) +
              ' ' +
              nd.toLocaleTimeString();
          console.log("nextnotificationDateLimit :",nextNotificationDateLimit);
          // for (let i = 0; i < dateList.length; i++) {
          //     notifyId = new Date().toISOString();
          //     taskOnDateLength += 1;
          //     dateData.push({
          //         Id: taskOnDateLength,
          //         refTask: result.insertId,
          //         date: dateList[i],
          //         completedDate: '',
          //         isCompleted: 0,
          //         notifyId: notifyId,
          //         isNotificationRegistered: (nextNotificationDateLimit > dateList[i]) ? 1 : 0,
          //         isNotificationCancel: 0,
          //     });
          //     console.log(
          //         'taskOnDate data is going to be save :',
          //         dateData,
          //     );
          // }
          try {
          // const value = await AsyncStorage.getItem('reminder');
          // console.log('AddToCalendar, insert Date :', value);
          // if (value == "true") {
          if (this.props.navigation.getParam('isEdited') == 'true') {
              db.updateTasks(data.Id, data)
                  .then(result => {
                      // db.getTaskOnDate().then(taskOnDate => {
                      let tod = [];
                      taskOnDate.forEach(t => {
                          if (t.refTask == data.Id)
                              tod.push(t);
                      })
                      // tod = taskOnDate.findAll(t => t.refTask == data.Id);
                      this.setNotification();
                      for (let i = 0; i < tod.length; i++) {
                          tod[i].isActive = 0;
                          tod[i].isNotificationCancel = 1
                          db.updateTaskOnDate(tod[i].Id, tod).then(response => {
                              this.notif.cancelNotif(tod[i].notifyId);
                          });
                      }
                      for (let i = 0; i < dateList.length; i++) {
                          notifyId = new Date().toISOString();
                          taskOnDateLength += 1;
                          dateData.push({
                              Id: taskOnDateLength,
                              refTask: data.Id,
                              date: dateList[i],
                              completedDate: '',
                              isCompleted: 0,
                              notifyId: notifyId + dateList[i].toString(),
                              isNotificationRegistered: (nextNotificationDateLimit > dateList[i]) ? 1 : 0,
                              isNotificationCancel: 0,
                          });
                          console.log(
                              'taskOnDate data is going to be save :',
                              dateData,
                          );
                      }
                      // let dateData = [];
                      // let taskOnDateLength = taskOnDate.length;
                      // // Alert.alert("dateList Length :", dateList.length.toString());
                      // for (let i = 0; i < dateList.length; i++) {
                      //     notifyId = new Date().toISOString();
                      //   taskOnDateLength += 1;
                      //   dateData.push({
                      //     Id: taskOnDateLength,
                      //     refTask: data.Id,
                      //     date: dateList[i],
                      //     isCompleted: 0,
                      //     completedDate: '',
                      //     notifyId : notifyId,
                      //
                      //   });
                      // }
                      db.insertInToTaskOnDate(dateData).then((resultTaskOnDate) => {
                          console.log(resultTaskOnDate);
                          // const value = await AsyncStorage.getItem('reminder');
                          // if(value == "true") {
                              this.setNotification();
                              for (let i = 0; i < dateData.length; i++) {
                                  if (dateData[i].isNotificationRegistered == 1) {
                                      let dateTime = dateData[i].date.split(" ");
                                      let d = dateTime[0].split("-");
                                      let t = dateTime[1].split(":");
                                      let date = new Date(d[0], d[1] - 1, d[2], t[0], t[1], 0, 0);
                                      console.log("notification Time :", date);
                                      this.notif.scheduleNotif(
                                          dateData[i].notifyId,
                                          "Conscientiousness Coach",
                                          data.task + " is scheduled for now",
                                          date,
                                          '',
                                      );
                                  } else
                                      break;
                              }
                          // }
                      });
                      // });

                      this.setState({
                          isProcess: false
                      });
                      console.log("data saved:", result);
                      if (this.props.navigation.getParam('FromCalenderOrGoal') != ' ') {
                          come = this.props.navigation.getParam('FromCalenderOrGoal');
                      }
                      console.log('comeFrom :', come);
                      this.props.navigation.navigate(come, {
                          goalId: data.refGoal,
                      });
                  })
                  .catch(err => {
                      console.log(err);
                  });
          } else {
              // let dateData = [];

              db.insertInToTasks(data)
                  .then(result => {
                      console.log("NextMonthDate:",nextNotificationDateLimit);
                      for (let i = 0; i < dateList.length; i++) {
                          notifyId = new Date().toISOString();
                          taskOnDateLength += 1;
                          dateData.push({
                              Id: taskOnDateLength,
                              refTask: result.insertId,
                              date: dateList[i],
                              completedDate: '',
                              isCompleted: 0,
                              notifyId: notifyId + dateList[i].toString(),
                              isNotificationRegistered: (nextNotificationDateLimit > dateList[i]) ? 1 : 0,
                              isNotificationCancel: 0,
                          });
                          console.log(
                              'taskOnDate data is going to be save :',
                              dateData,
                          );
                      }
                      // db.getTaskOnDate().then(taskOnDate => {

                      // let taskOnDateLength = taskOnDate.length;
                      // // Alert.alert("dateList Length :", dateList.length.toString());
                      //   let nd = new Date();
                      //   nd.setMonth(nd.getMonth()+1);
                      //   let nextNotificationDateLimit = nd.getFullYear() +
                      //       '-' +
                      //       ('0' + (nd.getMonth())).slice(-2) +
                      //       '-' +
                      //       ('0' + nd.getDate()).slice(-2) +
                      //       ' ' +
                      //       nd.toLocaleTimeString();
                      // for (let i = 0; i < dateList.length; i++) {
                      //   notifyId = new Date().toISOString();
                      //   taskOnDateLength += 1;
                      //   dateData.push({
                      //     Id: taskOnDateLength,
                      //     refTask: result.insertId,
                      //     date: dateList[i],
                      //     completedDate: '',
                      //     isCompleted: 0,
                      //     notifyId:notifyId,
                      //     isNotificationRegistered :  (nextNotificationDateLimit > dateList[i])? 1:0,
                      //     isNotificationCancel:0,
                      //   });
                      //   console.log(
                      //     'taskOnDate data is going to be save :',
                      //     dateData,
                      //   );
                      // }
                      // Alert.alert('Alert',JSON.stringify(dateData));
                      db.insertInToTaskOnDate(dateData).then(async (resultTaskOnDate) => {
                          console.log("resultTaskOnDate:", resultTaskOnDate);
                          // const value = await AsyncStorage.getItem('reminder');
                          // if(value == "true") {
                              for (let i = 0; i < dateData.length; i++) {
                                  if (dateData[i].isNotificationRegistered == 1) {
                                      this.setNotification();
                                      let date = new Date();
                                      let dt = dateData[i].date.split(" ");
                                      let d = dt[0].split("-");
                                      let t = dt[1].split(":");
                                      date.setFullYear(d[0], d[1] - 1, d[2]);
                                      date.setHours(t[0], t[1], t[2], 0);

                                      this.notif.scheduleNotif(
                                          dateData[i].notifyId,
                                          "Conscientiousness Coach",
                                          data.task + " is scheduled for now",
                                          date,
                                          '',
                                      );
                                  } else
                                      break;
                              }
                          // }
                          if (this.props.navigation.getParam('FromCalenderOrGoal') != ' ') {
                              come = this.props.navigation.getParam('FromCalenderOrGoal');
                          }
                          console.log('comeFrom :', come);
                          this.props.navigation.navigate(come, {
                              goalId: data.refGoal,
                              TaskIconId: data.refTaskIcon,
                              goalTitle: data.goal,
                              accomplishedPercent: data.accomplishedPercentage,
                          });
                      })
                          .catch(err => {
                              console.log(err);
                          });
                      // });
                  });
          }
          // }
          // else {
          //     this.setState({
          //        isProcess : false
          //     },()=>{
          //         Toast.show({
          //             text: 'Set Reminder From Setting !',
          //             buttonText: 'Hide',
          //             position: 'bottom',
          //         });
          //     });
          // }
      } catch (e) {
          alert(JSON.stringify(e))
      }
  })
  };
  setNotification(){
      console.log("setNotification method is executed");
      this.notif.checkPermission(this.handlePerm.bind(this));
      this.notif.configure(
          this.onRegister.bind(this),
          this.onNotif.bind(this),
      );
  }
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      console.log('componentDidMount is executed');
      if (this.props.navigation.getParam('comeFrom') == 'Repeat') {
        this.setRepeatState();
      } else if (this.props.navigation.getParam('comeFrom') == 'RepeatEnd') {
        this.setEndRepeatState();
      }
      else {
        if (this.props.navigation.getParam('isEdited') == 'true') {
          this.setStateValueForEdit();
        }
      }
      // this.setComeFrom();
    });
  }
  setDate(date) {
      console.log("start Date :",date.toTimeString());
      let time = date.toTimeString().split(" ");
    let d =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2) +
      ' ' +
        time[0];
    this.setState({
      sdate: date,
      startDateFormat: d,
    },()=> console.log("startDateFormat :",this.state.startDateFormat));
  }
    getUSADateFormate=(d)=>{
        let uSADateString ='',uSATime ="";
        console.log("d :",d);
        if(d!= null && d!= undefined && d!='') {
            let uSADateTime = d.split(' ');
            let uSADate = uSADateTime[0].split('-');
            console.log("uSADateTime[1] :",d);
            let tf = uSADateTime[1].split(":");
            let format = tf[2].split(" ");
            console.log("setTime split :",tf);

            if(uSADateTime[2]==undefined)
            {
                if (tf[0] > 12) {
                    uSATime = (tf[0] - 12) + ":" + tf[1] + " " + "PM";
                } else if (tf[0] == 12) {
                    uSATime = tf[0] + ":" + tf[1] + " " + "PM";
                } else {
                    uSATime = tf[0] + ":" + tf[1] + " " + "AM";
                }
                uSADateString = uSADate[1] + '/' + uSADate[2] + '/' + uSADate[0] + " " + uSATime;
                return uSADateString;
            }
            else{
                uSADateString = uSADate[1] + '/' + uSADate[2] + '/' + uSADate[0] + " " + tf[0]+":"+tf[1]+" "+uSADateTime[2];
                console.log("rd :",uSADateString);
                return uSADateString;
            }
        }
        return uSADateString;
    }
  render() {
    return (

      <View style={styles.flexScreen} >
        <Root>
            {this.state.isProcess &&
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                }}>
                <View style={{
                    alignSelf:'center',
                    height:PixelToDP(100),
                    width:PixelToDP(200),
                    backgroundColor:'white',
                    justifyContent:'center',
                    borderBottomWidth: 1,
                    borderBottomColor: ' black',
                    elevation: 10,
                }}>
                    {/*<Spinner color='red' />*/}
                <ActivityIndicator size="large" color="black" />
                <Text style={{
                    color:'black',
                    fontFamily: "Oswald-Regular",
                    fontWeight: 'bold',
                    lineHeight: PixelToDP(25),
                    fontSize:PixelToDP(14),
                    textAlign:'center',
                    marginTop:PixelToDP(10)
                }}>Task Create.Please wait!</Text>
                </View>
            </View>
            }
          <ImageBackground
            style={{
              width: '100%',
              height: '100%',
            }}
            source={require('./Images/gradient.png')}
            resizeMode={'stretch'} pointerEvents={this.state.isProcess ? 'none' : 'auto'}>
            <SafeAreaView style={styles.titlebar}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate((this.props.navigation.getParam('FromCalenderOrGoal')== 'calender')?'calender':'CreateTaskDialog')}
                style={styles.backTouch}>
                <Image
                  style={styles.backImageIcon}
                  resizeMode={'stretch'}
                  source={require('./Images/back.png')}
                />
                <Text style={[styles.backLogo, {fontSize: responsiveFontSize(1.8)}]}>
                  {(this.props.navigation.getParam('FromCalenderOrGoal')== 'calender')?'Calendar':'Create Task'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.titleText}> Add To Calendar</Text>
              <TouchableOpacity
                style={{
                  height: '100%',
                  width: widthPercentageToDP(20),
                    alignItems:'center',
                    justifyContent:'center',
                  // position: 'absolute',
                  // right: PixelToDP(0),
                    marginLeft:widthPercentageToDP(10)
                }}
                onPress = {()=> {
                    if(this.state.startDateFormat == "")
                    {
                        Toast.show({
                            text: "Please Select Start Date",
                            buttonText:"hide",
                            position:"bottom"
                        });
                    }
                    else
                    {
                        this.setState({
                            isProcess: true
                        },()=> {
                            // let totalScheduledNotification=[];
                            //     totalScheduledNotification = this.notif.getScheduledNotification();
                            // if(totalScheduledNotification.length >= 60)
                            //     console.log("Notification will not be set for this task because Scheduled Notification are greater than 64. Would you like to create task.");
                            // else

                            this.AddDetail();
                        })
                    }
                }}>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontSize: PixelToDP(14),
                    color: 'white',
                    textAlign: 'center',
                    // textAlignVertical: 'center',
                    // height: '100%',
                  }}>
                  Add
                </Text>
              </TouchableOpacity>
            </SafeAreaView>

            <View style={{width: widthPercentageToDP(90), alignSelf: 'center'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: PixelToDP(55),
                  borderBottomColor: '(rgba(255, 255, 255, 0.29)',
                  borderBottomWidth: PixelToDP(1),
                }}
                onPress={() => {
                    this.setDate(this.state.sdate);
                    this.setState({isTaskStartDateSelected: true})
                }}>
                <Text style={styles.settingText}>Task Start Date</Text>
                <View
                  style={{
                    position: 'absolute',
                    right: PixelToDP(0),
                    flexDirection: 'row',
                  }}>
                  {/*{this.state.isTaskStartDateSelected && (*/}
                    <Text style={styles.settingText}>
                      {/*{this.state.date.getFullYear()}-{this.state.date.getMonth()}-{this.state.date.getDate()}  {this.state.date.toLocaleTimeString()}*/}
                      {
                          (this.state.startDateFormat != '') ? this.getUSADateFormate(this.state.startDateFormat) : this.getUSADateFormate(this.state.startDateFormat)}
                    </Text>
                  {/*)}*/}
                  <Icon
                    name="chevron-right"
                    type="Feather"
                    style={{
                      fontSize: 20,
                      padding: PixelToDP(5),
                      color: 'white',
                    }}
                  />
                </View>
              </TouchableOpacity>
              {this.state.isTaskStartDateSelected && (
                <View style={{
                    width:widthPercentageToDP(50),
                    // height:heightPercentageToDP(0),
                    alignSelf:'center',
                    // backgroundColor:'red',
                    alignItems:'center'
                }}>
                  <DatePicker
                    mode={'datetime'}
                    locale='en'
                    // maximumDate={new Date().setFullYear(new Date().getFullYear() +1)}
                    // minimumDate={new Date('2019-01-01')}
                    date={this.state.sdate}
                    format="YYYY-MM-DD HH:mm"
                    onDateChange={date => this.setDate(date)}
                    fadeToColor={'none'}
                    textColor={'#ffffff'}
                  />
                </View>
              )}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: PixelToDP(55),
                  borderBottomColor: '(rgba(255, 255, 255, 0.29)',
                  borderBottomWidth: PixelToDP(1),
                }}
                onPress={() => this.props.navigation.navigate('Repeat')}>
                <Text style={styles.settingText}>Repeat</Text>

                <View
                  style={{
                    position: 'absolute',
                    right: PixelToDP(0),
                    flexDirection: 'row',
                  }}>
                  <Text style={styles.settingText}>
                    {/*{this.props.navigation.getParam('RepeatDay')*/}
                    {/*  ? this.props.navigation.getParam('RepeatDay')*/}
                    {/*  : 'Never'}*/}
                    {this.state.repeat}
                  </Text>
                  <Icon
                    name="chevron-right"
                    type="Feather"
                    style={{
                      fontSize: 20,
                      padding: PixelToDP(5),
                      color: 'white',
                    }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  height: PixelToDP(55),
                  borderBottomColor: '(rgba(255, 255, 255, 0.29)',
                  borderBottomWidth: PixelToDP(1),
                }}
                onPress={() =>
                  this.state.repeat != 'Never'
                    ? this.props.navigation.navigate('RepeatEnd')
                    : Toast.show({
                        text: 'Set Repeat Day !',
                        buttonText: 'Hide',
                        position: 'bottom',
                      })
                }>
                <Text style={styles.settingText}>End Repeat</Text>
                <View
                  style={{
                    position: 'absolute',
                    right: PixelToDP(0),
                    flexDirection: 'row',
                  }}>
                  {/*{reI === 1 ? (*/}
                  {/*  <Text style={styles.settingText}>{re}</Text>*/}
                  {/*) : (*/}
                  {/*  <Text style={styles.settingText}>{rod}</Text>*/}
                  {/*)}*/}
                  {this.state.repeatEndIndex === 1 ? (
                      <Text style={styles.settingText}>{this.state.repeatEnd}</Text>
                  ) : (
                      <Text style={styles.settingText}>{this.getUSADateFormate(this.state.repeatOnDate)}</Text>
                  )}
                  <Icon
                    name="chevron-right"
                    type="Feather"
                    style={{
                      fontSize: 20,
                      padding: PixelToDP(5),
                      color: 'white',
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Root>
      </View>
    );
  }
}
