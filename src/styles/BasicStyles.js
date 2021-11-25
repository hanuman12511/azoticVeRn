import {StyleSheet} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const basicStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  goldColor: {
    color: '#db9058',
  },

  greenColor: {
    color: '#318956',
  },

  purpleColor: {
    color: '#853a77',
  },

  blackColor: {
    color: '#231f20',
  },

  grayColor: {
    color: '#999',
  },

  grayBgColor: {
    color: '#999',
  },

  orangeColor: {
    color: '#f57c00',
  },

  pinkColor: {
    color: '#f65e83',
  },

  pinkBgColor: {
    backgroundColor: '#f65e83',
  },

  orangeBgColor: {
    backgroundColor: '#f57c00',
  },

  goldBgColor: {
    backgroundColor: '#db9058',
  },

  greenBgColor: {
    backgroundColor: '#318956',
  },

  purpleBgColor: {
    backgroundColor: '#853a77',
  },

  blackBgColor: {
    backgroundColor: '#111111',
  },

  button: {
    height: hp(5),
    width: hp(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(8),
  },
  textAlign: {
    textAlign: 'center',
  },
  textAlignVertical: {
    textAlignVertical: 'center',
  },
  mainContainer: {
    flex: 1,
  },

  themeTextColor: {
    color: '#00adef',
  },

  whiteColor: {
    color: '#fff',
  },

  whiteBackgroundColor: {
    backgroundColor: '#fff',
  },

  lightBackgroundColor: {
    backgroundColor: '#f2f1f1',
  },

  themeBackgroundColor: {
    backgroundColor: '#00adef',
  },

  flexOne: {
    flex: 1,
  },

  flexTow: {
    flex: 2,
  },

  flexThree: {
    flex: 3,
  },

  padding: {
    padding: wp(3),
  },

  paddingHorizontal: {
    paddingHorizontal: wp(3),
  },

  paddingVentricle: {
    paddingVertical: wp(3),
  },

  paddingBottom: {
    paddingBottom: wp(3),
  },

  paddingTop: {
    paddingTop: wp(3),
  },

  paddingLeft: {
    paddingLeft: wp(3),
  },

  paddingRight: {
    paddingRight: wp(3),
  },
  margin: {
    margin: wp(3),
  },

  marginHorizontal: {
    marginHorizontal: wp(3),
  },

  marginVentricle: {
    marginVertical: wp(3),
  },

  marginBottom: {
    marginBottom: wp(3),
  },

  marginBottomHalf: {
    marginBottom: wp(1.5),
  },

  marginTop: {
    marginTop: wp(3),
  },
  marginTopHalf: {
    marginTop: wp(1.5),
  },

  marginLeft: {
    marginLeft: wp(3),
  },

  marginRight: {
    marginRight: wp(3),
  },

  directionRow: {
    flexDirection: 'row',
  },

  directionColumn: {
    flexDirection: 'column',
  },

  justifyBetween: {
    justifyContent: 'space-between',
  },

  justifyAround: {
    justifyContent: 'space-around',
  },

  justifyEvenly: {
    justifyContent: 'space-evenly',
  },

  justifyEnd: {
    justifyContent: 'flex-end',
  },

  justifyCenter: {
    justifyContent: 'center',
  },

  alignCenter: {
    alignItems: 'center',
  },

  alignStart: {
    alignItems: 'flex-start',
  },

  alignEnd: {
    alignItems: 'flex-end',
  },

  text: {
    fontSize: wp(3.5),
    color: '#222',
  },

  textLarge: {
    fontSize: wp(4),
    color: '#222',
  },

  heading: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#222',
  },

  headingMedium: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#222',
  },

  headingLarge: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#333',
  },

  textBold: {
    fontWeight: '700',
  },

  iconRow: {
    width: hp(2.2),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },

  iconColumn: {
    height: hp(2.2),
    aspectRatio: 1 / 1,
  },
  input: {
    color: '#fff',
    height: hp(5.5),
    flex: 1,
    borderRadius: 4,
    fontSize: wp(3),
    lineHeight: 12,
  },
  separatorVertical: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: wp(2),
    height: '100%',
  },
  separatorHorizontal: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(2),
    width: '100%',
  },
  separatorHorizontalLight: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginVertical: wp(2),
    width: '100%',
  },
  noDataStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(10),
    backgroundColor: '#fff',
    // borderWidth: 2,
  },
  noDataTextStyle: {
    color: '#333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  border: {
    borderWidth: 1,
    borderColor: '#cccccc80',
  },
  vectorIconRow: {
    // width: hp(2.8),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  paddingHalf: {
    padding: wp(1),
  },
  paddingHalfTop: {
    paddingTop: wp(1),
  },
  paddingHalfRight: {
    paddingRight: wp(1),
  },
  paddingHalfBottom: {
    paddingBottom: wp(1),
  },
  paddingHalfLeft: {
    padding: wp(1),
  },
  paddingHalfVertical: {
    paddingVertical: wp(1),
  },
  paddingHalfLeftHorizontal: {
    padding: wp(1),
  },
  alignSelf: {
    alignSelf: 'center',
  },

  marginTop1: {
    marginTop: hp(0.5),
  },

  lightGreenColor: {
    color: '#00b8a9',
  },

  graysColor: {
    color: '#333',
  },

  themeColor: {
    color: '#f57c00',
  },

  themeBgColor: {
    backgroundColor: '#f57c00',
  },

  paddingHalfHorizontal: {
    paddingHorizontal: wp(2),
  },

  paddingHalfVentricle: {
    paddingVertical: wp(2),
  },

  marginHorizontalHalf: {
    marginHorizontal: wp(2),
  },

  marginVentricleHalf: {
    marginVertical: wp(2),
  },

  marginLeftHalf: {
    marginLeft: wp(2),
  },

  marginRightHalf: {
    marginRight: wp(2),
  },

  textSmall: {
    fontSize: wp(3.2),
    color: '#333',
  },

  headingSmall: {
    fontSize: wp(3.2),
    fontWeight: '700',
    color: '#333',
  },

  headingXLarge: {
    fontSize: wp(5.8),
    fontWeight: '700',
    color: '#333',
  },

  textCapitalize: {
    textTransform: 'capitalize',
  },

  iconRowSmallMargin: {
    width: hp(2.8),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },
});

export default basicStyles;
