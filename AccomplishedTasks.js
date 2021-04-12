import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ImageBackground,
    Alert
} from "react-native";
import { Icon, Text } from 'native-base';
import { styles } from "./CustomStyleSheet";
import { heightPercentageToDP, PixelToDP, widthPercentageToDP } from "./PixelRatio";
import SQLdatabase from './SQLdatabase';
import { Progress, Priority } from './InsertInToDatabase';
const db = new SQLdatabase();
var logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAiCAYAAACnSgJKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIQSURBVHgBtVftccIwDFV6/V9G8AbNCOkG3QA2gE4AG5QNaCegnQA2gE5gNgidQJVqpxhFTk2cvDudkyD7WbI+TAEZQMQJDVOSkuRMciyK4h3GBJOSvKIOS2JgDNDCFUmN3bDeK4MSLyNEa5I3sakFDAWFuJYE9D4jOfjfNzAEFGJLUip6ZUC+g1zQInNMDCh08WC93hpywCSpxF5/SbL1us/QF+jSyQryMmEOk1vIAbbzOCl6/Yan0Bf+7EIknR+7mmQFORDu5uekguGDs39xQZerIZJdiLlVTVi9hRFxL4hnNJjg0wtkAi+dz5Dw817tfMLqrPKIl86nNaHD1REpZ22gJ9CVWYvdWIUT7BBWo6uK0lp+5863Qln7sZ3XFfSAJ7ZirYXilV1IvgmUe5dGsQ5jFtGb/3lX7LZXaURX3fQzbetyfJnGDSEM3Ai/Ri3O2KRMnOW4XCFGTAzYO3DX3gZfcAPQtVgOHFlWP1PmM/lj8H6ERHQQM06KPsfERJJ3TooQTwUxzzsHKpNAt/JpxX2ikgsd/ksNoa/e6dDlrvxea7oQWK7uWCH9rdX0GF4sTiRP1Ch4lM3CKOudrr6hu+w32EWIw1upaoXXW6GOHWr1A9sNpZTWRhYzEPdQ5YXTMH7B8Mq1sGiD7TNskHcfT7A+5roKxgDGz6v1n2woFGIDhgYmeiD5JvmgSN7DSPgBqqqp0csGMeQAAAAASUVORK5CYII=';
export class AccomplishedTasks extends PureComponent {
    static navigationOptions = {
        header: null
    }
    componentDidMount(): void {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getTasks();
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            isTaskStartDateSelected: false,
            accomplishedTask: []
        }
    }
    getTasks = () => {
        console.log("To Do getTasks method is executed");
        let accomplishedTask = []
        db.getTask().then((task) => {
            // db.getProgress().then((progress)=>{
            //     db.getPriority().then((priority)=>{
            db.getGoals().then((goals) => {
                db.getTaskIcon().then((taskIcon) => {
                    this.setState({
                        // progress,
                        goals,
                        // priority,
                        taskIcon
                    });
                    // console.log("To Do: task"+ task)
                    task.forEach(t => {
                        // console.log(",goals[t.refGoal]:"+ goals[(t.refGoal -1)].refTaskIcon)
                        // console.log(",taskIcon[goals[t.refGoal].refTaskIcon].icon :"+ taskIcon[goals[(t.refGoal-1)].refTaskIcon].icon)
                        if ((t.refAddTo == 1 || t.refAddTo == 3) &&
                            t.refProgress == 3 &&
                            ((t.refGoal && goals.find(g => g.Id == t.refGoal).isActive &&
                                goals.find(g => g.Id == t.refGoal).isCompleted == 0) ||
                                t.refGoal == null)) {
                            accomplishedTask.push({
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
                                Progress: Progress.find(pr => pr.Id == t.refProgress && pr.isActive == 1).image,
                                Priority: Priority.find(pri => pri.Id == t.refPriority && pri.isActive == 1).color,
                                goalIcon: (t.refGoal) ? taskIcon.find(ti => ti.Id == goals.find(g => g.Id == t.refGoal && g.isActive == 1).refTaskIcon && ti.isActive == 1).icon : logo,
                                isActive: t.isActive
                                // (taskIcon[(goals[(t.refGoal -1)].refTaskIcon -1)].icon):logo,
                            });
                            console.log("Accomplished Task:", accomplishedTask)

                        }
                    })
                    console.log("Accomplished Task: outer loop", accomplishedTask)
                    this.setState({
                        accomplishedTask
                    })
                    // this.forceUpdate();
                })
            })

            //     })
            // })


        });
    }

    updateTask = (selectedTask, isUndo) => {
        let data = selectedTask;
        if (isUndo) {
            data.refProgress = 1;
        }
        console.log("ToDo data for update: ", data);
        db.updateTasks(data.Id, data).then((result) =>
            this.getTasks()
        )
    }
    render() {
        return (
            <View style={styles.flexScreen}>
                <ImageBackground
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    source={require('./Images/gradient.png')}
                    resizeMode={"stretch"}
                >
                    <SafeAreaView style={[styles.titlebar, {
                        borderBottomWidth: 4,
                        borderBottomColor: "#FFF",
                        paddingBottom: 25
                    }]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ToDo")}
                            style={[styles.backTouch, {
                                width: '17%'
                            }]}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')} />
                            <Text style={[styles.backLogo, { fontSize: PixelToDP(16) }]}>To-Do</Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleText, {
                            width: '60%'
                        }]}>Accomplished Tasks</Text>
                        <View style={styles.titleRightView} />
                    </SafeAreaView>

                    < View style={{
                        width: widthPercentageToDP(90),
                        alignSelf: 'center'
                    }}>
                        <FlatList
                            data={this.state.accomplishedTask}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    height: PixelToDP(55),
                                    shadowColor: '#121010',
                                    backgroundColor: "#fff",
                                    borderColor: '#58c3be',
                                    textAlign: 'center',
                                    borderWidth: PixelToDP(3),
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    paddingLeft: 5,
                                    marginTop: 15,
                                    marginBottom: 10
                                }}

                                >
                                    <View style={[styles.taskImageBorderToDoWhite, { backgroundColor: '#58c3be' }]}>
                                        <Image style={[item.customImg == 1 ? styles.customImage : styles.nonCustomTODoImage, {
                                        }]}
                                            resizeMode={'contain'}
                                            source={{ uri: item.goalIcon }} />
                                    </View>
                                    <Text style={[styles.settingText, { marginLeft: PixelToDP(10),color: '#4bc9c1' }]}>{item.task}</Text>
                                    <TouchableOpacity style={{
                                        backgroundColor: '#2BCB4E',
                                        height: PixelToDP(25),
                                        width: PixelToDP(25),
                                        borderRadius: PixelToDP(25),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        right: PixelToDP(10),
                                        bottom: PixelToDP(10)
                                    }}
                                        onPress={() => {
                                            Alert.alert(" Alert",
                                                "Are you sure you want to undo this task?",
                                                [{ text: 'OK', onPress: () => this.updateTask(item, true) }, {
                                                    text: 'Cancel',
                                                    onPress: () => console.log('Cancel Pressed'),
                                                    style: 'cancel',
                                                },]);
                                        }}
                                    >
                                        <Icon
                                            name="check"
                                            type="Feather"
                                            style={{
                                                fontSize: PixelToDP(15),
                                                color: "white",
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            } />
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
