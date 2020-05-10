import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const windowWidth = Dimensions.get('window').width;
import {StatusBarColor} from '../../constants';

export default class GetStartedActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={StatusBarColor} backgroundColor="#6a51ae" />
        <Icon name="check-circle" size={120} color="#000" style={{margin: 2}} />
        <Text style={{fontSize: 40, fontWeight: 'bold'}}>
          You are ready to go
        </Text>
        <Text style={{marginTop: 20, fontSize: 16}}>
          {' '}
          Thanks for taking your time to create account with us. Now this is the
          part, let's explore the app
        </Text>

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() => this.props.navigation.navigate('Main')}>
            <Text style={styles.setButtonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    width: windowWidth / 2,
    marginTop: 30,
  },
  setButton: {
    margin: 10,
    backgroundColor: '#222846',
    paddingVertical: 15,
    borderRadius: 2,
  },
  setButtonText: {
    color: '#e7564c',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
