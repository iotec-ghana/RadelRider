/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Header, Left, Body, Right, Button, Title, Container} from 'native-base';
import {StyleSheet, TouchableOpacity, View, Text, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default class Toolbar extends Component {
  // state = {
  //   isEnabled: true,
  // };
  // toggleSwitch = () => {
  //   this.setState({isEnabled: !this.state.isEnabled});
  // };
  render() {
    return (
      <View>
        <Header style={styles.header}>
          <Left>
            <Button
              transparent
              onPress={() => {
                !this.props.opendrawer
                  ? this.props.navigation.goBack(null)
                  : this.props.opendrawer();
              }}>
              <Icon
                name={this.props.icon}
                size={30}
                color="#000"
                style={{margin: 0}}
              />

              {/* <Text>Back</Text> */}
            </Button>
          </Left>

          <Body>
            <Switch
            
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={true ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              //onValueChange={this.toggleSwitch()}
              value={true}
            />
            {/* <Title>
              <Text style={{color:"#000"}}>hjgfbhj</Text>
            </Title> */}
          </Body>

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
                    fontSize: 14,
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
    backgroundColor: '#fff',
  },
});
