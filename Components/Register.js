import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {RegisterUser} from '../../Actions/authAction';
import {connect} from 'react-redux';
const windowWidth = Dimensions.get('window').width;
import Toolbar from './Layouts/Toolbar';
import {StatusBarColor} from '../../constants';
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      phone: '',
      email: '',
      showPassword: false,
      password: '',
      loading: false,
    };
  }
  toggleSwitch = () => {
    this.setState({showPassword: !this.state.showPassword});
  };
  onFirstnameChange = fname => {
    this.setState({
      fname: fname,
    });
  };
  onLastnameChange = lname => {
    this.setState({
      lname: lname,
    });
  };
  onEmailChange = email => {
    this.setState({email: email});
  };
  onPhoneChange = phone => {
    this.setState({phone: phone});
  };
  onPasswordChange = pass => {
    this.setState({password: pass});
  };
  onSubmit = async () => {
    const {fname, lname, phone, email, password} = this.state;
    if (
      fname == '' &&
      lname == '' &&
      phone == '' &&
      email == '' &&
      password == ''
    ) {
      alert('one or more fields is empty');
    } else {
      this.setState({loading: true});
      const payload = {
        first_name: fname,
        last_name: lname,
        email: email,
        phone_number: phone,
        password: password,
      };
      await this.props.RegisterUser(payload, this.props.navigation);
      this.setState({loading: false});
    }
  };

  render() {
    return (
      <View>
        <Toolbar
          icon={'chevron-left'}
          right={'Log in'}
          rightTextColor={'#e7564c'}
          routeBack={'Home'}
          navigation={this.props.navigation}
          righSideRoute={'Login'}
        />
        <View style={styles.container}>
          <StatusBar
            backgroundColor={StatusBarColor}
            barStyle="light-content"
          />
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 40,
              marginTop: 0,
              marginBottom: 12,
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            Sign up
          </Text>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.inputf}
              placeholder="First Name"
              onChangeText={text => this.onFirstnameChange(text)}
              // defaultValue={text}
            />
            <TextInput
              style={styles.inputl}
              placeholder="Last Name"
              onChangeText={text => this.onLastnameChange(text)}
              // defaultValue={text}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={text => this.onEmailChange(text)}
            // defaultValue={text}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={text => this.onPhoneChange(text)}
            //defaultValue={text}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={text => this.onPasswordChange(text)}
            //defaultValue={text}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            // onChangeText={text}
            //defaultValue={text}
          /> */}
          {this.state.loading ? (
            <ActivityIndicator size="large" color="#e7564c" />
          ) : null}
          {!this.props.error == '' ? (
            <View style={styles.error}>
              <Icon name="exclamation-circle" size={18} color="#e7564c" />
              <Text style={styles.errorText}>{this.props.error}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.SignUpButton}
            onPress={() =>
              this.props.navigation.navigate('PhoneVerificationActivity')
            }>
            <Text style={styles.SignUpButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  authStatus: state.auth.isAuthenticated,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  {RegisterUser},
)(Register);
const styles = StyleSheet.create({
  container: {
    padding: 30,
    width: windowWidth,
  },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 15,
    borderRadius: 3,
  },
  inputf: {
    height: 50,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 15,
    marginRight: 8,
    borderRadius: 3,
    flex: 1,
  },
  inputl: {
    height: 50,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 15,
    borderRadius: 3,
    flex: 1,
  },
  error: {
    flexDirection: 'row',
    marginTop: 7,
    padding: 15,
    borderColor: '#e7564c',
    borderWidth: 1,
  },
  errorText: {
    marginLeft: 8,
    color: '#e7564c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  SignUpButton: {
    marginTop: 10,
    backgroundColor: '#4f69a2',
    paddingVertical: 15,
    borderRadius: 3,
  },
  SignUpButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  toolbar: {
    flex: 1,
    width: windowWidth,
    position: 'absolute',
    top: 0,
    elevation: 5,
    backgroundColor: '#00000000',
  },

  toolContent: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
  },
});
