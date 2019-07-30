import React from "react";
import {
  Vibration,
  StyleSheet,
  Text,
  View,
  Alert,
  Linking,
  Button
} from "react-native";

// import { BarCodeScanner, Permissions } from 'expo';
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ hasCameraPermission: status === "granted" });
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this._handleBarCodeRead}
            style={{ height: 250, width: 350 }}
          />
          {scanned && (
            <Button
              title={"Tap to Scan Again"}
              onPress={() => this.setState({ scanned: false })}
            />
          )}
        </View>
      );
    }
  }

  _handleBarCodeRead = ({ type, data }) => {
    this.setState({ scanned: true });
    Alert.alert(
      "Open this URL?",
      data,
      [
        {
          text: "No",
          onPress: () => {}
        },
        { text: "Yes", onPress: () => Linking.openURL(data) }
      ],
      { cancellable: false }
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",

    alignItems: "center",

    justifyContent: "center"
  }
});
