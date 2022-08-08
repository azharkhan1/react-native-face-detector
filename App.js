/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState, useEffect } from "react";
import { runOnJS } from "react-native-reanimated";

import { StyleSheet, Text, View, Button, Image } from "react-native";
import {
  useCameraDevices,
  useFrameProcessor,
} from "react-native-vision-camera";

import { Camera } from "react-native-vision-camera";
import { scanFaces, Face } from "vision-camera-face-detector";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [faces, setFaces] = useState([]);
  const [picture, setPicture] = useState("");
  const camera = useRef(null);

  const devices = useCameraDevices();
  const device = devices.front;

  useEffect(() => {
    // console.log(faces);
  }, [faces]);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "authorized");
    })();
  }, []);

  const takePicture = async () => {
    try {
      const snapshot = await camera.current.takePhoto({
        quality: 85,
        skipMetadata: true,
      });
      setPicture(snapshot);
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (hasPermission && device && !picture) {
      takePicture();
    }
    // if (hasPermission && device) {
    //   takePicture();
    // }
  }, [hasPermission, device, faces]);

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const scannedFaces = scanFaces(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);
  console.log(faces[0]);
  return (
    <View>
      {device != null && hasPermission && (
        <View style={{ width: "80%", height: "80%" }}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
            ref={camera}
            photo={true}
          />
        </View>
      )}
      <Text
        style={{ color: "black", position: "absolute", bottom: 100, left: 150 }}
      >
        {faces?.length >= 0 && `smiling: ${faces[0]?.smilingProbability}`}
      </Text>

      <Image
        style={{ width: 150, height: 150 }}
        source={{ uri: `file://${faces[0]?.path}` }}
      />
    </View>
  );
}
