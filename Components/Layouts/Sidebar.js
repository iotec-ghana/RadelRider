import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import SideBarItems from './SideBarItems';
import SideBarHeader from './SideBarHeader';
import {StatusBarColor} from '../../constants';
const menuItems = [
  {
    id: 1,
    icon: 'history',
    text: 'My rides',
  },
  {
    id: 2,
    icon: 'credit-card',
    text: 'My Payment',
  },
  {
    id: 3,
    icon: 'bell',
    text: 'Notifications',
  },
  {
    id: 4,
    icon: 'comment',
    text: 'Support',
  },
  {
    id: 5,
    icon: 'sign-out',
    text: 'Log out',
  },
];

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        
        <SideBarHeader
          image={'../../../assets/deedat.jpg'}
          
          authdata={this.props.authdata}
        />
        <SafeAreaView>
          <FlatList
            data={menuItems}
            renderItem={({item}) => (
              <SideBarItems item={item} navigation={this.props.navigation} />
            )}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  container: {
   
    flex: 4,
    backgroundColor: '#fff',
  },
});
