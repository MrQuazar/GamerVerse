import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Text, TextInput, Modal, Alert, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as strRef, uploadBytes, getDownloadURL } from "firebase/storage";
import fire from '../firebase';
import 'firebase/database'
import { getDatabase, onValue, ref, query, orderByChild, equalTo, update, set, startAt, get, endAt } from "firebase/database";
import 'firebase/auth';
import { getAuth } from "firebase/auth";


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;


export default function myPosts({ navigation }) {

    const auth = getAuth();
    const db = getDatabase();

    const [reset, setReset] = useState(0);
    const [games, setGames] = React.useState(null);
    const [selectGameName, setSelectGameName] = useState(null);
    const [gamesCode, setGamesCode] = React.useState([]);
    const [description, setDescription] = useState(null)
    const [userName, setUserName] = useState(null);
    const [userUid, setUserUid] = useState(null);
    const [postNumber, setPostNumber] = React.useState([]);
    const [postImage, setPostImage] = React.useState([]);
    const [selectGameCode, setSelectGameCode] = useState(null);
    const [profileImage, setProfileImage] = React.useState([]);
    var [latestPosts, setLatestPosts] = useState([]);


    const GameRef = query(ref(db, 'games'))
    const UserRef1 = query(ref(db, 'users/' + auth.currentUser.uid + '/Games'))
    const UserName = query(ref(db, 'users/' + auth.currentUser.uid + '/Name'))
    const UidRef = query(ref(db, 'users/' + auth.currentUser.uid + '/uid'))
    const PostCounter = query(ref(db, 'users/' + auth.currentUser.uid + '/PostCount'));
    const PostCounter1 = query(ref(db, 'users/' + auth.currentUser.uid));
    const PostCounter3 = query(ref(db, 'users/' + auth.currentUser.uid + '/PostCount'));
    const PostRef = query(ref(db, 'posts'));
    const ProfileRef1 = query(ref(db, 'users/' + auth.currentUser.uid + '/DisplayPicture'));
    const UserRef = query(ref(db, 'users/' + auth.currentUser.uid + '/RequestedProfiles'))
    const ConfirmedProfilesRef = query(ref(db, 'users/' + auth.currentUser.uid + '/ConfirmedProfiles'))
    const ThisProfileRef = query(ref(db, 'users/' + auth.currentUser.uid))
    const ProfileRef = query(ref(db, 'users'))



    React.useEffect(() => {
        // onValue(UserRef, (snapshot) => {
        //     const data = Object.values(snapshot.val());
        //     setIncomingRequests(data)
        //     // console.log(data)
        // }
        // )
        // onValue(ProfileRef, (snapshot) => {
        //     const data1 = Object.values(snapshot.val());
        //     setUsers(data1)
        //     // console.log(data1)
        // }
        // )
        // onValue(ConfirmedProfilesRef, (snapshot) => {
        //     const data2 = Object.values(snapshot.val());
        //     setFriends(data2)
        //     // console.log(data1)
        // }
        // )

        onValue(GameRef, (snapshot) => {
            const info = Object.values(snapshot.val());
            setGames(info)
            console.log(info)
        })

        onValue(UserRef1, (snapshot) => {
            console.log(snapshot.val())
            if (snapshot.val()) {
                const data1 = Object.values(snapshot.val());
                setGamesCode(data1)
            }
        }
        )

        onValue(UserName, (snapshot) => {
            const info2 = snapshot.val();
            setUserName(info2)
            console.log(info2)
        }
        )

        onValue(UidRef, (snapshot) => {
            const id = snapshot.val();
            setUserUid(id)
        }
        )

        onValue(PostCounter3, (snapshot) => {
            const info4 = snapshot.val();
            setPostNumber(info4)
            console.log(info4)
        }
        )

        onValue(PostRef, (snapshot) => {
            const info5 = Object.values(snapshot.val());
            // setPostImage(Object.values(data5[0]))
            // console.log(Object.values(data5[0]))
            setPostImage(info5)
        }
        )

        onValue(ProfileRef1, (snapshot) => {
            const info6 = snapshot.val();
            setProfileImage(info6)
            console.log(info6)
        }
        )
    }, [])




    return(
        <View style={styles.container} >
            <LinearGradient
                start={{ x: 0, y: 1 }} end={{ x: 0, y: -1 }}
                colors={['#013C00', '#000000']}
                style={styles.background} >
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdesignspikes1.png?alt=media&token=40fb8f39-0720-4688-917e-c02817598a01"} style={styles.spike1} />
                <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Flogo.png?alt=media&token=7468c404-5678-43b2-92eb-310ffa58433c"} style={styles.title} onPress={() => navigation.push("Home")} />
                <TouchableOpacity style={styles.logout} onPress={() => signOutUser()}>
                    <Text style={styles.uploadText}>Log Out</Text>
                </TouchableOpacity>
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2FMenuBar.png?alt=media&token=d9c15cc1-98a6-41b8-a5f9-533a2f5d1f7b"} style={styles.menu} />
                <TouchableOpacity style={styles.homebtn} onPress={() => navigation.push("Home")}>
                    <Text style={styles.highlighttxt}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profilebtn} onPress={() => navigation.push("Profile")}>
                    <Text style={styles.robototxt}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mygamesbtn} onPress={() => navigation.push("MyGames")}>
                    <Text style={styles.robototxt}>My Games</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gamehubbtn} onPress={() => navigation.push("GameHub")}>
                    <Text style={styles.robototxt}>Game Hub</Text>
                </TouchableOpacity>
                <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2FsearchIcon.png?alt=media&token=f31e94f7-0772-4713-8472-caf11d49a78d"} style={styles.searchIcon} />
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdesignspikes.png?alt=media&token=a8871878-f2d0-4fa7-b74c-992a8fbe695e"} style={styles.spike2} />


                <ScrollView contentContainerStyle={{ justifyContent: 'space-around' }} style={styles.postContainer} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    {postImage.map((item, index) => {

                        return(
                            <View key={index}>
                                {
                                    Object.values(item).map((newItem, newIndex) => {

                                        if (gamesCode.includes(newItem.GameCode)) {
                                            if ((!(newItem.User))) {
                                                get(query(ref(db, 'users'), orderByChild('uid'), equalTo(newItem.uid))).then((snapshot) => {
                                                    var postUserData = Object.values(snapshot.val())
                                                    newItem['User'] = postUserData[0].Name
                                                    newItem.DisplayProfile = postUserData[0].DisplayPicture
                                                    setReset(reset + 0.1)
                                                }
                                                )
                                            }
                                            // var LikeRef = query(ref(db, 'posts/' + newItem.uid + '/Post' + newItem.PostNumber + '/Likes'))
                                            // var likeData;
                                            // onValue(LikeRef, (snapshot) => {
                                            //     console.log(LikeRef)
                                            //     likeData = Object.values(snapshot.val());

                                            //     console.log(likeData)

                                            // }
                                            // );

                                            if(newItem.uid.includes(auth.currentUser.uid))
                                            {
                                                return(
                                                    <View style={styles.allPost}>
                                                        <Text style={styles.profileName}>{newItem.User}</Text>
                                                        <Image source={newItem.DisplayProfile} style={styles.profile} />

                                                        <Image source={newItem.Image} style={styles.post} />
                                                        <Text style={styles.displayDescription}>{newItem.Description}</Text>

                                                        <View style={styles.nameGameContainer}>
                                                            <Text style={styles.nameGame}>{newItem.GameName}</Text>
                                                        </View>


                                                    </View>

                                                )
                                            }


                                        }
                                    }
                                    
                                    )
                                }
                            </View>
                        )
                    }
                    )}
                </ScrollView>


            </LinearGradient>

        </View>  
    )

}


