import { StyleSheet, SafeAreaView, Button } from 'react-native';  // Import Button
import { useState, useEffect } from 'react';  // Import useEffect
import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

const CameraComponent = () => {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    // Request camera permissions when the component mounts
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Permission to access the camera was denied');
      }
    })();
  }, []);  // Empty dependency array ensures this effect runs once when the component mounts

  const toggleCameraType = () => {
    setType(current => (current === CameraType.front ? CameraType.back : CameraType.front));
  }

  const handleFacesDetected = ({ faces }) => {
    console.log(faces)
  };

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
    </SafeAreaView>
  )
}

export default CameraComponent

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  camera:{
    width: '100%',
    height: '100%',
  }
})
