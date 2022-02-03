import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TextInput, Dimensions, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import firebaseApp from '../firebase';
import uuid from 'uuid';
import { getStorage } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height

import BG from './createProfileAssets/BG.png'

export default function CreateProfile() {

  const [image, setImage] = useState(null);

  const storage = getStorage();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const getPictureBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', imageUri, true);
      xhr.send(null);
    });
  };

  const uploadImage = async () => {
    let blob;
    try {
      setUploading(true);
      blob = await getPictureBlob(imageUri);
  
      const ref = await storage.ref().child(uuid.v4());
      const snapshot = await ref.put(blob);
  
      return await snapshot.ref.getDownloadURL();
    } catch (e) {
      alert(e.message);
    } finally {
      blob.close();
      setUploading(false);
    }
  };


  return (
    <View style={styles.container}>
      <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>

        <View style={styles.rectanglebg} />
        <Image source={require('./createProfileAssets/logo.png')} style={styles.logo} />

        <View style={styles.whitebg} >
          <Text style={styles.signinText}>Create Your Profile</Text>
          <TouchableOpacity onPress={pickImage} >
          <Image source={require('./createProfileAssets/CamIcon.png')} style={styles.CamIcon} />
          </TouchableOpacity>
          <TextInput style={styles.InputStyle1} placeholder='Name'></TextInput>
          <TextInput style={styles.InputStyle2} placeholder='Phone Number'></TextInput>
          <TextInput style={styles.InputStyle3} placeholder='Location'></TextInput>
          <TextInput style={styles.InputStyle4} placeholder='Discord ID'></TextInput>

          <TouchableOpacity style={styles.Button} title='Continue' onPress={uploadImage} >
            <Text style={styles.ButtonText}>Continue</Text>
          </TouchableOpacity>

        </View>

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    flex: 1,
    height: "100%"
  },

  bg: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: 'center',
  },

  logo: {
    "position": "absolute",
    top: 5 / 1024 * windowHeight,
    left: 420 / 1440 * windowWidth,
    height: 109 / 1024 * windowHeight,
    width: 600 / 1440 * windowWidth,
  },

  rectanglebg:
  {
    position: "absolute",
    width: 1440 / 1440 * windowWidth,
    height: 126 / 1024 * windowHeight,
    left: 0 / 1024 * windowWidth,
    top: 0 / 1440 * windowHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  whitebg:
  {
    position: "absolute",
    width: 0.25 * windowWidth,
    height: 0.68 * windowHeight,
    left: 0.375 * windowWidth,
    top: 0.2 * windowHeight,
    justifyContent: 'center',
    alignItems:"center",
    alignContent:"center",
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomRightRadius: 17,
    borderBottomLeftRadius: 17
  },

  signinText: {
    position: "absolute",
    top: 0.02*windowHeight,
    height: 32/1024*windowHeight,
    width: 305/1440*windowWidth,
    color: 'white',
    fontSize: 27,
    lineHeight: 32,
    textAlign: 'center',
  },

  CamIcon: {
    "position": "absolute",
    resizeMode:"contain",
    bottom: 0.13 * windowHeight,
    height: 0.11 * windowHeight,
    width: 0.11 * windowWidth,
  },

  InputStyle1: {
    "position": "absolute",
    top: 0.2 * windowHeight,
    height: 45 / 1024 * windowHeight,
    width: 305 / 1440 * windowWidth,
    color: 'white',
    fontSize: 17,
    paddingLeft: 10,
    paddingBottom: 7,
    paddingTop: 3,
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    placeholderTextColor: "#FFFFFF",
    backgroundColor: "#e5e5e500"
  },

  InputStyle2: {
    "position": "absolute",
    top: 0.3 * windowHeight,
    height: 45 / 1024 * windowHeight,
    width: 305 / 1440 * windowWidth,
    color: 'white',
    fontSize: 17,
    paddingLeft: 10,
    paddingBottom: 7,
    paddingTop: 3,
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    placeholderTextColor: "#FFFFFF",
    backgroundColor: "#e5e5e500"
  },

  InputStyle3: {
    "position": "absolute",
    top: 0.4 * windowHeight,
    height: 45 / 1024 * windowHeight,
    width: 305 / 1440 * windowWidth,
    color: 'white',
    fontSize: 17,
    paddingLeft: 10,
    paddingBottom: 7,
    paddingTop: 3,
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    placeholderTextColor: "#FFFFFF",
    backgroundColor: "#e5e5e500"
  },

  InputStyle4: {
    "position": "absolute",
    top: 0.5 * windowHeight,
    height: 45 / 1024 * windowHeight,
    width: 305 / 1440 * windowWidth,
    color: 'white',
    fontSize: 17,
    paddingLeft: 10,
    paddingBottom: 7,
    paddingTop: 3,
    borderBottomColor: "#FFFFFF",
    borderBottomWidth: 1,
    placeholderTextColor: "#FFFFFF",
    backgroundColor: "#e5e5e500"
  },

  Button:
  {
    position: "absolute",
    width: 305 / 1440 * windowWidth,
    height: 55 / 1024 * windowHeight,
    top: 0.6 * windowHeight,
    backgroundColor: "#54E0FF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  ButtonText:
  {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 23.45,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#FFFFFF"
  },
});