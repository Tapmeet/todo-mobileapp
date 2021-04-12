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


export class AboutThree extends PureComponent {
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
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate("AboutTwo")} style={styles.backTouch}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')}/>
                            <Text style={styles.aboutBack}>About</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleText}>ABOUT</Text>
                        <TouchableOpacity style={{
                            // height:'100%',
                            // width:'auto',
                            // position:'absolute',
                            // right:PixelToDP(10)
                            width:widthPercentageToDP(20),
                            marginLeft:widthPercentageToDP(10)
                        }} onPress={()=> this.props.navigation.navigate("AboutFour")}
                        >
                            <Text style={{
                                textTransform:'uppercase',
                                fontSize:PixelToDP(16),
                                color:'white',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                // height:'100%',

                            }}>Next</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    <Text style={styles.about}>
                        When using the Conscientiousness Coach, please begin working on new goals which are larger ideas, like 'be more healthy' or 'improve work life'. Then, fill in each goal with tasks that you believe would help you achieve it, such as 'eat two fruits each day' or 'ask for air conditioning at work.
                    </Text>
                </ImageBackground>
            </View>
        );
    }
}
