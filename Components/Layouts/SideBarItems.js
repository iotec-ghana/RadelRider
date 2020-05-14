import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {isSignedOut} from '../../Actions/authAction';
import {connect} from 'react-redux';

class SideBarItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  ExecuteSelectedOption = () => {
    switch (this.props.item.id) {
      case 1:
        this.props.navigation.navigate('destination');
        break;
      case 5:
        this.props.isSignedOut(this.props.navigation);
        break;
    } 
  };
  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.ExecuteSelectedOption()}>
        <Icon name={this.props.item.icon} size={15} />
        <Text style={styles.text}>{this.props.item.text}</Text>
      </TouchableOpacity>
    );
  }
}
export default connect(
  null,
  {isSignedOut},
)(SideBarItems);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 4,
    margin: 20,
  },

  text: {
    fontSize: 15,
    marginLeft: 14,
    fontWeight: 'bold',
  },
});
