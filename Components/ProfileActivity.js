import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Toolbar from "./Layouts/Toolbar";
const { width, height } = Dimensions.get("window");
import { isSignedIn } from "../Actions/authAction";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";

class ProfileActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  ongoing() {
    return (
      <View
        style={{
          marginTop: 60,
          padding: 15,
          elevation: 24,
          backgroundColor: "#fafafa",
          borderRadius: 10,
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <View style={{ margin: 3 }}>
          <Text
            style={{
              fontWeight: "bold",
              opacity: 0.7,
              fontSize: 12,
            }}
          >
            Ongoing Trip
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 9 }}>
          <Image
            style={styles.imageCustomer}
            source={require("../assets/deedat.jpg")}
          />
          <Text
            style={{
              margin: 10,
              fontWeight: "bold",
              opacity: 0.7,
              fontSize: 16,
            }}
          >
            Kwame Nana
          </Text>
          <View style={{ flex: 1, alignItems: "flex-end", margin: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 16,
                margin: 5,
              }}
            >
              5:50pm
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            opacity: 0.1,
          }}
        />

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Feather
              name={"phone"}
              size={24}
              color="#3d6dfe"
              style={{ margin: 0 }}
            />
            <Text style={{ margin: 5 }}> Call</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Feather
              name={"navigation"}
              size={24}
              color="#3d6dfe"
              style={{ margin: 0 }}
            />
            <Text style={{ margin: 5, fontSize: 16 }}>Navigation</Text>
          </View>
        </View>
      </View>
    );
  }
  summary() {
    return (
      <View
        style={{
          padding: 20,
          elevation: 24,
          backgroundColor: "#fafafa",
          position: "absolute",
          bottom: -60,
          width: width - 20,
          margin: 10,
          borderRadius: 10,
        }}
      >
        <View style={{ marginBottom: 8 }}>
          <Text
            style={{
              fontWeight: "bold",
              opacity: 0.5,
              fontSize: 14,
            }}
          >
            Earned Today
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              opacity: 0.7,
              fontSize: 22,
            }}
          >
            GHC126.90
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 1,
            opacity: 0.1,
          }}
        />
        <View style={{ flexDirection: "row", marginTop: 9 }}>
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
              }}
            >
              Total Trips
            </Text>
            <Text
              style={{
                fontWeight: "bold",

                fontSize: 15,
              }}
            >
              15
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
              }}
            >
              Time Online
            </Text>
            <Text
              style={{
                fontWeight: "bold",

                fontSize: 15,
              }}
            >
              15h 30m
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
                textAlign: "left",
              }}
            >
              Total Distance
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                opacity: 0.7,
                fontSize: 15,
                textAlign: "left",
              }}
            >
              15 km
            </Text>
          </View>
        </View>
      </View>
    );
  }
  render() {
    console.log(this.props.authStatus.isVerified);
    const isVerified= JSON.stringify(this.props.authStatus.isVerified)
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <Toolbar
              icon={"chevron-left"}
              notbackAction={true}
              opendrawer={this.openDrawer}
              navigation={this.props.navigation}
              titleColor={"#fff"}
              body={"Profile"}
              bg={"#3d6dfe"}
              iconColor={"#fff"}
            />
            <StatusBar barStyle="light-content" backgroundColor={"#3d6dfe"} />

            <View
              style={{
                flexDirection: "row",
                padding: 20,
                backgroundColor: "#3d6dfe",

                zIndex: 0,
                height: 200,
                // transform: [
                //   {
                //     rotate: "80deg",
                //   },
                // ],
              }}
            >
              <Image
                style={styles.image}
                source={require("../assets/userlogo.png")}
              />
              <View>
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 10,
                    marginTop: 10,
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {
                    (this,
                    this.props.authStatus.first_name +
                      " " +
                      this.props.authStatus.last_name)
                  }
                </Text>
                {isVerified ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("AddVehicleActivity",{
                        token:this.props.authStatus.token
                      })
                    }
                  >
                    <Text
                      style={{
                        color: "#fff",
                        marginLeft: 10,
                        marginTop: 10,
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      Please tap here to get verified
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  height: 40,
                  marginRight: 10,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  position: "absolute",
                  bottom: -0,
                  width: width,
                }}
              />
              {this.summary()}
            </View>

            {this.ongoing()}
            <Text
              style={{
                textAlign: "center",
                margin: 20,
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              No notifications
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  authStatus: state.auth.user,
  error: state.auth.error,
});
export default connect(
  mapStateToProps,
  { isSignedIn }
)(ProfileActivity);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000000",
    height: height,
  },
  image: {
    borderColor: "#fff",
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 100,
    backgroundColor: "#fff",
  },

  imageCustomer: {
    borderColor: "#fff",
    height: 50,
    width: 50,
    borderWidth: 2,
    borderRadius: 100,
  },
});
