import React, { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Modal,
    Alert,
    Image, FlatList, ImageBackground,
    ScrollView
} from 'react-native';
import { Text, Icon, Card, Button } from 'native-base';
import { styles } from "./CustomStyleSheet";
import { heightPercentageToDP, PixelToDP, widthPercentageToDP, responsiveFontSize } from "./PixelRatio";
import SQLdatabase from './SQLdatabase';
import { AddTaskDialog } from './AddTaskDialog';
import { Progress, Priority } from './InsertInToDatabase';

const db = new SQLdatabase();
export class StatusDialog extends PureComponent {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        props = {
            visible: false,
            // progressId:0,
            // priorityId:0,
            selectedTask: [],
            onClose: (data) => Void
        };
        this.state = {
            // isNotStarted:true,
            // isStarted:false,
            // isAccomplished:false,
            // isLowPriority:true,
            // isMediumPriority:false,
            // isHighPriority:false,
            AddTaskVisible: false,
            progress: [],
            priority: [],
            progressId: 1,
            priorityId: 1,
            visible: false,
            task: '',
            taskDescription: '',
            repeatNever: false
        }
        this.setTask = this.setTask.bind(this);
        this.setTask();
    }
    setTask = () => {
        console.log("refProgress :", this.props.selectedTask.refProgress);
        this.setState({
            progressId: this.props.selectedTask.refProgress,
            priorityId: this.props.selectedTask.refPriority,
            task: this.props.selectedTask.task,
            taskDescription: this.props.selectedTask.taskDescription,
            isActive: this.props.selectedTask.isActive,
        })
    }
    updateTask = (progress, priority, task, taskDes, repeatNever, isActive) => {
        const { selectedTask } = this.props;
        console.log("Progress :" + progress + "priority : " + priority)
        console.log("Progress :" + this.state.progressId + "priority : " + this.state.priorityId)
        let data = {
            Id: selectedTask.Id,
            task: task,
            taskDescription: taskDes,
            refGoal: selectedTask.refGoal,
            refAddTo: selectedTask.refAddTo,
            startDate: selectedTask.startDate,
            refTaskRepeat: repeatNever ? 1 : selectedTask.refTaskRepeat,
            refTaskRepeatEnd: selectedTask.refTaskRepeatEnd,
            endOnDate: selectedTask.endOnDate,
            refProgress: progress,
            orderIndex: selectedTask.orderIndex,
            refPriority: priority,
            isActive: isActive
        }
        this.props.onClose(data);
    }

    render() {
        const {
            isNotStarted,
            isStarted,
            isAccomplished,
            isLowPriority,
            isMediumPriority,
            isHighPriority,
            task
        } = this.state
        return (
            <Modal
                presentationStyle="overFullScreen"
                animationType="slide"
                onShow={this.setTask}
                // onSwipeComplete={() => this.props.onClose(this.state.progressId,this.state.priorityId,this.state.repeatNever,1)}
                // swipeDirection="left"
                visible={this.props.visible}
                onRequestClose={() => this.updateTask(this.state.progressId, this.state.priorityId, this.state.task, this.state.taskDescription, this.state.repeatNever, this.state.isActive)}
                transparent={true}
            >

                <Card style={[styles.modalBg, { paddingTop: 0 }]}>

                    <View
                        style={[styles.boxShadow, {
                            borderWidth: 6,
                            borderRadius: PixelToDP(20),
                            borderColor: "#4bcac2",
                            width: widthPercentageToDP(95),
                            alignSelf: 'center',
                            paddingTop: PixelToDP(0),
                            flexDirection: 'column',
                            alignItem: 'center',
                            height: '100%',
                            backgroundColor: "#fff"
                        }]}>
                        <ScrollView>
                            <View style={{
                                flexDirection: 'row',
                                width: widthPercentageToDP(80),
                                marginTop: PixelToDP(5),
                                alignSelf: 'center',

                            }}>
                                <Text style={{
                                    fontSize: responsiveFontSize(3),
                                    fontWeight: 'bold',
                                    // height: PixelToDP(60),
                                    width: '100%',
                                    marginBottom: PixelToDP(5),
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                    color: '#4bc9c1',
                                    alignSelf: "center"
                                }}>{this.state.task}</Text>
                            </View>
                            <View style={[styles.boxShadow, {
                                borderWidth: 6,
                                borderTopLeftRadius: PixelToDP(40),
                                borderBottomRightRadius: PixelToDP(40),
                                borderColor: "#3a9f9a",
                                width: widthPercentageToDP(85),
                                alignSelf: "center",
                                backgroundColor: "#22DCD3",
                                paddingLeft: 25,
                                paddingtop: 25,
                                paddingBottom: 35,
                                justifyContent: "flex-start",
                            }]}>
                                <Text style={{
                                    width: widthPercentageToDP(80),
                                    alignSelf: 'center',
                                    height: PixelToDP(70),
                                    marginTop: PixelToDP(15),
                                    fontSize: PixelToDP(16),
                                    color: "#fff"
                                }} multiline={true}>
                                    {this.state.taskDescription}
                                </Text>
                            </View>

                            <Text style={{
                                fontSize: responsiveFontSize(2.6),
                                fontWeight: 'bold',
                                // height: PixelToDP(60),
                                width: '100%',
                                marginBottom: PixelToDP(5),
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                color: '#4bc9c1',
                                alignSelf: "center",
                                marginTop: 15
                            }}>
                                Have you started?
                    </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                width: widthPercentageToDP(85),
                                justifyContent: 'space-between',
                                height: PixelToDP(125),
                                marginTop: PixelToDP(0),
                                zIndex: 99999

                            }}>
                                <FlatList
                                    horizontal={true}
                                    data={Progress}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                        <View style={{ justifyContent: "space-between", alignSelf: "center" }}>
                                            <Image style={{
                                                width: PixelToDP(45),
                                                height: PixelToDP(45),
                                                marginBottom: 10,
                                                alignSelf: "center",
                                                zIndex: 99
                                            }} source={{ uri: item.image }} />
                                            <TouchableOpacity
                                                style={(this.state.progressId == item.Id) ? styles.taskStatusViewActive : styles.taskStatusView}
                                                onPress={() => {
                                                    console.log("progressId: " + this.state.progressId)
                                                    this.setState({ progressId: item.Id })
                                                    console.log("progressId: " + this.state.progressId)
                                                    // this.updateTask(this.state.progressId,this.state.priorityId,this.state.task,this.state.taskDescription,this.state.repeatNever,0)
                                                }}>

                                                <Text style={styles.taskStatusText}>{item.title}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    } />
                            </View>
                            <Text style={{
                                fontSize: responsiveFontSize(2.6),
                                fontWeight: 'bold',
                                // height: PixelToDP(60),
                                width: '100%',
                                marginBottom: PixelToDP(5),
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                color: '#4bc9c1',
                                alignSelf: "center",
                                marginTop: 5
                            }}>
                                How are you doing with this task?
                    </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                width: widthPercentageToDP(85),
                                justifyContent: 'space-between',
                                height: PixelToDP(135),
                                marginTop: PixelToDP(5)
                            }}>
                                <FlatList
                                    horizontal={true}
                                    data={Priority}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                        <View style={{ justifyContent: "space-between", alignSelf: "center" }}>
                                            <Image style={{
                                                width: PixelToDP(45),
                                                height: PixelToDP(45),
                                                marginBottom: 10,
                                                alignSelf: "center"
                                            }} source={{ uri: item.image }} />
                                            <TouchableOpacity
                                                style={(this.state.priorityId == item.Id) ? styles.taskStatusViewActive2 : styles.taskStatusView2}
                                                onPress={() => {
                                                    this.setState({ priorityId: item.Id })
                                                    // this.updateTask(this.state.progressId,this.state.priorityId,this.state.task,this.state.taskDescription,this.state.repeatNever,0)
                                                }}
                                            >

                                                <Text style={styles.taskStatusText}>{item.title}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    } />
                            </View>
                            <AddTaskDialog
                                visible={this.state.AddTaskVisible}
                                addTo={this.props.selectedTask.refAddTo}
                                selectedTask={this.props.selectedTask}
                                onClose={(t, tD) => {
                                    console.log("task:" + t + ",TaskDescription :" + tD);
                                    if (t != "" && tD != "")
                                        this.setState({
                                            AddTaskVisible: false,
                                            task: t,
                                            taskDescription: tD,
                                        });
                                    // task= t;
                                    // taskDescription=tD;
                                    // console.log("taskS:"+this.state.task+",TaskDescriptionS :"+this.state.taskDescription);
                                }}
                            />
                            {/*</View>*/}



                        </ScrollView>
                        <View
                            style={[styles.buttonsFooter,
                            {
                                backgroundColor: '#dddddd',
                                top: heightPercentageToDP(76),

                            }]}>
                            <TouchableOpacity
                                style={{
                                    height: 'auto',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.updateTask(this.state.progressId, this.state.priorityId, this.state.task, this.state.taskDescription, this.state.repeatNever, 1)
                                }}
                            >
                                <Image
                                    style={{
                                        alignSelf: 'center',
                                        height: heightPercentageToDP(9),
                                        width: heightPercentageToDP(9),
                                    }}
                                    resizeMode={'contain'}
                                    source={require('./Images/back-icon.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: 'auto',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        AddTaskVisible: true
                                    })
                                }}
                            >
                                <Image
                                    style={{
                                        alignSelf: 'center',
                                        height: heightPercentageToDP(10.5),
                                        width: heightPercentageToDP(10.5),
                                    }}
                                    resizeMode={'contain'}
                                    source={require('./Images/edit.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: 'auto',
                                    alignItems: 'center',
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
                                            { text: 'OK', onPress: () => this.updateTask(this.state.progressId, this.state.priorityId, this.state.task, this.state.taskDescription, this.state.repeatNever, 0) },
                                        ],
                                        { cancelable: false },
                                    );

                                }}>
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
                            style={[styles.buttonsFooterText, {
                                top: heightPercentageToDP(93.5),
                            }]}>
                            <Text style={[styles.buttonsFooterTextTitle, { color: '#4bc9c1', }]}>Back </Text>
                            <Text style={[styles.buttonsFooterTextTitle, {
                                top: 5,
                                color: '#4bc9c1'
                            }]}> Edit Goal</Text>
                            <Text style={[styles.buttonsFooterTextTitle, { color: '#4bc9c1', }]}>Delete</Text>
                        </View>
                    </View>
                </Card>
            </Modal >
        );
    }
}
