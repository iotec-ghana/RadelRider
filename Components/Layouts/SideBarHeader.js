import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import {AsyncStorage} from 'react-native';
import {primaryColor} from '.././../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SideBarHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImg: '',
    };
  }

  componentDidMount = async () => {};

  render() {
    const img = '../../assets/deedat.jpg';

    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor={'transparent'} 
        />
        <Image style={styles.image} source={require(img)} />
        {this.props.authdata.isAuthenticated ? (
          <Text style={styles.nameText}>
            {' '}
            {this.props.authdata.user.first_name}{' '}
            {this.props.authdata.user.last_name}{' '}
          </Text>
        ) : null}

        {this.props.authdata.isAuthenticated ? (
          <Text style={styles.idText}>
            {this.props.authdata.user.phone_number}
          </Text>
        ) : null}
        {this.props.authdata.isAuthenticated ? (
          <Text style={styles.idText}>
            {' '}
            {!this.props.authdata.user.isVerified ? (
              <Text style={styles.idText}>
                {' '}
                Please tap here to verify your account{' '}
              </Text>
            ) : null}{' '}
          </Text>
        ) : null}

        {/* <Icon name="verified" size={20} color="#000" style={{margin: 2}} /> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    padding: 40,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },

  idText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },

  image: {
    borderColor: '#fff',
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 100,
  },
});
