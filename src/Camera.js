import { StyleSheet, SafeAreaView, Text, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { commands } from './constants/constants';
const CameraComponent = () => {
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [face,setFaces]=useState([]);
  const [currentCommand, setCurrentCommand] = useState('Turn left');
  const [completedCommands,setCompletedCommands] = useState([]);
  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        alert('Permission to access the camera was denied');
      }
    })();
  }, []);
const takeSelfie=()=>{
  console.log("selfie")
}
  const handleFacesDetected = ({ faces}) => {
    setFaces(faces)
    console.log(face)
  };
  const renderFaceData = () => {
    if (!face) {
      return (
        <SafeAreaView style={styles.faces}>
          <Text style={styles.faceDesc}>No face detected</Text>
        </SafeAreaView>
      );
    } else {
  
      const checkAllCommandsCompleted = () => {
        console.log(completedCommands.length)
        if (completedCommands.length === commands.length) {
          Alert.alert('Liveness Test', "Liveness Test Successfully completed");
        };
      };
      const getRandomCommand = () => {
        const filteredCommands = commands.filter(
          (command) =>
            !completedCommands.includes(command.command) && command.command !== currentCommand
        );
    
        if (filteredCommands.length === 0) {
          return null;
        }
    
        const randomIndex = Math.floor(Math.random() * filteredCommands.length);
        return filteredCommands[randomIndex];
      };

      const handleCommandCompletion = (command) => {
        const temp =[command.command];
        if(completedCommands.length <5);
        setCompletedCommands(completedCommands.concat(temp));
        checkAllCommandsCompleted();
        setCurrentCommand(null);
      };
      if (currentCommand === null && face.length > 0) {
        const command = getRandomCommand();
        if (command) {
        const isCommandCompleted = completedCommands.includes(command.command);
        const commandPrediction = command.prediction(face[0]);

        if (!isCommandCompleted && commandPrediction) {
          setCurrentCommand(command.command);
        };
        };
      };
     
      if (currentCommand && face.length > 0 && completedCommands.length < 5) {
        const currentCommandData = commands.find(
          (command) => command.command === currentCommand
        );
        if (
          currentCommandData &&
          currentCommandData.prediction(face[0]) &&
          completedCommands.length < 5
        ) {
          handleCommandCompletion(currentCommandData);
  
          if (completedCommands.length < 5) {
            const nextCommand = getRandomCommand() || commands.find((cmd) => cmd.command === 'Smile');
            if (nextCommand) {
              setCurrentCommand(nextCommand.command);
  
              if (nextCommand.command === 'Smile') {
                takeSelfie();
              }
            }
          }
        }
      };

      return (
        <SafeAreaView style={styles.faces}>
              <Text style={styles.faceDesc}>{currentCommand}</Text>
        </SafeAreaView>
      );
    };
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
      {renderFaceData()}
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
  },
   faces: {
    position: 'absolute',
    width: '100%',
    padding: 10,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceDesc: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "black",
  }
})
