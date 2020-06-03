import React, {Component} from 'react';
import {View, Text, Animated, Easing} from 'react-native';

export default class UserMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedValue: new Animated.Value(0.1),
    };
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(this.state.animatedValue, {
          toValue: 0.4,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
      ]), 
    ).start();
    // this.setState({animatedValue:new Animated.Value(0)})
  }
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Animated.View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e7564c',
            height: 50,
            width: 50,
            borderRadius: 125,
            opacity: this.state.animatedValue,
          }}
        />

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#e7564c',
            height: 18,
            width: 18,
            borderRadius: 25,
            position: 'absolute',
            borderColor: '#fff',
            borderWidth: 2,
          }}>
          {/* <View
            style={{
              position:"absolute",
              width: 0,
              height: 0,
              borderLeftWidth: 15,
              borderLeftColor: 'transparent',
              borderRightWidth: 15,
              borderRightColor: 'transparent',
              borderTopWidth: 20,
              borderTopColor: '#e7564c',
              opacity: 0.8,
              borderRadius: 105,
              bottom:10,
             
               
              
            }}
          /> */}
        </View>
      </View>
    );
  }
}
