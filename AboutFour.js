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
import {Text, Button} from 'native-base';
import {styles} from "./CustomStyleSheet";
import {heightPercentageToDP, PixelToDP, widthPercentageToDP} from './PixelRatio';

export class AboutFour extends PureComponent {
    static navigationOptions = {
        header: null
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
                        borderBottomColor: 'white',
                        borderBottomWidth: 4,
                        paddingBottom: 5,
                        paddingTop: 5,
                        marginBottom: 6,
                    }]}>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate("AboutThree")} style={styles.backTouch}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')}/>
                            <Text style={styles.aboutBack}>About</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleText}>ABOUT</Text>
                    </SafeAreaView>
                    <Text style={styles.about}>
                        This app allows you to build a plan for working towards your larger goals. Set tasks for yourself, arrange them, build daily To-Do lists, fill in your calendar, and track your progress. You will receive notifications along the way to help you on your journey.
                    </Text>
                </ImageBackground>
            </View>
        );
    }
}
