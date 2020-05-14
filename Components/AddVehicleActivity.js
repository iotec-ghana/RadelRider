import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ToolbarAndroid,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {Picker} from 'native-base';
import Toolbar from "./Layouts/Toolbar";
const windowWidth = Dimensions.get("window").width;
import { StatusBarColor } from "../constants";

import { isSignedIn, loginStatus } from "../Actions/authAction";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import { BASE_URL } from "../constants";
class AddVehicleActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.route.params.token,
      Licenseplate: "",
      driverLicenseNUmber: "",
      model: "",
      InsuranceId: "",
      color: "",
      city: "",
      type: "motor cylce",
      brand:"",
      error:'',
      loading:false
    };
  }
  onValueChange(value) {
    this.setState({
      brand: value, 
    });
}
  onSubmit = async () => {
      this.setState({loading:true})
    try {
        
      const config = {
        headers: { Authorization: `Bearer ${this.state.token}` },
      };

      const resp = await axios.post(
        BASE_URL + "/auth/add_vehicle/",
        this.state,
        config
      );
      console.log(resp.data);
    } catch (error) {
      console.log(error);
      this.setState({error:'error'})
    }
    this.setState({loading:false})
}

  onplatenumberchange(text) {
    this.setState({ Licenseplate: text });
  }
  ondriverlicensechange(text) {
    this.setState({ driverLicenseNUmber: text });
  }
  onmodelchange(text) {
    this.setState({ model: text });
  }
  oninsurancechange(text) {
    this.setState({ InsuranceId: text });
  }

  oncolorchange(text) {
    this.setState({ color: text });
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{ backgroundColor: "#f7f9fc", flex: 1 }}>
            <Toolbar
              icon={"chevron-left"}
              navigation={this.props.navigation}
              bg={"#00000000"}
            />
            {/* <ToolbarAndroid
          logo={require("../assets/deedat.jpg")}
          title="AwesomeApp"
          actions={[
            {
              title: "Settings",
              icon: require("../assets/deedat.jpg"),
              show: "always",
            },
          ]}
          onActionSelected={this.onActionSelected}
        /> */}
            <View style={styles.container}>
              <StatusBar
                backgroundColor={StatusBarColor}
                barStyle="dark-content"
              />
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 20,
                  marginTop: 0,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                Required step
              </Text>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 16,
                  marginTop: 0,
                  textAlign: "left",
                  fontWeight: "bold",
                }}
              >
                Fill in the form below to verify your acount and start earning
              </Text>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 15,
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 12,
                  marginBottom: 4,
                  opacity: 0.5,
                }}
              >
                License plate number
              </Text>
              <TextInput
                style={styles.input}
                placeholder=" License plate number"
                onChangeText={(text) => this.onplatenumberchange(text)}
              />
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 15,
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 7,
                  marginBottom: 4,
                  opacity: 0.5,
                }}
              >
                Driver's License number
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Driver's License number"
              
                onChangeText={(text) => this.ondriverlicensechange(text)}
              />
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 15,
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 7,
                  marginBottom: 4,
                  opacity: 0.5,
                }}
              >
                Vehicle model
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Vehicle model"
               
                onChangeText={(text) => this.onmodelchange(text)}
              />

              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 15,
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 7,
                  marginBottom: 4,
                  opacity: 0.5,
                }}
              >
                Insurance ID
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Insurance ID"
                keyboardType={"numeric"}
                onChangeText={(text) => this.oninsurancechange(text)}
              />

              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 15,
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 7,
                  marginBottom: 4,
                  opacity: 0.5,
                }}
              >
                Color of Vehicle
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Color of Vehicle"
               
                onChangeText={(text) => this.oncolorchange(text)}
              />
              <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
                fontSize: 15,
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 7,
                  marginBottom: 4,
                  opacity: 0.5,
            }}>
            Select brand
          </Text>
          <Picker
            placeholderStyle={{color: '#2874F0'}}
            note={false}
            mode="dropdown"
            placeholder="Select Network"
            style={{
              borderWidth: 2,
              borderColor: '#000',
              backgroundColor: '#fafafa',
            }}
            selectedValue={this.state.brand}
            onValueChange={this.onValueChange.bind(this)}>
            <Picker.Item label="------Select Brand------" value="" />
            <Picker.Item label="Royal" value="Royal" />
            <Picker.Item label="Honda" value="Honda" />
            <Picker.Item label="Suzuki" value="Sukuzi" />
          </Picker>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="#e7564c" />
              ) : null}
              {!this.state.error == "" ? (
                <View style={styles.error}>
                  <Icon name="alert-circle" size={18} color="#e7564c" />
                  <Text style={styles.errorText}>{this.props.error}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => this.onSubmit()}
              >
                <Text style={styles.loginText}>Add Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  authStatus: state.auth,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  { isSignedIn }
)(AddVehicleActivity);
const styles = StyleSheet.create({
  container: {
    padding: 30,
    width: windowWidth,
    backgroundColor: "#f7f9fc",
  },
  input: {
    height: 50,
    padding: 10,

    marginBottom: 15,
    borderColor: "#8f9883",
    borderWidth: 1,
    borderRadius: 4,
  },
  error: {
    flexDirection: "row",
    marginTop: 7,
    padding: 15,
    borderColor: "#e7564c",
    borderWidth: 2,
    borderRadius: 3,
  },
  errorText: {
    marginLeft: 8,
    color: "#e7564c",
    fontSize: 14,
    fontWeight: "bold",
  },
  loginButton: {
    marginTop: 10,

    backgroundColor: "#e7564c",
    paddingVertical: 15,
    borderRadius: 3,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  fb: {
    marginTop: 18,

    backgroundColor: "#4f69a2",
    paddingVertical: 15,
    borderRadius: 3,
  },
  fbText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  google: {
    marginTop: 13,

    backgroundColor: "#e7564c",
    paddingVertical: 15,
    borderRadius: 3,
  },
  googleText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  normalSignUpButton: {
    marginTop: 13,

    backgroundColor: "#fafafa",
    paddingVertical: 15,

    borderRadius: 3,
  },
  normalSignUpButtonText: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
  },
});
