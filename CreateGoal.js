import React, { PureComponent } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ImageBackground,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, Button, Icon, Toast } from 'native-base';
import { styles } from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP, responsiveFontSize,
  widthPercentageToDP,
} from './PixelRatio';
import { StatusDialog } from './StatusDialog';
import SQLdatabase from './SQLdatabase';
import { CreateGoalDialog } from './CreateGoalDialog';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Progress, Priority } from './InsertInToDatabase';
import DraggableFlatList from 'react-native-draggable-flatlist';
import NotifService from './NotifService';
import { CancelNotificationOfCompleteTask, setNotification, setNotificationOfInCompleteTask } from './setNotification';

const db = new SQLdatabase();
var selectedTask = [],
  newTaskOrder = [];
var goalCustomImage = "", goalIcon = "";
export class CreateGoal extends PureComponent {
  static navigationOptions = {
    header: null,
  };
  state = {
    GoalId: 0,
    Accomplished: 0,
    Goal: [],
    Tasks: [],
    // progress: [],
    // priority: [],
    // Goal:{},
    Title: '',
    IconId: '',
    // Icon: '',
    selectedTaskProgressId: 0,
    selectedTaskPriorityId: 0,
    selectedTaskId: 0,
    StatusDialogVisible: false,
    // customImg: 0,
    isGoalsLoading: true,
    isTaskLoading: true,
    taskTitle: '',
    taskDescription: '',
    CreateGoalDialogVisible: false,
  };
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      console.log('componentDidMount method is executed ');
      goalCustomImage = this.props.navigation.getParam('goalCustomIcon').toString();
      goalIcon = this.props.navigation.getParam('goalIcon');
      console.log("customImage :", goalCustomImage);
      console.log("goalIcon :", goalIcon);
      this.getTasks();
      // this.getGoal();
      // this.updateGoal();
    });
  }
  constructor(props) {
    super(props);
    console.log('constructor method is executed ');
    this.notif = new NotifService(
      this.onRegister.bind(this),
      this.onNotif.bind(this),
    );
    this.getGoal();
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
  getGoal() {
    this.setState({
      isGoalLoading: true,
    });
    console.log('GetGoal method is executed');
    console.log(this.props.navigation.getParam('goalId'));
    let Goal = {};
    let TaskIcon = {};
    let gid = this.props.navigation.getParam('goalId');
    // let title = this.props.navigation.getParam("goalTitle");
    //  let Iid = this.props.navigation.getParam("TaskIconId");
    //  let accomplished = this.props.navigation.getParam("accomplishedPercent");
    console.log('gid: ' + gid);
    db.getGoals().then(goalResult => {
      db.getTaskIcon().then(result => {
        console.log("goalResult :", goalResult)
        for (let i = 0; i < goalResult.length; i++) {
          let g = goalResult[i];
          console.log("g :", g);
          if (g.Id == gid) {
            Goal = {
              Id: g.Id,
              goal: g.goal,
              refTaskIcon: g.refTaskIcon,
              accomplishedPercentage: g.accomplishedPercentage,
              isCompleted: g.isCompleted,
              isActive: g.isActive,
              taskIcon: result.find(
                t => t.Id == g.refTaskIcon && t.isActive == 1,
              ).icon,
              customImg: result.find(
                t => t.Id == g.refTaskIcon && t.isActive == 1,
              ).customImage,
            };
            break;
          }
        };
        console.log('get let Goal :', Goal);
        this.setState({
          Goal,
          GoalId: gid,
          isGoalsLoading: false,
        }, this.updateTaskByTaskOnDate());
        console.log('get Goal :', this.state.Goal);
      })
        .catch(err => {
          console.log(err);
          this.setState = {
            isGoalsLoading: true,
          };
          this.forceUpdate();
        });
    });
  }
  updateTaskByTaskOnDate = () => {
    let dataList = [];
    db.getTask().then((result) => {
      db.getTaskOnDate().then((tod) => {
        result.forEach(t => {
          if (t.refGoal == this.state.GoalId && t.isActive == 1) {
            let todCompletedCount = 0;
            for (let i = 0; i < tod.length; i++) {
              let td = tod[i];
              if (td.isCompleted == 1 && td.refTask == t.Id) {
                todCompletedCount = 1;
                break;
              }
            }
            console.log("todCompletedCount :", todCompletedCount);
            if (todCompletedCount == 1 && t.refProgress != 3) {
              t.refProgress = 2;
              dataList.push(t);
              console.log("dataList :", dataList);
            }
          }
        })
        console.log("dataList2 :", dataList);
        if (dataList.length > 0) {
          console.log("dataList length is greater than 0");
          db.updateTasksList(dataList).then((result) => {
            console.log(result);
            this.getTasks();
          });
        }
        else {
          console.log("dataList length is 0");
        }
      });
    })
  }
  // t.Id,t.task, t.refGoal,t.RefAddTo,t.startDate,t.refTaskRepeat,t.refTaskRepeatEnd,t.endOnDate,t.refProgress,t.refPriority,t.isActive
  getTasks = () => {
    // this.setState({
    //   isTaskLoading: true,
    // });
    let Tasks = [];
    db.getTask().then(result => {
      // db.getProgress().then(progress => {
      //   db.getPriority().then(priority => {
      result.forEach(t => {
        if (t.refGoal == this.state.GoalId && t.isActive == 1) {
          Tasks.push({
            Id: t.Id,
            task: t.task,
            taskDescription: t.taskDescription,
            refGoal: t.refGoal,
            refAddTo: t.refAddTo,
            startDate: t.startDate,
            refTaskRepeat: t.refTaskRepeat,
            refTaskRepeatEnd: t.refTaskRepeatEnd,
            endOnDate: t.endOnDate,
            refProgress: t.refProgress,
            refPriority: t.refPriority,
            isActive: t.isActive,
            orderIndex: t.orderIndex,
            Progress: Progress.find(
              pr => pr.Id == t.refProgress && pr.isActive == 1,
            ).image,
            Priority: Priority.find(
              pri => pri.Id == t.refPriority && pri.isActive == 1,
            ).image,
          });
        }
      });

      Tasks.sort((a, b) => a.orderIndex - b.orderIndex);
      console.log('getTask after sorting :', Tasks);
      this.setState({
        Tasks,
        isTaskLoading: false,
      }, () => {
        newTaskOrder = Tasks;
        console.log('getTask :', this.state.Tasks);
        if (Tasks.length > 0) {
          this.updateGoal();
        }
      });
    });
  };
  updateGoal = (isCompleted = 0, completePercentage = 0) => {
    // let completePercentage = 0;
    console.log(
      ' isGoalsLoading :' +
      this.state.isGoalsLoading +
      ' isTaskLoading: ' +
      this.state.isTaskLoading +
      ' taskLength :' +
      this.state.Tasks.length,
    );
    if (
      !this.state.isGoalsLoading &&
      !this.state.isTaskLoading &&
      this.state.Tasks.length > 0
    ) {
      let taskLength = this.state.Tasks.length;
      if (completePercentage == 0) {
        let complete = 0;
        this.state.Tasks.forEach(t => {
          if (t.refProgress === 3) {
            complete++;
          }
        });
        if (complete > 0) {
          completePercentage = Math.floor((complete * 100) / taskLength);
        }
        console.log('completePecentage :' + completePercentage);
      }
      console.log('update Goal, Goal :', this.state.Goal);
      let data = {
        Id: this.state.Goal.Id,
        goal: this.state.Goal.goal,
        refTaskIcon: this.state.Goal.refTaskIcon,
        isCompleted: isCompleted,
        accomplishedPercentage: completePercentage,
        isActive: this.state.Goal.isActive,
      };
      console.log('CreateGoal.js,updateGoal', data);
      db.updateGoals(this.state.GoalId, data).then(result => {
        const { Goal } = this.state;
        Goal.accomplishedPercentage = data.accomplishedPercentage;
        Goal.isCompleted = data.isCompleted;
        Goal.isActive = data.isActive;
        this.setState({
          Goal,
          isGoalsLoading: false,
        }, () => {
          console.log(' goal update query executed successfully', Goal);
          if (Goal.isCompleted == 1) {
            this.CancelNotificationOnDeleteGoal();
            this.props.navigation.navigate('Home');
          }
          this.forceUpdate();
        });
      });
    }
  };
  deleteGoal = () => {
    Alert.alert(
      'Alert',
      'Are you sure you want to delete this Goal ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            let data = {
              Id: this.state.Goal.Id,
              goal: this.state.Goal.goal,
              refTaskIcon: this.state.Goal.refTaskIcon,
              isCompleted: this.state.Goal.isCompleted,
              accomplishedPercentage: this.state.Goal.accomplishedPercentage,
              isActive: 0,
            };
            console.log('CreateGoal.js,delete date :', data);
            db.updateGoals(this.state.GoalId, data).then(result => {
              this.CancelNotificationOnDeleteGoal();
              this.props.navigation.navigate('Home');
            });
          },
        },
      ],
      { cancelable: false },
    );
  };
  CancelNotificationOnDeleteGoal = () => {
    let updateTODList = [];
    this.state.Tasks.forEach(t => {
      db.getTaskOnDateByRefTask(t.Id).then((result) => {
        result.forEach(td => {
          if (td.notifyId != "") {
            td.isNotificationCancel = 1;
            updateTODList.push(td);
            this.notif.cancelNotif(td.notifyId);
          }
        })
        if (updateTODList.length > 0) {
          db.updateTaskOnDateList(updateTODList).then(response => {
            console.log("TaskOnDate is updated successfully");
          })
        }
      })
    })
  }
  completeGoal = () => {
    console.log("completeGoal method is executed");
    Alert.alert(
      'Alert',
      'Are you sure you want to complete this Goal ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            let dataList = [];
            this.state.Tasks.forEach(t => {
              t.refProgress = 3;
              dataList.push(t);
            });
            db.updateTasksList(dataList).then((result) => {
              console.log(result);
              let tod = [];
              db.getTaskOnDate().then((taskOnDate) => {
                taskOnDate.forEach(t => {
                  let task = dataList.find(l => l.Id == t.refTask)
                  if (task != null) {
                    t.isCompleted = 1;
                    let date = new Date();
                    let dateformate = date.getFullYear() +
                      '-' +
                      ('0' + (date.getMonth() + 1)).slice(-2) +
                      '-' +
                      ('0' + date.getDate()).slice(-2);
                    t.completedDate = dateformate;
                    t.isNotificationCancel = 1;
                    if (t.notifyId != "")
                      this.notif.cancelNotif(t.notifyId);
                    tod.push(t);
                  }
                });
                db.updateTaskOnDateList(tod).then((resultTaskOnDate) => {
                  console.log("TaskOnDate is update successfully :", resultTaskOnDate);
                })
              });
              this.updateGoal(0, 100);
              this.getTasks();
            });
          }
        }])
  }
  savesortedList = () => {
    for (let data of newTaskOrder) {
      console.log('data is going to be update :', data);
      db.updateTasks(data.Id, data).then(result => {
        console.log('data saved :', result);
      });
    }
    this.getTasks();
  };

  render() {
    const { Goal, Tasks } = this.state;
    return (
      <View style={styles.flexScreen}>
        <ImageBackground
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('./Images/gradient.png')}
          resizeMode={'stretch'}>
          {this.state.isGoalsLoading ? (
            <ActivityIndicator />
          ) : (
            <SafeAreaView style={[styles.titlebar, {
              height: PixelToDP(98),
            }]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}
                style={[styles.backTouch, { width: widthPercentageToDP(10) }]}>
                <Image
                  style={styles.backImageIcon}
                  resizeMode={'stretch'}
                  source={require('./Images/back.png')}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  width: widthPercentageToDP(60),
                  // backgroundColor:'red'
                  marginTop: 0
                }}>

                <AnimatedCircularProgress
                  // size={PixelToDP(40)}
                  size={responsiveFontSize(8.8)}
                  width={PixelToDP(3.6)}
                  fill={Goal.accomplishedPercentage}
                  tintColor="#ffffff"
                  backgroundColor="#43b2ac"
                >
                  {
                    () => (
                      <View style={{
                        height: PixelToDP(100),
                        width: PixelToDP(100),
                        borderRadius: PixelToDP(100),
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Image
                          style={[goalCustomImage == 1 ? styles.customImage : styles.nonCustomImage, {
                          }]}
                          resizeMode={'contain'}
                          source={{ uri: goalIcon }}
                        />
                      </View>
                    )
                  }
                </AnimatedCircularProgress>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: "flex-start",
                    marginLeft: PixelToDP(8),
                    marginTop: 0,
                    flexWrap: "wrap",

                  }}>
                  <Text style={[styles.OswaldFont, {
                    color: 'white',
                    paddingLeft: 10,
                    // fontSize: PixelToDP(15)
                    fontSize: responsiveFontSize(2.5)
                  }]}>
                    {Goal.goal}
                  </Text>
                  <Text
                    style={{
                      backgroundColor: '#2BCB4E',
                      borderRadius: PixelToDP(20),
                      color: 'white',
                      width: '90%',
                      // fontSize: PixelToDP(14),
                      fontSize: responsiveFontSize(2.2),
                      // height: PixelToDP(25),
                      paddingTop: PixelToDP(3),
                      paddingBottom: PixelToDP(3),
                      paddingLeft: PixelToDP(15),
                      paddingRight: PixelToDP(15),
                      borderColor: "#fff",
                      marginTop: 5,
                      borderWidth: 2
                    }}>
                    {Goal.accomplishedPercentage
                      ? Goal.accomplishedPercentage
                      : 0}{' '}
                    % Accomplished
                  </Text>
                </View>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: widthPercentageToDP(25),
                  // position: 'absolute',
                  // right: PixelToDP(6),
                  marginRight: PixelToDP(6),
                  height: '100%',
                  alignItems: 'center',
                  marginLeft: PixelToDP(10),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#30B3AB',
                    borderRadius: PixelToDP(5),
                    width: widthPercentageToDP(7),
                    height: PixelToDP(40),
                    justifyContent: 'center',
                    marginRight: PixelToDP(5)
                  }}
                  onPress={() => {
                    this.setState({
                      CreateGoalDialogVisible: !this.state
                        .CreateGoalDialogVisible,
                    });
                  }}>
                  <Icon
                    name="edit"
                    type="Feather"
                    style={{
                      fontSize: PixelToDP(12),
                      color: 'white',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#325859',
                    borderRadius: PixelToDP(5),
                    width: widthPercentageToDP(7),
                    height: PixelToDP(40),
                    justifyContent: 'center',
                    marginRight: PixelToDP(5)
                  }}
                  onPress={this.deleteGoal.bind(this)}>
                  <Icon
                    name="trash-2"
                    type="Feather"
                    style={{
                      fontSize: PixelToDP(12),
                      color: 'white',
                      alignSelf: 'center',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#325859',
                    borderRadius: PixelToDP(5),
                    width: widthPercentageToDP(7),
                    height: PixelToDP(40),
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Alert',
                      'Are you sure you want to achieve this Goal ?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        { text: 'OK', onPress: () => this.updateGoal(1) },
                      ],
                      { cancelable: false },
                    );
                  }}>
                  <Icon
                    name="archive"
                    type="Feather"
                    style={{
                      color: 'white',
                      alignSelf: 'center',
                      fontSize: PixelToDP(12),
                    }}
                  />
                </TouchableOpacity>
              </View> */}
            </SafeAreaView>
          )}
          {/*}*/}
          {this.state.Tasks.length > 0 && (
            <View
              style={{
                width: widthPercentageToDP(90),
                height: PixelToDP(40),
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: PixelToDP(20),
              }}>
              <TouchableOpacity
                style={{
                  width: widthPercentageToDP(45),
                  height: 'auto',
                  marginTop: PixelToDP(40),
                  marginBottom: PixelToDP(20),
                  padding: PixelToDP(5),
                  borderWidth: PixelToDP(5),
                  alignSelf: 'center',
                  borderColor: '#58c3be',
                  borderRadius: PixelToDP(15),
                  backgroundColor: 'white',
                  shadowColor: '#121010',
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 6,
                }}
                onPress={this.completeGoal.bind(this)}>
                <Text style={{
                  color: '#4bc9c1',
                  fontSize: responsiveFontSize(2.3),
                  textTransform: 'capitalize',
                  fontFamily: 'Oswald-Regular',
                  letterSpacing: 0.7,
                  alignSelf: "center",
                  textAlign: "center",
                  width: widthPercentageToDP(100),
                  paddingTop: 25
                }}>Complete Goal</Text>
              </TouchableOpacity>

              {/*<TouchableOpacity*/}
              {/*  style={{*/}
              {/*    borderColor: 'white',*/}
              {/*    padding: PixelToDP(3),*/}
              {/*    paddingLeft:PixelToDP(6),*/}
              {/*    paddingRight:PixelToDP(6),*/}
              {/*    borderWidth: PixelToDP(1),*/}
              {/*    height: 'auto',*/}
              {/*    borderRadius: PixelToDP(10),*/}
              {/*    justifyContent:'center'*/}
              {/*  }}*/}
              {/*  onPress={this.savesortedList}>*/}
              {/*  <Text style={{*/}
              {/*    color: 'white',*/}
              {/*    // fontSize: PixelToDP(14),*/}
              {/*    fontSize:responsiveFontSize(1.8)*/}
              {/*    // lineHeight: PixelToDP(30),*/}
              {/*    // textAlignVertical: 'center',*/}
              {/*  }}> Rearrange</Text>*/}
              {/*</TouchableOpacity>*/}
            </View>
          )}
          {/*<ScrollView*/}
          {/*  style={{*/}
          {/*    width: widthPercentageToDP(90),*/}
          {/*    alignSelf: 'center',*/}
          {/*    marginBottom:PixelToDP(80),*/}
          {/*    marginTop: PixelToDP(20),*/}
          {/*  }}>*/}
          {this.state.isTaskLoading ? (
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1
              }}
            >
              <ActivityIndicator size='large' color='black' />
            </View>
          ) : (
            <ScrollView
              style={{
                width: widthPercentageToDP(90),
                alignSelf: 'center',
                marginBottom: PixelToDP(80),
                marginTop: PixelToDP(20),
              }}>
              <DraggableFlatList
                data={Tasks}
                keyExtractor={(item, index) => `draggable-item-${item.key}`}
                scrollPercent={5}
                onMoveEnd={({ data, to, from, row }) => {
                  console.log("Move end is executed" + data + ", " + to + ", " + from + ", " + row);
                  console.log("newTaskOrder :", newTaskOrder);
                  this.setState({ Tasks: data }, () => {
                    console.log("change order :", this.state.Tasks)
                    for (let i = 0; i < this.state.Tasks.length; i++) {
                      newTaskOrder.find(n => n.Id == this.state.Tasks[i].Id).orderIndex = i
                    }
                    this.savesortedList();
                  })
                }}
                // scrollEnabled={true}
                // onReleaseRow={(key, currentOrder) => {
                //   console.log('current Order :', currentOrder);
                //   for (let i = 0; i < currentOrder.length; i++) {
                //     newTaskOrder[currentOrder[i]].orderIndex = i;
                //   }
                //   console.log('new Order  List:', newTaskOrder);
                // }}
                // renderRow={(Tasks, active) => (
                renderItem={({ item, index, move, moveEnd, isActive }) => (
                  <TouchableOpacity
                    style={[
                      {
                        flexDirection: 'row',
                        width: '100%',
                        height: PixelToDP(60),
                        alignItems: 'center',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 6,
                        marginBottom: 20,
                        borderWidth: PixelToDP(5),
                        alignSelf: 'center',
                        borderColor: '#58c3be',
                        borderRadius: PixelToDP(15),
                        backgroundColor: "#fff"
                      },
                    ]} onLongPress={move}
                    onPressOut={moveEnd}
                    onPress={() => {
                      this.setState({
                        StatusDialogVisible: !this.state.StatusDialogVisible,
                        selectedTaskId: item.Id,
                      });
                      selectedTask = item;
                    }}
                  >
                    {console.log('Tasks Draggable :', item)}
                    <Image
                      resizeMode={'contain'}
                      style={{
                        // height: PixelToDP(45),
                        // width: PixelToDP(45),
                        height: responsiveFontSize(5.0),
                        marginLeft: 15,
                        width: responsiveFontSize(5.0)
                      }}
                      source={{ uri: item.Progress }}
                    />
                    <Text
                      style={[styles.settingText, styles.OswaldFont, { marginLeft: PixelToDP(20), textAlign: "center", fontWeight: "bold", color: "#4bc9c1", borderBottomWidth: 0 }]}>
                      {item.task}
                    </Text>

                    <View
                      style={{
                        // backgroundColor: item.Priority,
                        // backgroundColor:'red',
                        borderRadius: PixelToDP(20),
                        width: PixelToDP(20),
                        height: PixelToDP(20),
                        justifyContent: 'center',
                        position: 'absolute',
                        right: 25,
                      }}
                    >
                      <Image
                        resizeMode={'contain'}
                        style={{
                          height: responsiveFontSize(5.0),
                          width: responsiveFontSize(5.0)
                        }}
                        source={{ uri: item.Priority }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          )}

          <View style={styles.buttonsFooter}
          >
            <TouchableOpacity
              style={{
                height: 'auto',
                alignItems: 'center',
              }}
              onPress={() => {
                Alert.alert(
                  'Alert',
                  'Are you sure you want to achieve this Goal ?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'OK', onPress: () => this.updateGoal(1) },
                  ],
                  { cancelable: false },
                );
              }}
            >
              <Image
                style={{
                  alignSelf: 'center',
                  height: heightPercentageToDP(9),
                  width: heightPercentageToDP(9),
                }}
                resizeMode={'contain'}
                source={require('./Images/archeive.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 'auto',
                alignItems: 'center',
              }}
              onPress={() =>
                this.props.navigation.navigate('CreateTaskDialog', {
                  GoalId: Goal.Id,
                })
              }
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
            <TouchableOpacity
              style={{
                height: 'auto',
                alignItems: 'center',
              }}
              onPress={this.deleteGoal.bind(this)}
            >
              <Image
                style={{
                  alignSelf: 'center',
                  height: heightPercentageToDP(9),
                  width: heightPercentageToDP(9),
                }}
                resizeMode={'contain'}
                source={require('./Images/trash.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={styles.buttonsFooterText}>
            <Text style={styles.buttonsFooterTextTitle}>
              Archive
                </Text>
            <Text style={[styles.buttonsFooterTextTitle, {
              top: 5
            }]}>
              New Goal
                </Text>
            <Text style={styles.buttonsFooterTextTitle}>
              Delete
                </Text>
          </View>
          <CreateGoalDialog
            visible={this.state.CreateGoalDialogVisible}
            goal={Goal.goal}
            onClose={goalTitle => {
              console.log(
                '' +
                'Create Goal.js, GoalTitle:' +
                goalTitle +
                'goalId' +
                Goal.Id,
              );
              this.setState({ CreateGoalDialogVisible: false });
              if (goalTitle) {
                let data = Goal;
                data.goal = goalTitle;
                this.props.navigation.navigate('AddIcon', {
                  GoalData: data,
                  isEdited: 'true',
                });
              }
            }}
          />
          <StatusDialog
            visible={this.state.StatusDialogVisible}
            selectedTask={selectedTask}
            onClose={data => {
              this.setState({
                StatusDialogVisible: false,
                isTaskLoading: true,
              });
              console.log("updated Task:", data);
              db.updateTasks(this.state.selectedTaskId, data).then(result => {
                this.getTasks();
                if (data.refAddTo != 1 && data.refAddTo != 4) {
                  db.getTaskOnDateByRefTask(data.Id).then(response => {
                    let updateTODList = [];
                    if (data.refProgress == 3 && selectedTask.refProgress != 3) {
                      let tod = response[0];
                      tod.isActive = data.isActive;
                      CancelNotificationOfCompleteTask(tod, this.notif);
                    }
                    else if (data.isActive == 0) {
                      response.forEach(tod => {
                        if (tod.isNotificationRegistered == 1) {
                          tod.isNotificationCancel = 1;
                          tod.isActive = 0;
                          updateTODList.push(tod);
                          if (tod.isNotificationRegistered == 1)
                            this.notif.cancelNotif(tod.notifyId);
                        }
                      });
                      if (updateTODList.length > 0) {
                        db.updateTaskOnDateList(updateTODList).then(response => {
                          console.log("TaskOnDate is updated successfully");
                        })
                      }
                    }
                    else if (data.refProgress != 3) {
                      if (selectedTask.task != data.task) {
                        response.forEach(tod => {
                          if (tod.isNotificationRegistered == 1 && (tod.isNotificationCancel == 0 || selectedTask.refProgress != 3)) {
                            this.notif.cancelNotif(tod.notifyId);
                            setNotificationOfInCompleteTask(tod, data.task, this.notif);
                          }
                        });
                      }
                      else if (selectedTask.refProgress == 3) {
                        console.log("task is restarted");
                        let tod = response[0];
                        tod.isCompleted = 0;
                        tod.isActive = data.isActive;
                        setNotificationOfInCompleteTask(tod, data.task, this.notif);
                      }
                    }
                  })
                }
              });
            }}
          />
        </ImageBackground>
      </View>
    );
  }
}
