import {Dimensions, PixelRatio} from 'react-native';
const widthPercentageToDP = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const heightPercentageToDP = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
const PixelToDP = heightPixel => {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  // const dimension =Dimensions.get('window');
  // console.log("dimension :",dimension);
  // Convert string input to decimal number
  //const elemHeight =
  // return screenWidth/PixelRatio.get();
  return PixelRatio.getPixelSizeForLayoutSize(
    (heightPixel * (screenHeight / PixelRatio.get())) / 640,
  );
  // return PixelRatio.getPixelSizeForLayoutSize(
  //     (heightPixel * ((screenHeight * screenWidth) / PixelRatio.get())) / 240*320,
  // );
};

 const responsiveFontSize = f => {
  const {height,width} = Dimensions.get('window');
  return  parseInt(Math.sqrt(height * height + width * width) * (f / 100));
}

export {widthPercentageToDP, heightPercentageToDP, PixelToDP, responsiveFontSize};
