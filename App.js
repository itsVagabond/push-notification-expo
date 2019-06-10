import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Permissions, Notifications } from 'expo';

const PUSH_REGISTRATION_ENDPOINT = 'http://4031a7be.ngrok.io/token';
const MESSAGE_ENPOINT = 'http://4031a7be.ngrok.io/message';

export default class App extends React.Component {
  state = {
    notification: null,
    messageText: ''
  }

  handleNotification = (notification) => {
    this.setState({ notification });
  }

  handleChangeText = (text) => {
    this.setState({ messageText: text });
  }

  sendMessage = async () => {
    fetch(MESSAGE_ENPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: this.state.messageText,
      }),
    });
    this.setState({ messageText: '' });
  }

  registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    console.log('Status : ', status);
    
    if (status !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    return fetch(PUSH_REGISTRATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token,
        },
        user: {
          username: 'Alpha',
          name: 'AlphaBeta'
        },
      }),
    });
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }

  componentWillMount() {
    this.notificationSubscription = Notifications.addListener(this.handleNotification);
  }

  renderNotification() {
    return(
      <View style={styles.container}>
        <Text style={styles.label}>A new message was recieved!</Text>
        <Text>{this.state.notification.data.message}</Text>
      </View>
    )
  }

  renderHome() {
    return(
      <View>
        <TextInput
          value={this.state.messageText}
          onChangeText={this.handleChangeText}
          style={styles.textInput}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={this.sendMessage}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.notification 
            ? this.renderNotification()
            : this.renderHome()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#474747',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 50,
    width: 300,
    borderColor: '#f6f6f6',
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  button: {
    padding: 10,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'
  },
  label: {
    fontSize: 18
  }
});
