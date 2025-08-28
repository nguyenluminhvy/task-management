import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
// import { Icon, type InputProps as RNElementInputProps } from '@rneui/base'
import { useTheme } from '@react-navigation/native'
import {
  Animated,
  StyleProp,
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
// import AppText from '@Components/AppText.tsx'
// import { FontSizes, ResponsiveHeight } from '@Theme'
import {isIos} from "@/lib/utils/helper";
// import { SVG_AUTH } from '@Assets/Images/Svg/Auth'
// import { SVG_WALLET } from '@Assets/Images/Svg/Wallet'
import { Text, Icon, MD3Colors } from "react-native-paper";

interface IInputProps extends RNTextInputProps {
  isMobileNumberInput?: boolean
  isValid?: boolean | null
  isError?: boolean | null
  rightText?: string
  errorMessage?: string | null
  RightComponent?: any
  rightTextStyle?: StyleProp<TextStyle>
  onRightTextPress?: () => void
  onBlurFocus?: () => void
  showSearchIcon?: boolean
}

export const AppTextInput = forwardRef<RNTextInput, IInputProps>(
  (
    {
      containerStyle,
      inputContainerStyle,
      inputStyle,
      labelStyle,
      label,
      isMobileNumberInput,
      isValid = null,
      isError = false,
      showSearchIcon = false,
      errorMessage = '',
      rightText = '',
      RightComponent,
      rightTextStyle,
      onRightTextPress = null,
      secureTextEntry = undefined,
      keyboardType = isIos ? 'ascii-capable' : 'visible-password',
      // keyboardType = 'ascii-capable',
      onBlurFocus,
      ...inputProp
    },
    ref
  ) => {
    const colors: any = useTheme().colors

    const focusAnim = useRef(new Animated.Value(0)).current
    const errorAnim = useRef(new Animated.Value(0)).current

    const [isShowError, setIsShowError] = useState(isError)
    const [isShowPassword, setIsShowPassword] = useState(secureTextEntry)
    const [isFocused, setIsFocused] = useState(false)

    /*
     ** This effect will trigger the animation every
     ** time `isFocused` value changes.
     */
    useEffect(() => {
      Animated.spring(focusAnim, {
        toValue: isFocused ? 1 : 0,
        damping: 15,
        mass: 1,
        useNativeDriver: false,
      }).start()
    }, [focusAnim, isFocused])

    useEffect(() => {
      Animated.spring(errorAnim, {
        toValue: isError ? 1 : 0,
        damping: 15,
        mass: 1,
        useNativeDriver: false,
      }).start()
      setTimeout(
        () => {
          setIsShowError(isError)
        },
        isError ? 0 : 250
      )
    }, [errorAnim, isError])

    const onFocus = useCallback(() => {
      setIsFocused(true)
    }, [])

    const onBlur = useCallback(() => {
      setIsFocused(false)
      onBlurFocus?.()
    }, [onBlurFocus])

    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              borderColor: !isShowError
                ? focusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', 'rgba(52, 120, 245, 0.5)'],
                  })
                : errorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', 'rgba(234, 57, 67, 0.5)'],
                  }),
            },
            // isError && {
            //   borderColor: errorAnim.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: ['transparent', 'rgba(234, 57, 67, 0.5)'],
            //   }),
            // },
            inputContainerStyle,
          ]}
        >
          {showSearchIcon && (
            <View style={{marginLeft: 8}}>
              <Icon source="text-search" color={MD3Colors.neutralVariant60} size={24} />
            </View>
          )}
          <RNTextInput
            ref={ref}
            editable
            style={[styles.input, inputStyle]}
            underlineColorAndroid={'transparent'}
            selectionColor={'grey'}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholderTextColor={'rgba(124, 127, 135, 1)'}
            {...(secureTextEntry && {
              secureTextEntry: isShowPassword,
            })}
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={keyboardType}
            textContentType="none"
            autoComplete={'off'}
            dataDetectorTypes={'none'}
            {...inputProp}
          />
          {RightComponent}
          {/*{rightText && (*/}
          {/*  <TouchableOpacity*/}
          {/*    style={{ paddingHorizontal: 12 }}*/}
          {/*    activeOpacity={onRightTextPress ? 0.2 : 1}*/}
          {/*    onPress={onRightTextPress}*/}
          {/*  >*/}
          {/*    <AppText style={[styles.rightText, rightTextStyle]}>*/}
          {/*      {rightText}*/}
          {/*    </AppText>*/}
          {/*  </TouchableOpacity>*/}
          {/*)}*/}

          {/*{secureTextEntry && (*/}
          {/*  <View style={{ paddingHorizontal: 8 }}>*/}
          {/*    <TouchableOpacity*/}
          {/*      onPress={() => {*/}
          {/*        setIsShowPassword(!isShowPassword)*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      {isShowPassword ? (*/}
          {/*        <SVG_WALLET.EyeSplashBlackSVG />*/}
          {/*      ) : (*/}
          {/*        <SVG_WALLET.EyeBlackSVG />*/}
          {/*      )}*/}
          {/*    </TouchableOpacity>*/}
          {/*  </View>*/}
          {/*)}*/}
        </Animated.View>

        {errorMessage?.length > 0 && (
          <Text
            variant={'labelSmall'}
            style={{ marginTop: 8, marginLeft: 0, color: 'rgba(234, 57, 67, 1)'}}
          >
            {errorMessage}
          </Text>
        )}
      </Animated.View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // paddingVertical: responsive.h(5)
    paddingVertical: 5,
  },
  labelContainer: {
    // top: responsive.h(4)
    marginBottom: 10,
    marginLeft: 10,
  },
  errorContainer: {
    // top: responsive.h(10)
    top: 10,
  },
  error: {
    // height: responsive.h(20)
    height: 20,
  },
  // label: {
  //   fontSize: FONT_SIZE_NORMAL
  // },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ translateX: 0 }],
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(237, 239, 243, 1)',
  },
  input: {
    color: 'rgba(6, 7, 38, 1)',
    flex: 1,
    fontFamily: 'Lato-Regular',
    // fontSize: FontSizes.normal,
    fontWeight: '500',
    minHeight: 54,
    marginLeft: isIos ? 17 : 15,
    marginRight: 10,
  },
  rightText: {
    color: 'rgba(6, 7, 38, 0.5)',
    fontWeight: '500',
  },
})
