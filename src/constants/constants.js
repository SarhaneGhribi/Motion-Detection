export const commands = [
    { command: 'Blink', prediction: (face) => face.leftEyeOpenProbability < 0.7 && face.rightEyeOpenProbability < 0.7 },
    { command: 'Turn left', prediction: (face) => face.yawAngle > 280 && face.yawAngle < 315  },
    { command: 'Turn right', prediction: (face) => face.yawAngle > 33 && face.yawAngle < 40 },
    { command: 'Smile', prediction: (face) => face.smilingProbability > 0.7 }
  ];