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
import {heightPercentageToDP, PixelToDP, responsiveFontSize, widthPercentageToDP} from './PixelRatio';


export class AboutOne extends PureComponent {
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
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate(this.props.navigation.getParam('comeFrom'))} style={styles.backTouch}>
                            <Image style={styles.backImageIcon} resizeMode={'stretch'} source={require('./Images/back.png')}/>
                            <Text style={styles.backLogo}>CC</Text>
                        </TouchableOpacity>
                        <Text style={styles.titleText}>ABOUT</Text>
                        <TouchableOpacity style={{
                            // height:'100%',
                            width:widthPercentageToDP(20),
                            marginLeft:widthPercentageToDP(10)
                            // position:'absolute',
                            // right:PixelToDP(10),

                        }}onPress={()=> this.props.navigation.navigate("AboutTwo")}>
                            <Text style={{
                                textTransform:'uppercase',
                                // fontSize:PixelToDP(16),
                                fontSize:responsiveFontSize(2),
                                color:'white',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                // height:'100%',
                            }}>Next</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    <Text style={styles.about}>
                        Conscientiousness refers to the ability to be orderly and dependable so that you can follow through on what you want for yourself and for others.
                    </Text>
                </ImageBackground>
            </View>
        );
    }
}
