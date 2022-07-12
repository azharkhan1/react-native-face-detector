/* eslint-disable react-native/no-inline-styles */
import * as React from "react";
import { runOnJS } from "react-native-reanimated";

import { StyleSheet, Text } from "react-native";
import {
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";

import { Camera } from "react-native-vision-camera";
import { scanFaces, Face } from "vision-camera-face-detector";

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [faces, setFaces] = React.useState([]);

  const devices = useCameraDevices();
  const device = devices.front;

  React.useEffect(() => {
    // console.log(faces);
  }, [faces]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const scannedFaces = scanFaces(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);
  console.log({ faces });
  return device != null && hasPermission ? (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <Text
        style={{ color: "white", position: "absolute", bottom: 100, left: 150 }}
      >
        {faces?.length >= 0 && `smiling: ${faces[0]?.smilingProbability}`}
      </Text>
    </>
  ) : null;
}
