/* eslint-disable no-alert */
import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import Toolbar from './Layouts/Toolbar';
const windowWidth = Dimensions.get('window').width;
import {StatusBarColor} from '../constants';
import {StackActions} from '@react-navigation/native';
import {isSignedIn, loginStatus} from '../Actions/authAction';
import {connect} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
class Login extends Component {
  state = {
    email: '',
    password: '',
    isAuthenticated: false,
    loading: false,
  };
  onSubmit = async () => {
    const {email, password} = this.state;
    if (email === '') {
      alert('email field cannot be empty');
    } else if (password === '') {
      alert('password field cannot be empty');
    } else {
      this.setState({loading: true});
      await this.props.isSignedIn({email: email, password: password});
      this.setState({loading: false});
    }
  };
  onemailChange = email => {
    this.setState({email: email});
  };
  onPasswordChange = password => {
    this.setState({password: password});
  };
  componentDidMount = async () => {
    //this.props.loginStatus();
  };
  static getDerivedStateFromProps(props, state) {
    console.log(props.authStatus);
    if (props.authStatus.isAuthenticated) {
      props.navigation.dispatch(StackActions.replace('Main'));
    }
  }
  render() {
    const {email} = this.state;
    return (
      <View style={{backgroundColor: '#f7f9fc', flex: 1}}>
        <Toolbar
          icon={'arrow-left'}
          right={'Sign Up'}
          rightTextColor={'#e7564c'}
          navigation={this.props.navigation}
          righSideRoute={'SignUp'}
        />

        <View style={styles.container}>
          <StatusBar backgroundColor={StatusBarColor} barStyle="dark-content" />
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 40,
              marginTop: 0,
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            Log in
          </Text>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 15,
              textAlign: 'left',
              fontWeight: 'bold',
              marginTop: 12,
              marginBottom: 4,
              opacity: 0.5,
            }}>
            email
          </Text>
          <TextInput
            style={styles.input}
            placeholder="email"
            onChangeText={text => this.onemailChange(text)}
          />
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              fontSize: 15,
              textAlign: 'left',
              fontWeight: 'bold',
              marginTop: 7,
              marginBottom: 4,
              opacity: 0.5,
            }}>
            Password
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={text => this.onPasswordChange(text)}
          />
          {this.state.loading ? (
            <ActivityIndicator size="large" color="#e7564c" />
          ) : null}
          {!this.props.error == '' ? (
            <View style={styles.error}>
              <Feather name="alert-circle" size={18} color="#e7564c" />
              <Text style={styles.errorText}>{this.props.error}</Text>
            </View>
          ) : null} 
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.onSubmit()}>
            <Text style={styles.loginText}>LOG IN</Text>
          </TouchableOpacity>

          <Text
            style={{textAlign: 'center', marginTop: 20, fontWeight: 'bold'}}>
            Forgot Password?
          </Text>
          {/* <Text
            style={{textAlign: 'center', marginTop: 20, fontWeight: 'bold'}}>
            Or
          </Text> */}

          {/* <TouchableOpacity style={styles.fb} onPress={this._onPressButton}>
            <Text style={styles.fbText}>Sign Up with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.google} onPress={this._onPressButton}>
            <Text style={styles.googleText}>Sign Up with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.normalSignUpButton}
            onPress={this._onPressButton}>
            <Text style={styles.normalSignUpButtonText}>
              Sign Up with email and Password
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  authStatus: state.auth,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  {isSignedIn, loginStatus},
)(Login);
const styles = StyleSheet.create({
  container: {
    padding: 30,
    width: windowWidth,
    backgroundColor: '#f7f9fc',
  },
  input: {
    height: 50,
    padding: 10,

    marginBottom: 15,
    borderColor: '#8f9883',
    borderWidth: 1,
    borderRadius: 4,
  },
  error: {
    flexDirection: 'row',
    marginTop: 7,
    padding: 15,
    borderColor: '#e7564c',
    borderWidth: 2,
    borderRadius: 3,
  },
  errorText: {
    marginLeft: 8,
    color: '#e7564c',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 10,

    backgroundColor: '#e7564c',
    paddingVertical: 15,
    borderRadius: 3,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fb: {
    marginTop: 18,

    backgroundColor: '#4f69a2',
    paddingVertical: 15,
    borderRadius: 3,
  },
  fbText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  google: {
    marginTop: 13,

    backgroundColor: '#e7564c',
    paddingVertical: 15,
    borderRadius: 3,
  },
  googleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  normalSignUpButton: {
    marginTop: 13,

    backgroundColor: '#fafafa',
    paddingVertical: 15,

    borderRadius: 3,
  },
  normalSignUpButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
