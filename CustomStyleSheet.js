import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  PixelRatio,
  PixelToDP, responsiveFontSize,
  widthPercentageToDP,
} from './PixelRatio';
// import { BtnTxtColor, viewColor, labelColor } from "./CustomColor";

export const styles = StyleSheet.create({
  flexScreen: {
    flex: 1,
    width: widthPercentageToDP(100)
  },
  titlebar: {
    height: responsiveFontSize(9),
    width: widthPercentageToDP(100),
    backgroundColor: '#22DCD3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? PixelToDP(30) : 0
  },

  titleRightButton: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backLogo: {
    color: 'white',
    fontFamily: "Oswald-Regular",
    fontSize: responsiveFontSize(2),
    marginLeft: PixelToDP(3),
    width: widthPercentageToDP(30),
  },
  backImageIcon: {
    width: PixelToDP(8),
    height: PixelToDP(15),
    alignSelf: 'center'
  },
  backTouch: {
    flexDirection: 'row',
    width: '27%',
    marginLeft: widthPercentageToDP(3)
  },
  titleText: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: "Oswald-Regular",
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '40%',
    alignSelf: 'center',
  },
  aboutBack: {
    textTransform: 'uppercase',
    fontSize: responsiveFontSize(2),
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: PixelToDP(2)
  },
  titleRightView: {
    width: widthPercentageToDP(20),
    height: PixelToDP(30),
    position: 'absolute',
    right: PixelToDP(10),
  },
  settingHeading: {
    color: 'white',
    fontSize: responsiveFontSize(2.4),
    fontFamily: "Oswald-Regular",
    fontWeight: 'bold',
    lineHeight: PixelToDP(25),
    textTransform: 'uppercase',
  },
  settingText: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    lineHeight: PixelToDP(30),
    textAlignVertical: 'center',
    textTransform: "capitalize"
  },
  settingText2: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    // height: PixelToDP(60),
    width: '70%',
    marginBottom: PixelToDP(20),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: "#3a9f9a",
    alignSelf: "center"
  },

  OswaldFont: {
    fontFamily: "Oswald-Regular",
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: widthPercentageToDP(90),
    height: '100%',
    alignSelf: 'center',
    borderRadius: PixelToDP(30),
  },
  taskImageGreen: {
    tintColor: '#30B3AB',
  },
  taskImageBorderWhite: {
    height: PixelToDP(45),
    width: PixelToDP(45),
    marginTop: PixelToDP(10),
    borderRadius: PixelToDP(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  taskImageWhite: {
    tintColor: 'white',
  },
  goalIconBorder: {
    height: PixelToDP(55),
    width: PixelToDP(55),
    marginTop: PixelToDP(10),
    borderRadius: PixelToDP(55),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: PixelToDP(1),
  },

  taskImageBorderGreen: {
    height: responsiveFontSize(5.2),
    width: responsiveFontSize(5.2),
    marginTop: PixelToDP(5),
    marginBottom: PixelToDP(5),
    borderRadius: PixelToDP(35),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: PixelToDP(1),
    borderColor: '#30B3AB',
  },
  taskImageBorderToDoWhite: {
    height: responsiveFontSize(5),
    width: responsiveFontSize(5),
    marginTop: PixelToDP(5),
    marginBottom: PixelToDP(5),
    borderRadius: PixelToDP(35),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: PixelToDP(1),
    borderColor: '#ffffff',
  },
  addTaskTextInput: {
    width: '90%',
    alignSelf: 'center',
    height: PixelToDP(41),
    borderRadius: PixelToDP(20),
    marginBottom: PixelToDP(20),
    borderColor: '#C4C4C4',
    borderWidth: PixelToDP(1),
    textAlign: 'center',
    padding: PixelToDP(10),
    fontFamily: "Oswald-Regular",
    fontSize: responsiveFontSize(1.5)
  },
  addTaskDescTextInput: {
    width: '90%',
    alignSelf: 'center',
    height: PixelToDP(130),
    borderRadius: PixelToDP(16),
    marginBottom: PixelToDP(20),
    borderColor: '#C4C4C4',
    borderWidth: PixelToDP(1),
    padding: PixelToDP(10),
    fontSize: PixelToDP(12),
    fontFamily: "Oswald-Regular",
    textAlign: 'left',
  },
  addTaskDescTextInputGoal: {
    width: '98%',
    borderRadius: PixelToDP(0),
    marginBottom: PixelToDP(20),
    marginTop: PixelToDP(20),
    padding: PixelToDP(10),
    fontSize: PixelToDP(12),
    fontFamily: "Oswald-Regular",
    textAlign: 'left',
    color: "white",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: 'top',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    height: heightPercentageToDP(25),
    borderColor: "#fff"
  },
  addTaskDescTextInputGoalTask: {
    width: '98%',
    borderRadius: PixelToDP(0),
    marginBottom: PixelToDP(10),
    marginTop: PixelToDP(10),
    padding: PixelToDP(10),
    fontSize: PixelToDP(12),
    fontFamily: "Oswald-Regular",
    textAlign: 'left',
    color: "white",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: 'top',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    height: heightPercentageToDP(20),
    borderColor: "#fff"
  },
  taskStatusView: {
    backgroundColor: "#4bc9c1",
    width: widthPercentageToDP(26),
    borderRadius: PixelToDP(10),
    borderColor: '#30B3AB',
    alignItems: 'center',
    justifyContent: "space-between",
    padding: PixelToDP(5),
    marginLeft: 6,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#121010',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 10,
    borderWidth: PixelToDP(2),

  },
  taskStatusText: {
    alignSelf: 'center',
    fontSize: PixelToDP(16),
    textAlign: 'center',
    fontFamily: "Oswald-Regular",
    color:"#fff",
   

  },
  
  taskStatusViewActive: {
    width: widthPercentageToDP(26),
    borderRadius: PixelToDP(10),
    borderColor: '#30B3AB',
    borderWidth: PixelToDP(2),
    alignItems: 'center',
    justifyContent: "space-between",
    padding: PixelToDP(5),
    marginLeft: 6,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#121010',
    backgroundColor:"#35928d",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 10,
    
  },
  taskStatusViewActive2: {
    width: widthPercentageToDP(26),
    borderRadius: PixelToDP(10),
    borderColor: '#30B3AB',
    borderWidth: PixelToDP(2),
    alignItems: 'center',
    justifyContent: "space-between",
    padding: PixelToDP(5),
    marginLeft: 6,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#121010',
    backgroundColor:"#35928d",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
    height: 70,
    paddingBottom:15
  },
  taskStatusView2: {
    paddingBottom:15,
    backgroundColor: "#4bc9c1",
    width: widthPercentageToDP(26),
    borderRadius: PixelToDP(10),
    borderColor: '#30B3AB',
    alignItems: 'center',
    justifyContent: "space-between",
    padding: PixelToDP(5),
    marginLeft: 6,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#121010',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: PixelToDP(2),
    height: 70,
  },
 
  AddIcon: {
    height: PixelToDP(53),
    width: PixelToDP(53),
    marginTop: PixelToDP(9),
    borderRadius: PixelToDP(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: PixelToDP(3),
    borderColor: '#30B3AB',
    marginLeft: '2%',
    marginRight: '2%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.84,
    elevation: 6,
    backgroundColor: "white"
  },
  AddIconActive: {
    height: PixelToDP(53),
    width: PixelToDP(53),
    marginTop: PixelToDP(9),
    borderRadius: PixelToDP(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: PixelToDP(2),
    borderColor: 'white',
    marginLeft: '2%',
    marginRight: '2%',
    backgroundColor: '#3a9f9a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.84,
    elevation: 6,
  },
  about: {
    fontSize: responsiveFontSize(2),
    color: 'white',
    lineHeight: PixelToDP(18),
    marginTop: PixelToDP(20),
    width: widthPercentageToDP(90),
    alignSelf: 'center',
    fontFamily: "Oswald-Regular",
    textAlign: 'justify'
  },
  taskCompleted: {
    backgroundColor: '#2BCB4E',
    borderRadius: PixelToDP(30),
    width: responsiveFontSize(4),
    height: responsiveFontSize(4),
    justifyContent: 'center',
    alignSelf: 'center'
  },
  taskInCompleted: {
    borderRadius: PixelToDP(30),
    width: responsiveFontSize(4),
    height: responsiveFontSize(4),
    borderColor: 'black',
    borderWidth: PixelToDP(1),
    justifyContent: 'center',
    alignSelf: 'center'
  },
  dailyRemainderDay: {
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: PixelToDP(2),
    marginLeft: PixelToDP(2),
    width: responsiveFontSize(5),
    height: responsiveFontSize(5),
    borderRadius: responsiveFontSize(5)
  },
  dailyRemainderDayActive: {
    borderColor: 'white',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderWidth: PixelToDP(2),
    marginLeft: PixelToDP(2),
    width: responsiveFontSize(5),
    height: responsiveFontSize(5),
    borderRadius: responsiveFontSize(5)
  },
  dailyRemainderTextDay: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: "Oswald-Regular"
  },
  dailyRemainderTextDayActive: {
    color: '#30B3AB',
    fontSize: responsiveFontSize(2),
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: "Oswald-Regular"
  },
  customImage: {
    alignSelf: 'center',
    width: responsiveFontSize(4),
    height: responsiveFontSize(4)

  },
  nonCustomImage: {
    tintColor: '#22DCD3',
    alignSelf: 'center',
    width: responsiveFontSize(3.6),
    height: responsiveFontSize(3.6)
  },
  nonCustomTODoImage: {
    tintColor: '#ffffff',
    alignSelf: 'center',
    width: responsiveFontSize(2.5),
    height: responsiveFontSize(2.5)
  },
  nonCustomHomeImage: {
    tintColor: '#22DCD3',
    alignSelf: 'center',
    width: responsiveFontSize(4),
    height: responsiveFontSize(4)
  },
  customHomeImage: {
    borderRadius: PixelToDP(200),
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    margin: PixelToDP(10)
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardStyleforCode: {
    width: PixelToDP(38),
    height: PixelToDP(38),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: PixelToDP(20),
  },
  enterCodeKeyImage: {
    width: PixelToDP(38),
    height: PixelToDP(38),
    borderRadius: PixelToDP(25),
    borderColor: '#3FB5AB',
    borderWidth: PixelToDP(5)
  },
  enterCodeLogoBackground: {
    width: widthPercentageToDP(35),
    height: widthPercentageToDP(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#60C8C1',
    // elevation:PixelToDP(20),
    borderRadius: widthPercentageToDP(20),
    alignSelf: 'center',
  }
});
