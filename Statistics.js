//https://github.com/oblador/react-native-progress
import React, { PureComponent } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ImageBackground,
    ScrollView
} from "react-native";
import { Text, Button } from 'native-base';
import { styles } from "./CustomStyleSheet";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP } from './PixelRatio';
// import * as Progress from 'react-native-progress';
import SQLdatabase from './SQLdatabase';
// import {Svg} from 'expo';
// const {
//     Circle} = Svg
const db = new SQLdatabase();
export class Statistics extends PureComponent {
    static navigationOptions = {
        header: null
    }
    componentDidMount() {
        this.setState({
            percentage: 50
        })
    }
    // animate() {
    //     let percentage = 0;
    //     this.setState({ percentage });
    //     setTimeout(() => {
    //         this.setState({ indeterminate: false });
    //         setInterval(() => {
    //             percentage += Math.random() / 5;
    //             if (percentage > 1) {
    //                 percentage = 1;
    //             }
    //             this.setState({ percentage });
    //         }, 500);
    //     }, 1500);
    // }
    constructor(props) {
        super(props);
        this.state = {
            percentage: 0,
            activeGoal: [],
            completeGoal: [],
            taskComplete: [
                { Id: "1", task: 'yoga', taskCompleted: '70', taskIcon: require('./Images/yoga.png') },
                { Id: "2", task: 'Yoga', taskCompleted: '50', taskIcon: require('./Images/yoga.png') },
                { Id: "3", task: 'Take Tea', taskCompleted: '40', taskIcon: require('./Images/yoga.png') },
            ]
        }
        this.getGoal = this.getGoal.bind(this);
        this.getGoal();
    }
    getGoal = () => {
        let activeGoal = [], completeGoal = []
        console.log("Statistics.js : getGoal method is executed")
        db.getGoals().then((goals) => {
            db.getTaskIcon().then((taskicon) => {
                goals.forEach(g => {
                    if (g.isActive == 1)
                        if (g.isCompleted == 0 && g.accomplishedPercentage < 100)
                            activeGoal.push({
                                id: g.Id,
                                goalTitle: g.goal,
                                refIcon: g.refTaskIcon,
                                Icon: taskicon.find(t => t.Id == g.refTaskIcon && t.isActive == 1).icon,
                                customImg: taskicon.find(t => t.Id == g.refTaskIcon && t.isActive == 1).customImage,
                                isComplete: g.isCompleted,
                                accomplishedPercent: g.accomplishedPercentage,
                                isactive: g.isActive
                            })
                        else
                            completeGoal.push({
                                id: g.Id,
                                goalTitle: g.goal,
                                refIcon: g.refTaskIcon,
                                Icon: taskicon.find(t => t.Id == g.refTaskIcon && t.isActive == 1).icon,
                                customImg: taskicon.find(t => t.Id == g.refTaskIcon && t.isActive == 1).customImage,
                                accomplishedPercent: g.accomplishedPercentage,
                                isactive: g.isActive
                            })
                })
                this.setState({
                    activeGoal,
                    completeGoal
                })
                console.log("activeGoal :", activeGoal);
                console.log("complete Goal :", completeGoal)
            })
        })
    }
    onDayPress(day) {
        this.setState({
            selected: day.dateString
        });
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
                    <SafeAreaView style={styles.titlebar}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")} style={styles.backTouch}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')} />
                            <Text style={styles.backLogo}>CC</Text>
                        </TouchableOpacity>
                        <Text style={[styles.titleText, { textTransform: 'uppercase' }]}>Statistics</Text>
                        <View style={styles.titleRightView} />
                    </SafeAreaView>
                    <ScrollView style={{
                        width: '100%',
                        height: 'auto'
                    }}>
                        <Text style={{
                            color: 'white',
                            // fontSize:PixelToDP(18),
                            fontSize: responsiveFontSize(2.4),
                            width: widthPercentageToDP(90),
                            height: PixelToDP(50),
                            textAlignVertical: 'center',
                            alignSelf: 'center',
                            // marginTop:PixelToDP(10),
                            marginTop: responsiveFontSize(3),
                            fontWeight: 'bold',
                            fontFamily: "Oswald-Regular"
                        }}>Active Goals</Text>
                        {(this.state.activeGoal.length > 0) && (
                            <View style={{
                                width: widthPercentageToDP(90),
                                alignSelf: 'center',
                                height: 'auto',
                            }}>
                                <FlatList
                                    numColumns={2}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    data={this.state.activeGoal}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity style={{
                                            width: widthPercentageToDP(45),
                                            marginTop: PixelToDP(15),
                                            height: heightPercentageToDP(25),
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                            onPress={() => this.props.navigation.navigate('CreateGoal', {
                                                goalId: item.id,
                                                TaskIconId: item.refIcon,
                                                goalTitle: item.goalTitle,
                                                accomplishedPercent: item.accomplishedPercent,
                                                goalIcon: item.Icon,
                                                goalCustomIcon: item.customImg
                                            })}
                                        >
                                            {/*<Progress.Circle formatText={() => {*/}
                                            {/*    return `${item.accomplishedPercent}%`*/}
                                            {/*}}*/}
                                            {/*                 thickness={PixelToDP(10)}*/}
                                            {/*                 color={'white'}*/}
                                            {/*                 unfilledColor={'#325859'}*/}
                                            {/*                 showsText={true}*/}
                                            {/*                 size={PixelToDP(120)}*/}
                                            {/*                 progress={item.accomplishedPercent / 100}>*/}
                                            {/*</Progress.Circle>*/}

                                            <AnimatedCircularProgress
                                                size={PixelToDP(125)}
                                                // size={widthPercentageToDP(40)}
                                                width={PixelToDP(10)}
                                                fill={item.accomplishedPercent}
                                                tintColor="#ffffff"
                                                backgroundColor="#325859">
                                                {
                                                    (fill) => (
                                                        <Text style={{ color: 'white' }}>
                                                            { item.accomplishedPercent} %
                                                        </Text>
                                                    )
                                                }
                                            </AnimatedCircularProgress>
                                            <View style={[
                                                styles.taskImageBorderWhite,
                                                {
                                                    marginTop: PixelToDP(-60),
                                                    marginLeft: PixelToDP(70)
                                                    // marginTop:widthPercentageToDP(-20),
                                                    // marginLeft:widthPercentageToDP(25)
                                                }]
                                            }>
                                                {item.customImg ?
                                                    <Image style={{
                                                        width: PixelToDP(20),
                                                        height: PixelToDP(20)
                                                    }}
                                                        resizeMode={'contain'}
                                                        overlayColor={'white'}
                                                        source={{ uri: item.Icon }} />
                                                    :
                                                    <Image
                                                        style={[styles.taskImageGreen,
                                                        {
                                                            width: PixelToDP(20),
                                                            height: PixelToDP(20)
                                                        }]
                                                        }
                                                        resizeMode={'contain'}
                                                        overlayColor={'white'}
                                                        source={{ uri: item.Icon }} />
                                                }
                                            </View>
                                            <Text style={{
                                                //fontSize:PixelToDP(15),
                                                fontSize: responsiveFontSize(2),
                                                width: PixelToDP(120),
                                                color: 'white',
                                                textAlign: 'center',
                                                textAlignVertical: 'top'
                                            }}>{item.goalTitle}</Text>
                                        </TouchableOpacity>
                                    } />
                            </View>
                        )}

                        <Text style={{
                            color: 'white',
                            // fontSize:PixelToDP(18),
                            fontSize: responsiveFontSize(2.4),
                            width: widthPercentageToDP(90),
                            height: PixelToDP(50),
                            textAlignVertical: 'center',
                            alignSelf: 'center',
                            marginTop: responsiveFontSize(3),
                            // marginTop:PixelToDP(20),
                            fontWeight: 'bold',
                            fontFamily: "Oswald-Regular"
                        }}>Completed Goals</Text>
                        {(this.state.completeGoal.length > 0) && (
                            <View style={{
                                width: widthPercentageToDP(90),
                                alignSelf: 'center',
                                height: 'auto',
                            }}>
                                <FlatList
                                    numColumns={2}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    data={this.state.completeGoal}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) =>
                                        <TouchableOpacity style={{
                                            width: widthPercentageToDP(45),
                                            marginTop: PixelToDP(25),
                                            height: heightPercentageToDP(25),
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }} onPress={() => this.props.navigation.navigate('CreateGoal', {
                                            goalId: item.id,
                                            TaskIconId: item.refIcon,
                                            goalTitle: item.goalTitle,
                                            accomplishedPercent: item.accomplishedPercent,
                                            goalIcon: item.Icon,
                                            goalCustomIcon: item.customImg
                                        })}>
                                            {/*<Progress.Circle formatText={() => {*/}
                                            {/*    return `${item.accomplishedPercent}%`*/}
                                            {/*}}*/}
                                            {/*                 thickness={PixelToDP(10)}*/}
                                            {/*                 color={'white'}*/}
                                            {/*                 unfilledColor={'#325859'}*/}
                                            {/*                 showsText={true}*/}
                                            {/*                 size={PixelToDP(120)}*/}
                                            {/*                 progress={item.accomplishedPercent/100}>*/}
                                            {/*</Progress.Circle>*/}

                                            <AnimatedCircularProgress
                                                size={PixelToDP(125)}
                                                // size={widthPercentageToDP(40)}
                                                width={PixelToDP(10)}
                                                fill={item.accomplishedPercent}
                                                tintColor="#ffffff"
                                                backgroundColor="#325859">
                                                {
                                                    (fill) => (
                                                        <Text style={{ color: 'white' }}>
                                                            { item.accomplishedPercent} %
                                                        </Text>
                                                    )
                                                }
                                            </AnimatedCircularProgress>
                                            <View style={[
                                                styles.taskImageBorderWhite,
                                                {
                                                    marginTop: PixelToDP(-60),
                                                    marginLeft: PixelToDP(70)
                                                }]
                                            }>

                                                {item.customImg ?
                                                    <Image
                                                        style={{
                                                            width: PixelToDP(20),
                                                            height: PixelToDP(20)
                                                        }}
                                                        resizeMode={'contain'}
                                                        // overlayColor={'white'}
                                                        source={{ uri: item.Icon }} />
                                                    :
                                                    <Image
                                                        style={[styles.taskImageGreen,
                                                        {
                                                            width: PixelToDP(20),
                                                            height: PixelToDP(20)
                                                        }]
                                                        }
                                                        resizeMode={'contain'}
                                                        overlayColor={'white'}
                                                        source={{ uri: item.Icon }} />
                                                }
                                            </View>
                                            <Text style={{
                                                // fontSize:PixelToDP(15),
                                                fontSize: responsiveFontSize(2),
                                                width: PixelToDP(120),
                                                color: 'white',
                                                textAlign: 'center',
                                                textAlignVertical: 'top'
                                            }}>{item.goalTitle}</Text>
                                        </TouchableOpacity>
                                    } />
                            </View>
                        )}
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}
