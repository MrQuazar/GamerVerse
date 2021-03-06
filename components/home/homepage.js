import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, Text, TextInput, Modal, Alert, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as strRef, uploadBytes, getDownloadURL } from "firebase/storage";
import fire from '../firebase';
import 'firebase/database'
import { getDatabase, onValue, ref, query, orderByChild, equalTo, update, set, startAt, get, endAt,push, connectDatabaseEmulator } from "firebase/database";
import 'firebase/auth';
import { getAuth } from "firebase/auth";


// import fire from '../firebase';
// import 'firebase/database'
// import { getDatabase, onValue,get,ref,query, orderByChild, equalTo, push ,update ,set} from "firebase/database";
// import 'firebase/auth';
// import { getAuth } from "firebase/auth";


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

// const createExpoWebpackConfigAsync = require('@expo/webpack-config');
// module.exports = async function(env, argv) {
//   const config = await createExpoWebpackConfigAsync(env, argv);
//   config.resolve.alias['lottie-react-native'] = 'react-native-web-lottie';
//   return config;
// };

export default function homepage({ navigation, route }) {
    const auth = getAuth();
    const db = getDatabase();

    const storage = getStorage();
    const metadata = {
        contentType: 'image/jpg',
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [reset, setReset] = useState(0);
    const [reset1, setReset1] = useState(0);
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

    var profileUid = auth.currentUser.uid;
    const [textInputValue, setTextInputValue] = React.useState('');
    var [friends, setFriends] = React.useState(null);

    



    var [IncomingRequests, setIncomingRequests] = React.useState(null);
    var [friendIncomingRequests, setFriendIncomingRequests] = React.useState(null);
    var [friends, setFriends] = React.useState(null);
    const [users, setUsers] = React.useState(null);
    var requestNames = [];
    var requestImages = [];
    var requestUID = [];
    var friendNames = [];
    var friendImages = [];
    var friendUid = [];
    var acceptedProfiles = [];
    var rejectedProfiles = [];
    var likes = ["XX"]


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
    // const [users, setUsers] = React.useState(null);
    const [location, setLocation] = React.useState(null);
    const [selectedValue, setSelectedValue] = React.useState()
    React.useEffect(() => {
        onValue(UserRef, (snapshot) => {
            const data = Object.values(snapshot.val());
            setIncomingRequests(data)
           
        }
        )
        onValue(ProfileRef, (snapshot) => {
            const data1 = Object.values(snapshot.val());
            setUsers(data1)
           
        }
        )
        onValue(ConfirmedProfilesRef, (snapshot) => {
            const data2 = Object.values(snapshot.val());
            setFriends(data2)
           
        }
        )

        onValue(GameRef, (snapshot) => {
            const info = Object.values(snapshot.val());
            setGames(info)
            
        })

        onValue(UserRef1, (snapshot) => {
            
            if (snapshot.val()) {
                const data1 = Object.values(snapshot.val());
                setGamesCode(data1)
            }
        }
        )

        onValue(UserName, (snapshot) => {
            const info2 = snapshot.val();
            setUserName(info2)
            
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
            
        }
        )

        onValue(PostRef, (snapshot) => {
            const info5 = Object.values(snapshot.val());
            // setPostImage(Object.values(data5[0]))
            
            setPostImage(info5)
        }
        )

        onValue(ProfileRef1, (snapshot) => {
            const info6 = snapshot.val();
            setProfileImage(info6)
            
        }
        )
    }, [])
    

    function requestAccepted(requestUID) {
        var y = requestUID;
        if (!friends.includes(y)) {
            friends.push(y);
            requestDenied(y);
            update(ThisProfileRef, {
                RequestedProfiles: IncomingRequests,
            });
            var FriendProfileRef = query(ref(db, 'users/' + y + '/ConfirmedProfiles'))
            var FriendProfileUpdateRef = query(ref(db, 'users/' + y))
            get(FriendProfileRef).then((snapshot) => {
                const data3 = Object.values(snapshot.val());
                data3.push(auth.currentUser.uid)
                
                update(FriendProfileUpdateRef, {
                    ConfirmedProfiles: data3,
                });
            }
            )
            // update(FriendProfileRef, {
            //     RequestedProfiles: auth.currentUser.uid,
            //   });  
        }
    }

    function requestDenied(requestUID) {
        var toRemove = requestUID;
        
        var index = IncomingRequests.indexOf(toRemove);
        if (index > -1) {
            IncomingRequests.splice(index, 1);
        }
    }

    var handleSearch = (e) => {
        if (e.nativeEvent.key == 'Enter' && textInputValue.length>0 && textInputValue!=" ") {
            navigation.push("SearchPage", { textInputValue })
        
        }
    }

    const getLocations = async (loc) => {
        if (loc) {
            const UserRef = query(ref(db, 'locations'), orderByChild('LocationLower'), startAt(loc), endAt(loc + "\uf8ff"))
            onValue(UserRef, (snapshot) => {
                if (snapshot.val()) {
                    setLocation(Object.values(snapshot.val()))
                }
            })
        }
    }

    function renderSug() {
        if (!selectedValue) {
            
            return (<FlatList

                data={location}
                style={styles.LocSuggestions}
                keyExtractor={(item) => item.magicKey}
                renderItem={(suggestion) => {
                    return (
                        <TouchableOpacity style={styles.item} onPress={() => {
                            setSelectedValue(suggestion.item.Location)
                            navigation.push("SearchPage", { textInputValue: suggestion.item.Location })
                        }

                        }>
                            <Text style={styles.itemText}>{suggestion.item.Location}</Text>
                        </TouchableOpacity>)
                }}


            ></FlatList>)
        }
    }

    if (users && IncomingRequests) {
        for (var i = 1; i < users.length; i++) {
            var x = users[i].uid;
            
            if (IncomingRequests.includes(x)) {
                requestNames.push(users[i].Name);
                requestImages.push(users[i].DisplayPicture);
                requestUID.push(users[i].uid);

            }
        }
        
    }



    if (!users) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    start={{ x: 0, y: 1 }} end={{ x: 0, y: -1 }}
                    colors={['#013C00', '#000000']}
                    style={[styles.background,{width: '100%', height: '100%'}]} >
                    <ActivityIndicator size="large" color="#00ff00" style={{ top: "40%" }} />
                    {/* <View style={styles.loading}>
                    </View> */}
                </LinearGradient>
            </View>
        )
    }

    if (users) {
        if (friends) {
            for (var i = 0; i < users.length; i++) {
                var x = users[i].uid;
                
                if (friends.includes(x)) {
                    friendNames.push(users[i].Name);
                    friendImages.push(users[i].DisplayPicture);
                    friendUid.push(users[i].uid);
                }
            }
            
        }


        // const auth = getAuth();
        // const db = getDatabase();



        // var userid = ''
        // const dbRef = ref(db,'posts/Post1')

        





        const likePhoto = 'https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Post%2FLike.png?alt=media&token=bfce5738-8e63-4bb3-8841-212c7fef39d6'
        const white = 'https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2FwhiteLike.png?alt=media&token=e0746851-94cf-424a-9541-684544a056ce'

        const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            

            if (!result.cancelled) {
                setImage(result.uri);
            }
        };

        async function uploadPost() {
            const response = await fetch(image);
            const blob = await response.blob();

            get(PostCounter).then((snapshot) => {
                var upl3 = snapshot.val();
                upl3 = upl3 + 1;
                
                var storageRef = strRef(storage, 'Post/' + auth.currentUser.uid + '_' + upl3 + '.jpg');
                const dbRef = ref(db, 'posts/' + auth.currentUser.uid + '/Post' + postNumber)
                uploadBytes(storageRef, blob, metadata).then((snapshot) => {
                    getDownloadURL(storageRef).then((url) => {
                        set(dbRef, {
                            Description: description,
                            GameName: selectGameName,
                            GameCode: selectGameCode,
                            Image: url,
                            LikeImage: likePhoto,
                            WhiteLike: white,
                            Likes: ['XX'],
                            // User: userName,
                            PostNumber: postNumber,
                            uid: auth.currentUser.uid
                        })
                    })

                    
                });
                
                update(PostCounter1, {
                    PostCount: upl3,
                });
            }
            )


        }




        const signOutUser = async () => {
            try {
                await auth.signOut();
                navigation.push("Login");

            } catch (e) {
                Alert.alert("Could not Logout");
                
            }
        }
        if (!games || !latestPosts) {
            return (
                <View style={styles.container}>
                <LinearGradient
                    start={{ x: 0, y: 1 }} end={{ x: 0, y: -1 }}
                    colors={['#013C00', '#000000']}
                    style={[styles.background,{width: '100%', height: '100%'}]} >
                    <ActivityIndicator size="large" color="#00ff00" style={{ top: "40%" }} />
                    {/* <View style={styles.loading}>
                    </View> */}
                </LinearGradient>
            </View>
            )
    }
    return (
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
                <TouchableOpacity style={styles.profilebtn} onPress={() => {
                    // navigation.pop();
                    navigation.push("Profile");
                }}>
                    <Text style={styles.robototxt}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mygamesbtn} onPress={() => navigation.push("MyGames")}>
                    <Text style={styles.robototxt}>My Games</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gamehubbtn} onPress={() => navigation.push("GameHub")}>
                    <Text style={styles.robototxt}>Game Hub</Text>
                    </TouchableOpacity>
                    <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2FsearchIcon.png?alt=media&token=f31e94f7-0772-4713-8472-caf11d49a78d"} style={styles.searchIcon} />
                    <TextInput 
                    style={styles.InputStyle1} 
                    placeholder='Search for friends, games or location'
                    onChangeText={(text) => {
                        setLocation(undefined)
                        getLocations(text.toLocaleLowerCase())
                        setTextInputValue(text)}}
                    value={textInputValue}
                    onKeyPress={e => handleSearch(e)}
                    onBlur={()=>{
                        if(!selectedValue){
                            setTimeout(()=>
                                setSelectedValue("x"),300)
                        }}}
                    onFocus={() => {
                        if(selectedValue)
                            setSelectedValue(undefined)
                        }}
                    ></TextInput>
                    {renderSug()}
                    <View style={styles.notif}>
                        <Image style={{
                            position: 'absolute',
                            resizeMode: 'contain',
                            top: -0.008 * windowHeight,
                            left: -0.008 * windowWidth,
                            width: 0.07 * windowWidth,
                            height: 0.07 * windowHeight,
                        }} source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Ffrands.png?alt=media&token=93a5de65-97d2-45fc-88b9-6a845aa612c0"} />
                        <Text style={{
                            position: 'absolute',
                            left: 0.045 * windowWidth,
                            top: 0.016 * windowHeight,
                            color: 'white',
                            fontWeight: 'bold'
                        }}>Friend Requests</Text>
                        <ScrollView contentContainerStyle={{ justifyContent: 'space-around' }}
                            style={styles.notifscroll} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                            {requestNames.map((profile, index) => {
                                {
                                    
                                }
                                return (
                                    <View key={index} style={styles.notifbox}>
                                        {/* <Text style={{
                                position: 'relative',
                                "color": "#FFFFFF",
                                }}>
                                Friend Request by:</Text> */}
                                        <View style={{ position: 'relative', flex: 1, flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => navigation.push("SearchProfile", requestUID[index])}>
                                            <Image source={requestImages[index]} style={{
                                                position: "absolute",
                                                top: 0 * windowHeight,
                                                left: 0 * windowWidth,
                                                width: 0.05 * windowHeight,
                                                height: 0.05 * windowHeight,
                                                borderRadius: 0.065 * windowHeight,
                                            }} />
                                            <Text style={{
                                                position: 'absolute',
                                                left: 0.045 * windowWidth,
                                                width: 0.07 * windowWidth,
                                                "color": "#FFFFFF",
                                            }}>{profile} sent a friend request!</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.notifdecisionbox}>
                                            <TouchableOpacity onPress={() => {
                                                if (requestAccepted(requestUID[index]));
                                                update(ThisProfileRef, {
                                                    ConfirmedProfiles: friends,
                                                });
                                            }} ><Text style={[styles.decisionbutton, { backgroundColor: "rgba(3, 184, 21, 1)" }]}>Accept</Text></TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (IncomingRequests.includes(requestUID[index])) requestDenied(requestUID[index]);
                                                    update(ThisProfileRef, {
                                                        RequestedProfiles: IncomingRequests,
                                                    });
                                                }}><Text style={[styles.decisionbutton, { backgroundColor: "rgba(255, 255, 255, 0.25)" }, { left: -0.03 * windowWidth }]}>Decline</Text></TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })
                            }
                        </ScrollView>
                    </View>
                    {/* <Image source={require('./homeAssets/post2.png')} style={styles.posts} /> */}
                    <ScrollView contentContainerStyle= {{justifyContent:'space-around'}} 
                    style={styles.friendscroll} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    {friendNames.map((profile,index)=>
                        {
                        return(
                        <View  key={index} style={styles.friendbox}>
                            <TouchableOpacity onPress={() => navigation.push("SearchProfile", friendUid[index])}>
                                <Image source={friendImages[index]} style={styles.dpview}/>
                                <View style={{position: 'absolute',top: 0.005 * windowHeight,left: 0.007 * windowWidth,}}><Text style={styles.nametxt} numberOfLines={1}>{profile}</Text></View>
                            </TouchableOpacity> 
                        </View>
                        )
                    })
                    }
                    </ScrollView>
                    
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdivider.png?alt=media&token=458aa29f-e202-4bab-8393-3a7fb6994608"} style={styles.divider} />
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdesignspikes.png?alt=media&token=a8871878-f2d0-4fa7-b74c-992a8fbe695e"} style={styles.spike2} />

                    {/* {games.map((item, index) => {
                        if(gamesCode.includes(item.Code))
                        {
                            setGameNames(item.Name)
                        }
                    })} */}



                    <ScrollView contentContainerStyle={{ justifyContent: 'space-around' }} style={styles.postContainer} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        {postImage.map((item, index) => {
                            


                            return (
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
                                                var LikeRef = query(ref(db, 'posts/' + newItem.uid + '/Post' + newItem.PostNumber + '/Likes'))
                                                var likeData;
                                                onValue(LikeRef, (snapshot) => {
                                                    if(snapshot.exists())
                                                    {likeData = Object.values(snapshot.val());}
                                                }
                                                );


                                                function checkLikes(userid) {
                                                   
                                                    for (var i = 0; i < likeData.length; i++) {
                                                        if (userid == likes[i]) return false;
                                                    }
                                                    return true;
                                                }
                                            if(newItem.Likes.includes(auth.currentUser.uid))
                                            {
                                                return (
                                                    <View style={styles.allPost}>
                                                    <TouchableOpacity onPress={() => navigation.push("SearchProfile", newItem.uid)}>
                                                        <Text style={styles.profileName}>{newItem.User}</Text>
                                                        <Image source={newItem.DisplayProfile} style={styles.profile} />
                                                        
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => 
                                                        {
                                                            var ReportPostRef = query(ref(db,'reported/reportedposts/'+newItem.uid+"'s Post "+newItem.PostNumber))
                                                            var reportConfirmation =confirm("Are you sure want to report this post?") 
                                                            if(reportConfirmation) {
                                                            alert("Report has been considered. Admin will check this post in a short while and take necessary actions")
                                                                push(ReportPostRef,{
                                                                    reporter: auth.currentUser.uid,
                                                                });  
                                                            }
                                                            else{
                                                                
                                                                }
                                                        }}>
                                                        <Text style={styles.reportstyle}>Report</Text>
                                                    </TouchableOpacity>
                                                    <Image source={newItem.Image} style={styles.post} />
                                                    <Text style={styles.displayDescription} numberOfLines={2}>{newItem.Description}</Text>
                                                    
                                                        <View style={styles.nameGameContainer}>
                                                            <Text style={styles.nameGame}>{newItem.GameName}</Text>
                                                        </View>
                                                        
                                                    
                                                        <TouchableOpacity
                                                            style={{
                                                                position: 'absolute',
                                                                width: 0.053 * windowWidth,
                                                                height: 0.053 * windowHeight,
                                                                top: 0.58 * windowHeight,
                                                                left: 0.006 * windowWidth,
                                                            }}
                                                            onPress={() => {
                                                                
                                                                if (!newItem.Likes.includes(auth.currentUser.uid)) {
                                                                    if (checkLikes(auth.currentUser.uid)) likeData.push(auth.currentUser.uid);

                                                                    update(query(ref(db, 'posts/' + newItem.uid + '/Post' + newItem.PostNumber)), {
                                                                        Likes: likeData
                                                                    })
                                                                }
                                                                else {
                                                                    var ind = likeData.indexOf(auth.currentUser.uid)
                                                                    likeData.splice(ind, 1)
                                                                    update(query(ref(db, 'posts/' + newItem.uid + '/Post' + newItem.PostNumber)), {
                                                                        Likes: likeData
                                                                    })
                                                                }
                                                            }}
                                                        >
                                                           <Image source={newItem.LikeImage} style={styles.likeImage} /> 
                                                        <Text style={styles.likestext}>{newItem.Likes.length - 1}</Text>
                                                        </TouchableOpacity>
                                                        
                                                            
                                                    </View>
                                                )
                                            }
                                            else{
                                                return (
                                                    <View style={styles.allPost}>
                                                        <TouchableOpacity onPress={() => navigation.push("SearchProfile", newItem.uid)}>
                                                        <Text style={styles.profileName}>{newItem.User}</Text>
                                                        <Image source={newItem.DisplayProfile} style={styles.profile} />
                                                       
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => 
                                                            {
                                                                var ReportPostRef = query(ref(db,'reported/reportedposts/'+newItem.uid+"'s Post "+newItem.PostNumber))
                                                                var reportConfirmation =confirm("Are you sure want to report this post?") 
                                                                if(reportConfirmation) {
                                                                alert("Report has been considered. Admin will check this post in a short while and take necessary actions")
                                                                    push(ReportPostRef,{
                                                                        reporter: auth.currentUser.uid,
                                                                    });  
                                                                }
                                                                else{
                                                                    
                                                                    }
                                                            }}>
                                                        <Text style={styles.reportstyle}>Report</Text>
                                                        </TouchableOpacity>
                                                        <Image source={newItem.Image} style={styles.post} />
                                                        <Text style={styles.displayDescription}>{newItem.Description}</Text>
                                                        <View style={styles.nameGameContainer}>
                                                            <Text style={styles.nameGame}>{newItem.GameName}</Text>
                                                        </View>
                                                        {/* <Image source={require('./homeAssets/Like.png')} style={styles.likeImage} /> */}
                                                    
                                                        <TouchableOpacity
                                                            style={{
                                                                position: 'absolute',
                                                                width: 0.051 * windowWidth,
                                                                height: 0.053 * windowHeight,
                                                                top: 0.58 * windowHeight,
                                                                left: 0.009 * windowWidth,
                                                            }}
                                                            onPress={() => {
                                                                
                                                                if (!newItem.Likes.includes(auth.currentUser.uid)) {
                                                                    if (checkLikes(auth.currentUser.uid)) likeData.push(auth.currentUser.uid);

                                                                    update(query(ref(db, 'posts/' + newItem.uid + '/Post' + newItem.PostNumber)), {
                                                                        Likes: likeData
                                                                    })
                                                                    
                                                                }
                                                                else {
                                                                    var ind = likeData.indexOf(auth.currentUser.uid)
                                                                    likeData.splice(ind, 1)
                                                                    update(query(ref(db, 'posts/' + newItem.uid + '/Post' + newItem.PostNumber)), {
                                                                        Likes: likeData
                                                                    })
                                                                }
                                                            }}
                                                        >
                                                            <Image source={newItem.WhiteLike} style={styles.whiteLikeImage} />   
                                                        <Text style={styles.likestext}>{newItem.Likes.length - 1}</Text>
                                                        </TouchableOpacity>
                                                        
                                                        
                                                    </View>
                                                )
                                            }
                                        }
                                        })
                                    }
                                    

                                </View>
                            )

                        })}
                    </ScrollView>


                    <TouchableOpacity style={styles.upload} onPress={() => setModalVisible(true)}>
                        <Text style={styles.uploadText}>Upload a Post</Text>
                    </TouchableOpacity>


                    <Modal
                        animationType='slide'
                        visible={modalVisible}
                        transparent={true}
                        onRequestClose={() => {
                            Alert.alert("Post will be uploaded in some time.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                {/* <View> */}
                                <TextInput placeholder='Caption for your post' maxLength={240}
                                    style={styles.textInput} onChangeText={description => setDescription(description)}
                                />
                                {/* </View> */}
                                {/* <Image source={require('./homeAssets/divider.png')} style={styles.divider1} /> */}
                                <TouchableOpacity style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setImage(null);
                                        setDescription(null);
                                        setSelectGameName(null);
                                    }}
                                >
                                    <Text style={styles.text1}>Cancel</Text>
                                </TouchableOpacity>

                                {/* Upload to FireBase       */}

                                <TouchableOpacity style={[styles.button, styles.uploadButton]}
                                    onPress={
                                        async () => {
                                            try {
                                                if(!image) alert("Please choose image.");
                                                if(!selectGameName) alert("Please choose game.");
                                                if((image) && (selectGameName))
                                                {
                                                    uploadPost();
                                                    alert("Uploaded Successfully");
                                                    setModalVisible(!modalVisible);
                                                    // setReset1(reset + 0.1);
                                                    setImage(null);
                                                    setDescription(null);
                                                    setSelectGameName(null);
                                                    
                                                }
                                               
                                                

                                            } catch (error) {
                                                
                                                alert('Error')
                                            }
                                        }
                                    }
                                >
                                    <Text style={styles.text1}>Upload</Text>
                                </TouchableOpacity>

                                {/* Choose Image */}

                                <TouchableOpacity style={[styles.button, styles.chooseButton]}
                                    onPress={pickImage}
                                >
                                    <Text style={styles.text1}>Choose Image</Text>
                                    {image && <Image source={{ uri: image }} style={styles.selectedImage} />}
                                </TouchableOpacity>

                                <View style={styles.name}>
                                    <Text style={styles.text2}>Select Game: </Text>
                                </View>

                                <ScrollView style={styles.gameScrollContainer} vertical={true}>
                                    {games.map((item, index) => {
                                        if (gamesCode.includes(item.Code)) {

                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity style={styles.gameName}
                                                        onPress={() => {
                                                            setSelectGameName(item.Name)
                                                            setSelectGameCode(item.Code)
                                                            
                                                        }} >
                                                        <Text style={styles.gameText}>{item.Name}</Text>
                                                        {/* {setGameNames(item.Name)} */}
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                    }

                                    )}
                                </ScrollView>
                                <View style={styles.GC}>
                                    <Text style={styles.textgame2}>Selected Game</Text>
                                </View>
                                <View style={styles.selected}>
                                    <Text style={styles.textgame}>{selectGameName}</Text>
                                </View>

                            </View>
                        </View>
                    </Modal>
                </LinearGradient>
            </View>
        );

    }
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

    friendscroll: {
        position: "absolute",
        flexGrow: 0.1,
        width: 275 / 1440 * windowWidth,
        left: 5 / 1440 * windowWidth,
        height: 650 / 1024 * windowHeight,
        top: 200 / 1024 * windowHeight,
        borderRadius: 10,
        // backgroundColor: "rgba(255, 255, 255, 0.7)",
    },

    friendbox: {
        flex: 1,
        flexDirection: "column",
        marginVertical: 30,
        alignItems: "center",
        left: 0.05 * windowWidth,
        height: 0.08 * windowHeight,
        width: 0.015 * windowWidth,
        // backgroundColor: "rgba(255, 255, 255, 1)",
        transform: "matrix(1, 0, 0, 1, 0, 0)"
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
        // position: 'absolute',
        // top: 0.005 * windowHeight,
        // left: 0.007 * windowWidth,
        width: 0.113 * windowWidth,
        height: 0.03 * windowHeight,
        lineHeight: 18,
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
        "fontSize": 15,
        "color": "white",
    },

    textgame: {
        "fontStyle": "normal",
        "fontWeight": "bold",
        "fontSize": 15,
        "color": "black",
        textAlign: 'center'
    },

    textgame2: {
        "fontStyle": "normal",
        "fontWeight": "bold",
        "fontSize": 15,
        "color": "white",
        textAlign: 'center'
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

    LocSuggestions: {
        position: 'absolute',
        top: 150 / 1024 * windowHeight,
        right: 85 / 1440 * windowWidth,
        flexGrow: 0,
        width: 305 / 1440 * windowWidth,
        backgroundColor: 'rgba(255, 255, 255,1)',
        zIndex: 1,
    },

    itemText: {
        fontSize: 15,
        paddingLeft: 10
    },

    item: {
        width: 305 / 1440 * windowWidth,
        paddingTop: 10
    },

    posts: {
        position: "absolute",
        top: 0.3 * windowHeight,
        left: 0.25 * windowWidth,
        resizeMode: 'contain',
        height: 0.60 * windowHeight,
        width: 0.50 * windowWidth,
    },

    dpview: {
        position: "absolute",
        top: -0.005 * windowHeight,
        left: -0.033 * windowWidth,
        width: 0.05 * windowHeight,
        height: 0.05 * windowHeight,
        borderRadius: 0.065 * windowHeight,
    },

    dppostview: {
        position: "absolute",
        top: 0.2 * windowHeight,
        left: 0.25 * windowWidth,
        resizeMode: 'contain',
        height: 0.06 * windowHeight,
        width: 0.05 * windowWidth,
    },

    divider: {
        position: "absolute",
        top: 0.2 * windowHeight,
        left: 0.185 * windowWidth,
        resizeMode: 'contain',
        height: 0.7 * windowHeight,
        width: "3px",
    },

    reportstyle: {
        position: "absolute",
        top: 0.045 * windowHeight,
        right: 0.02 * windowWidth,
        height: 0.024 * windowHeight,
        width: 0.035 * windowWidth,
        textAlign: "center",
        "color": '#ffffff',
        backgroundColor: 'rgba(255, 69, 81,1)',
    },

    searchIcon: {
        position: "absolute",
        resizeMode: 'contain',
        top: 0.11 * windowHeight,
        left: 0.7 * windowWidth,
        height: 0.03 * windowHeight,
        width: 0.03 * windowWidth,
    },

    notif: {
        position: "absolute",
        flex: 1,
        top: 0.2 * windowHeight,
        left: 0.81 * windowWidth,
        height: (695 / 900) * windowHeight,
        width: (227 / 1600) * windowWidth,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderRadius: 10,
    },

    notifbox: {
        flex: 1,
        // flexDirection:"column",
        marginVertical: 50,
        // alignItems: "center",
        top: 0.02 * windowHeight,
        left: 0.005 * windowWidth,
        height: 0.7 * windowHeight,
        width: 0.13 * windowWidth,
        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 10,
    },

    notifdecisionbox: {
        position: "absolute",
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        top: 0.05 * windowHeight,
        left: 0.005 / 4 * windowWidth,
        height: 0.02 * windowHeight,
        width: 0.12 * windowWidth,
        borderRadius: 10,
    },


    notifscroll: {
        flexGrow: 0.1,
        height: '100%',
        width: '100%',
        borderRadius: 10,
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

    upload: {
        position: 'absolute',
        width: 0.09 * windowWidth,
        height: 0.03 * windowHeight,
        top: 0.17 * windowHeight,
        left: 0.7 * windowWidth,
        backgroundColor: 'green',
        textAlign: 'center',
        borderRadius: '2px'
    },

    logout: {
        position: 'absolute',
        width: 0.087 * windowWidth,
        height: 0.03 * windowHeight,
        top: 0.05 * windowHeight,
        left: 0.875 * windowWidth,
        backgroundColor: 'green',
        textAlign: 'center',
        borderRadius: '2px'
    },

    uploadText: {
        "fontStyle": 'normal',
        "fontSize": 15,
        "fontWeight": 'bold',
        "color": '#ffffff',
        paddingTop: "2px"
    },

    gameText: {
        "fontStyle": 'normal',
        "fontSize": 16,
        "fontWeight": '700',
        "color": '#000000',
        // paddingLeft: '10px',
        margin: '5px',
        textAlign: 'center'

    },

    gameName: {
        // position: 'absolute',
        // borderTopRightRadius:  60,
        // borderBottomRightRadius:  60,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#006400',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingTop: '5px',
        paddingBottom: '5px'
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    modalView: {
        margin: 20,
        // backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "black",
        borderRadius: 20,
        padding: 35,
        width: 0.6 * windowWidth,
        height: 0.6 * windowHeight,
        // width: '50%',
        // height: '70%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },

    uploadButton: {
        backgroundColor: 'white',
        height: 0.05 * windowHeight,
        width: 0.15 * windowWidth,
        left: -0.18 * windowWidth,
        top: 0.43 * windowHeight,
        textAlign: 'center'

    },

    chooseButton: {
        backgroundColor: 'white',
        height: 0.05 * windowHeight,
        width: 0.15 * windowWidth,
        // left: 0.05*windowWidth,
        top: 0.38 * windowHeight,
        alignContent: 'center',
        alignItems: 'center'
    },

    buttonClose: {
        backgroundColor: 'red',
        // height: '80px',
        // width: '100px',
        height: 0.05 * windowHeight,
        width: 0.15 * windowWidth,
        left: 0.18 * windowWidth,
        top: 0.48 * windowHeight,
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },

    textStyle: {
        // marginTop: '10px',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        // marginBottom: '10px'
    },

    selectedImage: {
        position: 'absolute',
        resizeMode: 'contain',
        width: 0.38 * windowWidth,
        height: 0.38 * windowHeight,
        bottom: 0.07 * windowHeight,
        left: -0.02 * windowWidth,
    },

    textInput: {
        position: 'absolute',
        width: 0.54 * windowWidth,
        height: 0.06 * windowHeight,
        paddingLeft: '15px',
        top: '15px',
        backgroundColor: 'white'
    },

    name: {
        position: 'absolute',
        // width: 0.15*windowWidth,
        // height: 0.*windowHeight,
        left: 0.02 * windowWidth,
        top: 0.17 * windowHeight
    },

    GC: {
        position: 'absolute',
        // width: 0.15*windowWidth,
        // height: 0.*windowHeight,
        left: 0.02 * windowWidth,
        top: 0.085 * windowHeight
    },

    selected:{
        position: 'absolute',
        width: 0.15 * windowWidth,
        height: 0.05 * windowHeight,
        left: 0.02 * windowWidth,
        top: 0.116 * windowHeight,
        borderColor: 'green',
        backgroundColor: 'white',
        textAlign: 'center'
    },

    gameScrollContainer: {
        position: 'absolute',
        width: 0.15 * windowWidth,
        height: 0.3 * windowHeight,
        left: 0.02 * windowWidth,
        top: 0.207 * windowHeight,
        // flexGrow: 0.1,
        // justifyContent: 'space-between',
        // backgroundColor: 'white'
    },

    postContainer: {
        position: 'absolute',
        width: 0.58 * windowWidth,
        height: 0.73 * windowHeight,
        top: 0.23 * windowHeight,
        left: 0.216 * windowWidth,
        // backgroundColor: 'red',
        flexGrow: 0.1
    },

    allPost: {
        // position: 'absolute',
        width: 0.55 * windowWidth,
        height: 0.65 * windowHeight,
        // paddingTop: '50px',
        marginTop: '20px',
        // backgroundColor: 'cyan',
        left: 0.01 * windowWidth,
        top: 0.01 * windowHeight,
        flexGrow: 0.1
        // width: '100%',
        // height: '100%',
    },

    post: {
        // position: 'absolute',
        resizeMode: 'contain',
        width: 0.52 * windowWidth,
        height: 0.52 * windowHeight,
        left: 0.01 * windowWidth,
        marginTop: 0.137 * windowHeight,
        // width: '100%',
        // height: '100%',
        // flexGrow: 0.1

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
        width: 0.042*windowWidth,
        height: 0.044*windowHeight,
        left: -0.002*windowWidth,
        marginTop: 0.007 * windowHeight,
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
        left: 0.047 * windowWidth,
        top: 0.0157 * windowHeight,
        flexGrow:0.1
    },

    textgame:{
        "fontStyle": "normal",
        "fontWeight": "bold",
        "fontSize": 15,
        "color": "black",
        textAlign: 'center'
        
    },

    nameGameContainer: {
        position: 'absolute',
        top: 0.055 * windowHeight,
        borderWidth:2,
        borderColor:"blue",
        left: 0.05 * windowWidth,
        // backgroundColor: 'rgba(255, 69, 81,1)',
    },

    nameGame: {
        // position: 'absolute',
        color: 'white',
        textAlign: 'center',
        fontSize: 15,

    },

    displayDescription: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'normal',
        // textAlign: 'justified',
        fontSize: 15,
        paddingLeft: '5px',
        // marginTop: '15px',
        top: 0.089 * windowHeight,
        left: 0.01 * windowWidth,
        flexGrow: 0.1,
        // backgroundColor: 'white'
        marginBottom: '5px',
    },

    likestext: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 26,
        top: 0.005 * windowHeight,
        left: 0.045 * windowWidth
    },

    


});