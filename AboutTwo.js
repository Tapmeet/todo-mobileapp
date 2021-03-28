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


export class AboutTwo extends PureComponent {
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
                    <SafeAreaView style={styles.titlebar
                    }>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate("AboutOne")} style={styles.backTouch}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')}/>
                            <Text style={styles.aboutBack}>About</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleText}>ABOUT</Text>
                        <TouchableOpacity style={{
                            // height:'100%',
                            // width:'auto',
                            width:widthPercentageToDP(20),
                            marginLeft:widthPercentageToDP(10)
                            // position:'absolute',
                            // right:PixelToDP(10)
                        }} onPress={()=> this.props.navigation.navigate("AboutThree")}
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
                        With the Conscientiousness Coach, we hope to help you consider your goals, what you wish you could do better, and how to turn that wish into reality, step by step.
                    </Text>
                </ImageBackground>
            </View>
        );
    }
}
