/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Header, Left, Body, Right, Button, Title} from 'native-base';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Feather } from '@expo/vector-icons';

export default class Toolbar extends Component {
  render() {
    return (
      <View style={styles.header,{backgroundColor:this.props.bg}}>
        <Header transparent>
          <Left>
            <Button
              transparent
              onPress={() => {
                !this.props.opendrawer
                  ? this.props.navigation.goBack(null)
                  : this.props.opendrawer();
              }}>
              <Feather
                name={this.props.icon}
                size={30}
                color={this.props.iconColor}
                style={{margin: 0}}
              />

              {/* <Text>Back</Text> */}
            </Button>
          </Left>
          {this.props.body ? (
            <Body>
              <Title
                style={{
                  color: this.props.titleColor,
                  margin: 0,
                }}>
                {this.props.body}
              </Title>
            </Body>
          ) : null}
          <Right>
            {this.props.right ? (
              <Button
                transparent
                onPress={() =>
                  this.props.navigation.navigate(this.props.righSideRoute)
                }>
                <Text
                  style={{
                    color: this.props.rightTextColor,
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {this.props.right}
                </Text>
              </Button>
            ) : null}
          </Right>
        </Header>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
   elevation: 0,
  
    paddingTop: 0,
  }, 
});
