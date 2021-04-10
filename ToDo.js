import React, { PureComponent } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ImageBackground,
  ScrollView,
  Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text, Button, Icon, Toast } from 'native-base';
import { styles } from './CustomStyleSheet';
import {
  heightPercentageToDP,
  PixelToDP, responsiveFontSize,
  widthPercentageToDP,
} from './PixelRatio';
import { AddTaskDialog } from './AddTaskDialog';
import SQLdatabase from './SQLdatabase';
import { Progress, Priority } from './InsertInToDatabase';

const db = new SQLdatabase();
var task = '',
  taskDescription = '',
  selectedTask = [];
var logo =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAiCAYAAACnSgJKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIQSURBVHgBtVftccIwDFV6/V9G8AbNCOkG3QA2gE4AG5QNaCegnQA2gE5gNgidQJVqpxhFTk2cvDudkyD7WbI+TAEZQMQJDVOSkuRMciyK4h3GBJOSvKIOS2JgDNDCFUmN3bDeK4MSLyNEa5I3sakFDAWFuJYE9D4jOfjfNzAEFGJLUip6ZUC+g1zQInNMDCh08WC93hpywCSpxF5/SbL1us/QF+jSyQryMmEOk1vIAbbzOCl6/Yan0Bf+7EIknR+7mmQFORDu5uekguGDs39xQZerIZJdiLlVTVi9hRFxL4hnNJjg0wtkAi+dz5Dw817tfMLqrPKIl86nNaHD1REpZ22gJ9CVWYvdWIUT7BBWo6uK0lp+5863Qln7sZ3XFfSAJ7ZirYXilV1IvgmUe5dGsQ5jFtGb/3lX7LZXaURX3fQzbetyfJnGDSEM3Ai/Ri3O2KRMnOW4XCFGTAzYO3DX3gZfcAPQtVgOHFlWP1PmM/lj8H6ERHQQM06KPsfERJJ3TooQTwUxzzsHKpNAt/JpxX2ikgsd/ksNoa/e6dDlrvxea7oQWK7uWCH9rdX0GF4sTiRP1Ch4lM3CKOudrr6hu+w32EWIw1upaoXXW6GOHWr1A9sNpZTWRhYzEPdQ5YXTMH7B8Mq1sGiD7TNskHcfT7A+5roKxgDGz6v1n2woFGIDhgYmeiD5JvmgSN7DSPgBqqqp0csGMeQAAAAASUVORK5CYII=';
export class ToDo extends PureComponent {
  static navigationOptions = {
    header: null,
  };
  state = {
    AddTaskVisible: false,
    goals: [],
    taskIcon: [],
    Tasks: [],
    isTaskLoading: true
  };
  // constructor(props) {
  //     super(props);
  //
  // }
  componentDidMount(): void {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getTasks();
    });
  }
  saveTask() {
    // console.log("save Task : "+this.state.repeatDaysId+","+ this.state.repeatEndDayId+","+this.state.repeatEndOnDate);
    console.log('saveTask method is executed');
    // const {task,taskDescription}= this.state;
    if (this.state.task === '' || this.state.taskDescription === '') {
      console.log('all field are mandatory');
    }
    // Toast.show({
    //     text: "All field are mandatory.",
    //     buttonText: "Hide"
    // });
    else {
      // if(this.props.navigation.)
      db.getTask().then(result => {
        let len = result.length;
        let data = {
          Id: len + 1,
          task: task,
          taskDescription: taskDescription,
          refGoal: null,
          refAddTo: 1,
          startDate: null,
          refTaskRepeat: null,
          refTaskRepeatEnd: null,
          endOnDate: null,
          refProgress: 1,
          refPriority: 1,
          orderIndex: len,
        };
        db.insertInToTasks(data)
          .then(result => {
            console.log('data saved:', result);
            this.getTasks();
          })
          .catch(err => {
            console.log(err);
          });
      });

      console.log('data will be save');
    }
  }
  getTasks = () => {
    console.log('To Do getTasks method is executed');
    let Tasks = [];
    db.getTask().then(task => {
      db.getGoals().then(goals => {
        db.getTaskIcon().then(taskIcon => {
          this.setState({
            goals,
            taskIcon,
          });
          // console.log("To Do: task"+ task)
          task.forEach(t => {
            if (
              (t.refAddTo == 1 || t.refAddTo == 3) &&
              ((t.refGoal &&
                goals.find(g => g.Id == t.refGoal).isActive &&
                goals.find(g => g.Id == t.refGoal).isCompleted == 0) ||
                t.refGoal == null)
            ) {
              // console.log("t.refGoal" + t.refGoal)
              // console.log(",goals[t.refGoal]:"+ goals[(t.refGoal -1)].refTaskIcon)
              // console.log(",taskIcon[goals[t.refGoal].refTaskIcon].icon :"+ taskIcon[goals[(t.refGoal-1)].refTaskIcon].icon)
              if (t.refProgress < 3 && t.isActive == 1) {
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
                  orderIndex: t.orderIndex,
                  Progress: Progress.find(
                    pr => pr.Id == t.refProgress && pr.isActive == 1,
                  ).image,
                  Priority: Priority.find(
                    pri => pri.Id == t.refPriority && pri.isActive == 1,
                  ).color,
                  goalIcon: t.refGoal
                    ? taskIcon.find(
                      ti =>
                        ti.Id ==
                        goals.find(
                          g => g.Id == t.refGoal && g.isActive == 1,
                        ).refTaskIcon && ti.isActive == 1,
                    ).icon
                    : logo,
                  customImg: t.refGoal
                    ? taskIcon.find(
                      ti =>
                        ti.Id ==
                        goals.find(
                          g => g.Id == t.refGoal && g.isActive == 1,
                        ).refTaskIcon && ti.isActive == 1,
                    ).customImage
                    : 0,
                  isActive: t.isActive,
                  // (taskIcon[(goals[(t.refGoal -1)].refTaskIcon -1)].icon):logo,
                });
                console.log('To Do:', Tasks);
              }
            }
          });
          console.log('To Do: outer loop', Tasks);
          this.setState({
            Tasks,
            isTaskLoading: false
          });
          // this.forceUpdate();
        });
      });
    });
  };
  updateTask = (selectedTask, isDeleted, iscompleted) => {
    let data = selectedTask;
    if (iscompleted) {
      data.refProgress = 3;
    }
    if (isDeleted) {
      data.isActive = 0;
    }
    console.log('ToDo data for update: ', data);
    db.updateTasks(data.Id, data).then(result => {
      console.log('data saved :', result);
      this.getTasks();
    });
  };
  render() {
    return (
      <View style={styles.flexScreen}>
        <StatusBar
          backgroundColor="#22DCD3"
          barStyle="light-content"
          hidden={true}
        />
        <ImageBackground
          style={{
            width: '100%',
            height: '100%',
          }}
          source={require('./Images/gradient.png')}
          resizeMode={'stretch'}>
          <SafeAreaView style={[styles.titlebar, {
            borderBottomWidth: 4,
            borderBottomColor: "#FFF",
            paddingBottom: 25
          }]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Home')}
              style={[styles.backTouch, {
                width: '37%',
              }]}>
              <Image
                style={styles.backImageIcon}
                resizeMode={'stretch'}
                source={require('./Images/back.png')}
              />
              <Text style={styles.backLogo}>CC</Text>
            </TouchableOpacity>
            <Text style={[styles.titleText, {
              textTransform: 'uppercase',
              width: '20%'
            }]}>To-Do</Text>
            <TouchableOpacity
              style={[styles.titleRightButton, {
                width: '40%',
              }]}
              onPress={() =>
                this.props.navigation.navigate('AccomplishedTasks')
              }>
              <Text
                style={{
                  textTransform: 'uppercase',
                  // fontSize: PixelToDP(16),
                  fontSize: responsiveFontSize(2),
                  color: 'white',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  // fontFamily: "Oswald-Regular"
                  // height: '100%',
                }}>
                Accomplished
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
          <ScrollView>
            {this.state.isTaskLoading ? (<View
              style={{
                // position: 'absolute',
                // left: 0,
                // right: 0,
                // top: 0,
                // bottom: 0,
                paddingTop: heightPercentageToDP(10),
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}>
              <ActivityIndicator size="large" color="black" />
            </View>) :
              <View
                style={{
                  width: widthPercentageToDP(90),
                  alignSelf: 'center',
                  height: 'auto',
                  marginBottom: PixelToDP(60),
                }}>

                <FlatList
                  data={this.state.Tasks}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        height: PixelToDP(55),
                        borderBottomColor: '(rgba(255, 255, 255, 0.29)',
                        borderBottomWidth: PixelToDP(1),
                        alignItems: 'center'
                      }}
                    >
                      <View style={styles.taskImageBorderToDoWhite}>
                        <Image
                          style={[item.customImg == 1 ? styles.customImage : styles.nonCustomTODoImage, {
                          }]}
                          resizeMode={'contain'}
                          source={{ uri: item.goalIcon }}
                        />
                      </View>
                      <Text
                        style={[styles.settingText, { marginLeft: PixelToDP(10) }]}>
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
                            // width: PixelToDP(30),
                            // height: PixelToDP(30),
                            width: widthPercentageToDP(8),
                            height: widthPercentageToDP(8),
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            selectedTask = item;
                            this.setState({
                              AddTaskVisible: !this.state.AddTaskVisible,
                            });
                            console.log('selected TAsk :', selectedTask);
                          }}>
                          <Icon
                            name="edit"
                            type="Feather"
                            style={{
                              // fontSize: PixelToDP(16),
                              fontSize: responsiveFontSize(1.8),
                              color: 'white',
                              alignSelf: 'center',
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#325859',
                            borderRadius: PixelToDP(30),
                            // width: PixelToDP(30),
                            // height: PixelToDP(30),
                            width: widthPercentageToDP(8),
                            height: widthPercentageToDP(8),
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
                                  onPress: () =>
                                    this.updateTask(item, true, false),
                                },
                              ],
                              { cancelable: false },
                            );
                          }}>
                          <Icon
                            name="trash-2"
                            type="Feather"
                            style={{
                              // fontSize: PixelToDP(16),
                              fontSize: responsiveFontSize(1.8),
                              color: 'white',
                              alignSelf: 'center',
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            // backgroundColor:'#3BDE86',
                            borderRadius: PixelToDP(30),
                            // width: PixelToDP(30),
                            // height: PixelToDP(30),
                            width: widthPercentageToDP(8),
                            height: widthPercentageToDP(8),
                            justifyContent: 'center',
                            borderColor: 'white',
                            borderWidth: PixelToDP(1),
                          }} onPress={() => {
                            Alert.alert(
                              'Alert',
                              'Are you sure you want to accomplished this task ?',
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {
                                  text: 'OK',
                                  onPress: () => this.updateTask(item, false, true),
                                },
                              ],
                              { cancelable: false },
                            );
                          }}>
                          {/*<Icon*/}
                          {/*    name="check"*/}
                          {/*    type="Feather"*/}
                          {/*    style={{*/}
                          {/*        color: "white",*/}
                          {/*        alignSelf:'center',*/}
                          {/*        fontSize: PixelToDP(16),*/}

                          {/*    }}*/}

                          {/*/>*/}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              </View>
            }
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
          <View
            style={{
              width: widthPercentageToDP(40),
              borderRadius: widthPercentageToDP(40),
              backgroundColor: '#8fc6c2',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              width: '90%',
              marginTop: 50,
              margin: 'auto',
              alignSelf: 'center',
              shadowColor: '#3ca29b',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.25,
              shadowRadius: 5.46,
              elevation: 4,
              position: 'absolute',
              height: heightPercentageToDP(9),
              top: heightPercentageToDP(77),
            }}>
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
          <View
            style={{
              width: widthPercentageToDP(40),
              borderRadius: widthPercentageToDP(40),
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              width: '90%',
              margin: 'auto',
              alignSelf: 'center',
              position: 'absolute',
              top: heightPercentageToDP(95),
            }}>
            <Text style={{
              color: "white",
              fontSize: responsiveFontSize(2.2),
              textTransform: 'capitalize',
              fontFamily: 'Oswald-Regular',
              letterSpacing: 0.7,
              top: 5
            }}>Add New </Text>

          </View>
          <AddTaskDialog
            visible={this.state.AddTaskVisible}
            addTo={1}
            selectedTask={selectedTask}
            onClose={(t, tD) => {
              console.log('task:' + t + ',TaskDescription :' + tD);
              this.setState({
                AddTaskVisible: false,
              });
              if (t != undefined && tD != undefined && (t != '' && tD != '')) {
                if (selectedTask == null) {
                  task = t;
                  taskDescription = tD;
                  this.saveTask();
                } else {
                  selectedTask.task = t;
                  selectedTask.taskDescription = tD;
                  this.updateTask(selectedTask, false, false);
                }
              }
            }}
          />
        </ImageBackground>
      </View>
    );
  }
}