const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: 'hidden',
    },

    background: {
        position: "relative",
        width: windowWidth,
        height: windowHeight,
    },

    loading: {
        minHeight: 100 / 1024 * windowHeight,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
    },

    InputStyle1: {
        "position": "absolute",
        top: 107 / 1024 * windowHeight,
        right: 85 / 1440 * windowWidth,
        height: 42 / 1024 * windowHeight,
        width: 305 / 1440 * windowWidth,
        color: 'white',
        fontSize: 17,
        paddingLeft: 10,
        paddingBottom: 2,
        paddingTop: 3,
        borderBottomColor: "#FFFFFF",
        borderBottomWidth: 1,
        placeholderTextColor: "#FFFFFF",
        backgroundColor: "#e5e5e500"
    },

    title: {
        position: "absolute",
        left: 0.35 * windowWidth,
        resizeMode: 'contain',
        height: 0.1 * windowHeight,
        width: 0.35 * windowWidth,
    },

    robototxt: {
        "fontStyle": "normal",
        "fontWeight": "500",
        "fontSize": 14,
        "color": "#FFFFFF"
    },

    highlighttxt: {
        "fontStyle": "normal",
        "fontWeight": "500",
        "fontSize": 15,
        borderBottomColor: "#FFFFFF",
        borderBottomWidth: 1,
        "color": "#FFFFFF"
    },

    nametxt: {
        "fontStyle": "normal",
        "fontWeight": "500",
        "fontSize": 18,
        "color": "#FFFFFF",
        position: 'absolute',
        top: 0.005 * windowHeight,
        left: 0.02 * windowWidth,
        width: 0.08 * windowWidth,
        // height: 0.005 * windowHeight,
        lineHeight: 23,
        // backgroundColor: 'rgba(255, 255, 255,0.5)',
    },

    posttxt: {
        "fontStyle": "normal",
        "fontWeight": "500",
        "fontSize": 18,
        "color": "#FFFFFF",
        position: 'absolute',
        top: 0.21 * windowHeight,
        left: 0.3 * windowWidth
    },

    decisionbutton: {
        position: "absolute",
        width: 55 / 1440 * windowWidth,
        height: 25 / 1024 * windowHeight,
        // left: 165 / 1440 * windowWidth,
        color: '#FFFFFF',
        textAlign: 'center',
        top: 15 / 1024 * windowHeight,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    text1: {
        "fontStyle": "normal",
        "fontWeight": "bold",
        "fontSize": 18,
        "color": "#000000",
    },
    text2: {
        "fontStyle": "normal",
        "fontWeight": "bold",
        "fontSize": 18,
        "color": "white",
    },

    text2: {
        "fontStyle": "normal",
        "fontWeight": "bold",
        "fontSize": 18,
        "color": "white",
    },

    homebtn: {
        position: "absolute",
        top: 0.107 * windowHeight,
        left: 0.05 * windowWidth,
        height: 0.03 * windowHeight,
    },

    profilebtn: {
        position: "absolute",
        top: 0.11 * windowHeight,
        left: 0.20 * windowWidth,
        height: 0.03 * windowHeight,
        width: 0.03 * windowWidth
    },

    mygamesbtn: {
        position: "absolute",
        top: 0.11 * windowHeight,
        left: 0.35 * windowWidth,
        height: 0.03 * windowHeight,
        width: 0.05 * windowWidth
    },

    gamehubbtn: {
        position: "absolute",
        top: 0.11 * windowHeight,
        left: 0.50 * windowWidth,
        height: 0.03 * windowHeight,
        width: 0.05 * windowWidth
    },

    menu: {
        position: "absolute",
        resizeMode: 'contain',
        top: 0.10 * windowHeight,
        height: 0.05 * windowHeight,
        width: 1 * windowWidth,
    },

    searchIcon: {
        position: "absolute",
        resizeMode: 'contain',
        top: 0.11 * windowHeight,
        left: 0.7 * windowWidth,
        height: 0.03 * windowHeight,
        width: 0.03 * windowWidth,
    },

    spike1: {
        position: "absolute",
        resizeMode: 'contain',
        right: "0px",
        height: 0.2 * windowHeight,
        width: 0.15 * windowWidth,
    },

    spike2: {
        position: "absolute",
        bottom: "0px",
        resizeMode: 'contain',
        height: 0.2 * windowHeight,
        width: 0.15 * windowWidth,
    },

    postContainer: {
        position: 'absolute',
        width: 0.9 * windowWidth,
        height: 0.9 * windowHeight,
        top: 0.18 * windowHeight,
        left: 0.05 * windowWidth,
        // backgroundColor: 'red',
        flexGrow: 0.1
    },

    allPost: {
        // position: 'absolute',
        width: 0.87 * windowWidth,
        height: 0.85 * windowHeight,
        top: 0.01 * windowHeight,
        left: 0.01 * windowWidth,
        // backgroundColor: 'cyan',
        flexGrow: 0.1
    },

    post: {
        // position: 'absolute',
        resizeMode: 'contain',
        // width: 0.85 * windowWidth,
        // height: 0.52 * windowHeight,
        left: 0.01 * windowWidth,
        marginTop: 0.12 * windowHeight,
        // marginTop: '50px',
        width: '100%',
        height: '100%',
        flexGrow: 0.1

    },

    likeImage: {
        position: 'absolute',
        resizeMode: 'contain',
        width: '100%',
        height: '100%'
    },

    whiteLikeImage:{
        position: 'absolute',
        // resizeMode: 'contain',
        width: 0.045*windowWidth,
        height: 0.045*windowHeight,
        left: 0.0001*windowWidth,
        marginTop: 0.01 * windowHeight,
        // width: '80%',
        // height: '80%',
        // marginBottom: '2px'
    },

    profile: {
        position: 'absolute',
        // resizeMode: 'contain',
        width: 0.05 * windowHeight,
        height: 0.05 * windowHeight,
        borderRadius: 0.065 * windowHeight,
        top: 0.01 * windowHeight,
        left: 0.01 * windowWidth,
        
    },

    profileName: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 22,
        paddingLeft: 0.047 * windowWidth,
        top: 0.0157 * windowHeight,
        
    },

    nameGameContainer: {
        position: 'absolute',
        top: 0.063 * windowHeight,
        // paddingLeft: '20px',
        
        
        left: 0.02 * windowWidth,
        backgroundColor: 'blue'
    },

    nameGame: {
        // position: 'absolute',
        color: 'grey',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,

    },

    displayDescription: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'normal',
        textAlign: 'center',
        fontSize: 16,
        paddingLeft: '20px',
        // marginTop: '15px',
        top: 0.09 * windowHeight,
        left: 0.01 * windowWidth,
        flexGrow: 0.1
    },

})