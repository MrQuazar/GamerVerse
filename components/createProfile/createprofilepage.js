import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TextInput, Dimensions, TouchableOpacity, ImageBackground, ScrollView, FlatList } from 'react-native'

import fire from '../firebase';
import uuid from 'uuid';
import { getStorage, ref as strRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {getAuth} from "firebase/auth";
import { createUserWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import {getDatabase,ref,update, query,push,get, orderByChild, equalTo} from "firebase/database"
import * as ImagePicker from 'expo-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height



export default function CreateProfile({navigation}) {

  const [image, setImage] = useState(null);

  const storage = getStorage();
  const metadata = {
    contentType: 'image/jpg',
  };

  const auth = getAuth()
  const db = getDatabase()



  const [location,setLocation] = React.useState()
  const [selectedValue,setSelectedValue] = React.useState()

  const getLocationsFromApi = async (loc) => {
    let response = await fetch(
      'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text='+loc+'&f=json'
    );
    let json = await response.json();
    setLocation(json.suggestions);
  }

  const pickImage = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    

    if (!result.cancelled) {
      setImage(result.uri);
      
    }
  };
  const [UserName, setUserName] = React.useState();
  const [PNum, setPNum] = React.useState(0);
  const [Disc, setDisc] = React.useState();
  function discCheck(Disc){
    let numbers = '0123456789';
    let j=0;
    let k=0;
    let hash = '#'
    for (var i=0; i < Disc.length; i++) {
        if(Disc[i]=='#') {
            k++;
            for (var l=1;l<5;l++){
            if(numbers.indexOf(Disc[i+l]) > -1) {
              j++;
              }
            }
        }
      }
        if(k>=1 && j == 4)
        {
          return true
        }
        else 
        {
          alert("Please enter valid discord ID");
          return false
        }
}
  function mobileCheck(PNum){
    let numbers = '0123456789';
    for (var i=0; i < PNum.length; i++) {
        if(numbers.indexOf(PNum[i]) > -1 && PNum.length==10 && PNum!=='0000000000') {
          
        }
        else {
            alert("Please enter valid phone number");
            return false
        }
    }
    return true
  }
    function NameCheck(UserName){
          if(UserName.length>0) {
            return true
          }
          else {
              alert("Please enter valid name");
              return false
          }
        }

async function sendFirebaseData(){
            
            const storageRef = strRef(storage, 'Profile/'+auth.currentUser.uid+'.jpg');
            const dbRef = ref(db,'users/'+auth.currentUser.uid)
            const response = await fetch(image);
            const blob = await response.blob();
            uploadBytes(storageRef, blob, metadata).then((snapshot) => {
              getDownloadURL(storageRef).then((url)=>{
                update(dbRef,{
                    Email: auth.currentUser.email,
                    PhoneNumber: PNum,
                    Location: selectedValue,
                    LocationLower: selectedValue.toLowerCase(),
                    Games:['XX'],
                    RequestedProfiles:['XX'],
                    ConfirmedProfiles:['XX'],
                    DiscordId: Disc,
                    uid: auth.currentUser.uid,
                    Name: UserName,
                    DisplayPicture: url,
                    aboutMe:"Hey, I am "+UserName,
                    PostCount: 0,
                    privacyStatus:1
                  })
                let LocUploadRef = query(ref(db,'locations/'),orderByChild('LocationLower'),equalTo(selectedValue.toLowerCase()))
                get(LocUploadRef).then((snapshot) => {
                  ("Snapshot exists?: " + snapshot.exists())
                  
                  if(!snapshot.exists()){
                    push(ref(db,'locations/'),{
                      Location: selectedValue,
                      LocationLower: selectedValue.toLowerCase(),
                    })
                  }
                    
                  
                })
                  })
                
              })
}

function renderSug() {
  if(!selectedValue){
    return(
    
    <FlatList
      
      style={styles.LocSuggestions}
      data={location}
      keyExtractor={(item) => item.magicKey}
      renderItem={(suggestion) => {
        return(
        <TouchableOpacity style={styles.item} onPress={() =>setSelectedValue(suggestion.item.text)}>
          <Text style={styles.itemText}>{suggestion.item.text}</Text>
        </TouchableOpacity>)
      }}

      
      ></FlatList>
      
      )}
}

  return (
    <View style={styles.container}>
      <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2FBG.png?alt=media&token=02003518-4b7f-40c9-ba6a-9bf4c095275e"} resizeMode="cover" style={styles.bg}>

        <View style={styles.rectanglebg} />
        <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Flogo.png?alt=media&token=7468c404-5678-43b2-92eb-310ffa58433c"} style={styles.logo} />

        <View style={styles.whitebg} >
          <Text style={styles.signinText}>Create Your Profile</Text>
          <TouchableOpacity onPress={pickImage} style={{position:'absolute'}} >
          <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2FCamIcon.png?alt=media&token=f86b3513-20cc-4a25-8e60-26c7f71fb7da"} style={styles.CamIcon} />
          {image && <Image source={{ uri:image }} style={styles.ProfileImage} />}
          </TouchableOpacity>
          <TextInput style={styles.InputStyle1} maxLength={20} placeholder='Name' onChangeText={UserName => setUserName(UserName)}></TextInput>
          <TextInput style={styles.InputStyle2} maxLength={10} placeholder='Phone Number' onChangeText={PNum => setPNum(PNum)}></TextInput>
          <TextInput 
          
          style={styles.InputStyle3} 
          value={selectedValue}
          onChangeText={(text) => getLocationsFromApi(text)}
          placeholder="Location (Drop Down Only)"
          onFocus={() => {
            if(selectedValue)
              setSelectedValue(undefined)
            }}>

          </TextInput>
          {renderSug()}
          
          <TextInput style={styles.InputStyle4} placeholder='Discord ID' onChangeText={Disc => setDisc(Disc)}></TextInput>

          <TouchableOpacity style={styles.Button} title='Continue' 
            onPress={
              async () => {
                try {
                  mobileCheck(PNum);
                  discCheck(Disc);
                  NameCheck(UserName);
                  (mobileCheck(PNum),
                  discCheck(Disc),
                  NameCheck(UserName))
                  if(!image) alert("Please enter a profile image.");
                  if(mobileCheck(PNum) && discCheck(Disc) && NameCheck(UserName) && (image)) {
                    
                    sendFirebaseData();
                    navigation.push('GameHub')
                  }
                } catch (error) {
                  
                  alert("Some data already exists or is missing. Please enter correct data.")
                  navigation.navigate("Login")
                }
              }
            }>
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
    width: "100%",
    height: 126 / 1024 * windowHeight,
    left: 0 / 1024 * windowWidth,
    top: 0 / 1440 * windowHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  whitebg:
  {
    position: "absolute",
    width: 405 / 1440 * windowWidth,
    height: 670 / 1024 * windowHeight,
    left: 517 / 1440 * windowWidth,
    top: 160 / 1024 * windowHeight,
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
    top: 0.005*windowHeight,
    height: 32/1024*windowHeight,
    width: 305/1440*windowWidth,
    color: 'white',
    fontSize: 27,
    lineHeight: 32,
    textAlign: 'center',
  },

  CamIcon: {
    position: "absolute",
    resizeMode:"contain",
    width: 0.12*windowWidth,
    height: 0.12*windowHeight,
    top: -0.25*windowHeight,
    left: -0.06*windowWidth
  },

  ProfileImage: {
    position: "absolute",
    // resizeMode:"contain",
    width: 0.07*windowWidth,
    height: 0.13*windowHeight,
    top: -0.25*windowHeight,
    left: -0.035*windowWidth,
    overflow:'hidden',
    borderRadius: '45%'
  },

  InputStyle1: {
    "position": "absolute",
    top: 250 / 1024 * windowHeight,
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
    top: 325 / 1024 * windowHeight,
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
    top: 400 / 1024 * windowHeight,
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
    top: 475 / 1024 * windowHeight,
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
    top: 0.55 * windowHeight,
    color: "#FFFFFF",
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
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 23.45,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#FFFFFF"
  },
  LocSuggestions:{
    position:'absolute',
    top: 0.45 * windowHeight,
    flexGrow: 0,
    width: 305 / 1440 * windowWidth,
    backgroundColor: 'rgba(255, 255, 255,1)',
    zIndex:1,
  },
  itemText: {
    fontSize: 15,
    paddingLeft: 10
  },
  item: {
    width: 305 / 1440 * windowWidth,
    paddingTop:10
  },
});