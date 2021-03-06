import React from 'react';
import { View, StyleSheet, Image, Dimensions,ImageBackground,Text,TouchableOpacity,TextInput, ActivityIndicator,FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import fire from '../firebase';
import 'firebase/auth';
import { getAuth } from "firebase/auth";
import 'firebase/database'
import { getDatabase, onValue,ref,query, orderByChild, equalTo, push ,update ,startAt,endAt} from "firebase/database";

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;


export default function gamepage({ navigation, route }) {
    const auth = getAuth();
    var {GameCode} = route.params
    
    var [gameInfo,setGameInfo] = React.useState()
    const [userInfo,setUserInfo] = React.useState()
    const [textInputValue, setTextInputValue] = React.useState('');
    const [location, setLocation] = React.useState(null);
    const [selectedValue, setSelectedValue] = React.useState()
    var gameTags=[];
    var tagArray=[];
    var notfollowStatus =true;
    var games = [ "YY" ];
    // var gameArray=[];
    const db = getDatabase();
    var GameRef = query(ref(db,'games'),orderByChild('Code'),equalTo(GameCode))
    const UserRef = query(ref(db,'users/'+ auth.currentUser.uid))
    var GetUserRef = query(ref(db,'users'),orderByChild('uid'),equalTo( auth.currentUser.uid))
    
    React.useEffect(() => {
    onValue(GameRef,(snapshot)=>{
        var data = Object.values(snapshot.val());
        setGameInfo(data[0])
    })
    onValue(GetUserRef,(snapshot)=>{
        const data1 = Object.values(snapshot.val());
        setUserInfo(data1[0])
    })
},[])

// code for displaying tags
if(gameInfo){
gameTags = gameInfo.Tags;

tagArray = Object.entries(gameTags);

}
var handleSearch = (e) => {
    if (e.nativeEvent.key == 'Enter') {
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
if(userInfo){
    games = userInfo.Games;
    for(var i = 0; i < games.length; i++)
        {
            if (GameCode==games[i]) {
                notfollowStatus=false;
            };
        }
    }
    function gameFollowCheck(GameCode){
        for(var i = 0; i < games.length; i++)
        {
            if (GameCode==games[i]) return false;
        }
        return true
    }
    function gameRemover(GameCode){
        for(var i = 0; i < games.length; i++)
        {
            if (GameCode==games[i]) return i;
        }
    }
if(!gameInfo)
{
    return (
        <View style={styles.container}>
                <LinearGradient
                    start={{ x: 0, y: 1 }} end={{ x: 0, y: -1 }}
                    colors={['#013C00', '#000000']}
                    style={[styles.background,{width: '100%', height: '100%'}]} >
                    <ActivityIndicator size="large" color="#00ff00" style={{ top: "40%" }} />
                </LinearGradient>
        </View>
        )
    }
    if (gameInfo && notfollowStatus){
        const rating = gameInfo.Rating
    return (
        <View style={styles.container} >
            <LinearGradient
                start={{ x: 0, y: 1}} end={{ x: 0, y: -1 }}
                colors={['#013C00', '#000000']}
                style={styles.background} >
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdesignspikes1.png?alt=media&token=40fb8f39-0720-4688-917e-c02817598a01"} style={styles.spike1} />
                <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Flogo.png?alt=media&token=7468c404-5678-43b2-92eb-310ffa58433c"} style={styles.title} />
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fmenubar.png?alt=media&token=ffa75a86-6d73-441d-b9b5-3d48601a0994"} style={styles.menu} />
                <TouchableOpacity style={styles.homebtn}  onPress={() => navigation.push("Home")}>
                <Text style={styles.robototxt}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profilebtn}  onPress={() => navigation.push("Profile")}>
                <Text style={styles.robototxt}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mygamesbtn}  onPress={() => navigation.push("MyGames")}>
                <Text style={styles.robototxt}>My Games</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gamehubbtn}  onPress={() => navigation.push("GameHub")}>
                <Text style={styles.highlighttxt}>Game Hub</Text>
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
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingTxt}>Rating</Text>
                    <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdark.png?alt=media&token=0e44c147-d2b8-43e9-b960-91ddc8f8873b"} style={styles.defaultStar}></Image>
                    <View style={[styles.lightStarContainer,{width: ((3.5 * rating  ) / (0.302*windowWidth)) * 5 * windowWidth,}]}>
                        <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Flight.png?alt=media&token=703a5b40-df81-4132-8d18-66865a8e3a69"} style={styles.lightStar}></Image>
                    </View>
                </View>
                <View style={styles.desclabContainer}>
                    <Text style={styles.ratingTxt}>Description</Text>
                </View>
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdesignspikes.png?alt=media&token=a8871878-f2d0-4fa7-b74c-992a8fbe695e"} style={styles.spike2} />
                <View style={styles.taglabContainer}>
                    <Text style={styles.ratingTxt}>Tag</Text>
                </View>
                <View style={styles.gameContainer}>
                <View style={{alignItems: "center", top: 0.02*windowHeight,}}><Text style={styles.gameTitleTxt}>{gameInfo.Name}</Text></View>
                    <Image source={gameInfo.Image} style={styles.dpicture}></Image>
                <TouchableOpacity style={styles.Button} title='Follow' 
                onPress={() => 
                {
                    if (gameFollowCheck(GameCode)) games.push(GameCode);
                    update(UserRef, {
                        Games: games,
                      }); 
                }}>
                    <Text style={styles.ButtonText}>Follow</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.descContainer}>
                    <Text style={styles.descriptionTxt}>{gameInfo.Description}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {tagArray.map(([key, value]) => {
                        
                        return (
                            <View
                            key={key}
                             style={{
                  flex: 1,
                  flexDirection:"row",
                  width: (414 / 414) * windowWidth,
                  Height: (896 / 896) * windowHeight,
                  top: (0 / 896) * windowHeight,
                  marginVertical: 2,
                  justifyContent: 'space-between',
                }}>
                                <TouchableOpacity
                  style={styles.tagButton}
                //   onPress={() =>}
                ><Text style={{ color: "white" }}>
                {key}
              </Text></TouchableOpacity>
                                </View>
                        )
                    })
                    }
                    {/* <Text>{tagArray}</Text>         */}
                </View>
                </LinearGradient>
        </View>
);
}
else{
    
    const rating1 = gameInfo.Rating
    if (gameInfo){
    return (
        <View style={styles.container} >
            <LinearGradient
                start={{ x: 0, y: 1}} end={{ x: 0, y: -1 }}
                colors={['#013C00', '#000000']}
                style={styles.background} >
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdesignspikes1.png?alt=media&token=40fb8f39-0720-4688-917e-c02817598a01"} style={styles.spike1} />
                <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Flogo.png?alt=media&token=7468c404-5678-43b2-92eb-310ffa58433c"} style={styles.title} />
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fmenubar.png?alt=media&token=ffa75a86-6d73-441d-b9b5-3d48601a0994"} style={styles.menu} />
                <TouchableOpacity style={styles.homebtn}  onPress={() => navigation.push("Home")}>
                <Text style={styles.robototxt}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profilebtn}  onPress={() => navigation.push("Profile")}>
                <Text style={styles.robototxt}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mygamesbtn}  onPress={() => navigation.push("MyGames")}>
                <Text style={styles.robototxt}>My Games</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gamehubbtn}  onPress={() => navigation.push("GameHub")}>
                <Text style={styles.highlighttxt}>Game Hub</Text>
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
                            setSelectedValue("Somewhere")
                        }}}
                    onFocus={() => {
                        if(selectedValue)
                            setSelectedValue(undefined)
                        }}
                    ></TextInput>
                    {renderSug()}
                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingTxt}>Rating</Text>
                    <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdark.png?alt=media&token=0e44c147-d2b8-43e9-b960-91ddc8f8873b"} style={styles.defaultStar}></Image>
                    <View style={[styles.lightStarContainer,{width: ((3.5 * rating1  ) / (0.302*windowWidth)) * 5 * windowWidth,}]}>
                        <Image source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Flight.png?alt=media&token=703a5b40-df81-4132-8d18-66865a8e3a69"} style={styles.lightStar}></Image>
                    </View>
                </View>
                <View style={styles.desclabContainer}>
                    <Text style={styles.ratingTxt}>Description</Text>
                </View>
                <ImageBackground source={"https://firebasestorage.googleapis.com/v0/b/rcoegamerverse.appspot.com/o/Assets%2FLoginPage%2Fdesignspikes.png?alt=media&token=a8871878-f2d0-4fa7-b74c-992a8fbe695e"} style={styles.spike2} />
                <View style={styles.taglabContainer}>
                    <Text style={styles.ratingTxt}>Tag</Text>
                </View>
                <View style={styles.gameContainer}>
                    <View style={{alignItems: "center", top: 0.02*windowHeight,}}><Text style={styles.gameTitleTxt}>{gameInfo.Name}</Text></View>
                    <Image source={gameInfo.Image} style={styles.dpicture}></Image>
                <TouchableOpacity style={styles.Button} title='Unfollow' 
                onPress={() => 
                {
                    if (!gameFollowCheck(GameCode)) {
                        var gameindex = gameRemover(GameCode)
                        delete games[gameindex];
                    };
                    update(UserRef, {
                        Games: games,
                      }); 
                }}>
                    <Text style={styles.ButtonText}>Unfollow</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.descContainer}>
                    <Text style={styles.descriptionTxt}>{gameInfo.Description}</Text>
                </View>
                <View style={styles.tagContainer}>
                    {tagArray.map(([key, value]) => {
                        
                        return (
                            <View
                            key={key}
                             style={{
                  flex: 1,
                  flexDirection:"row",
                  width: (414 / 414) * windowWidth,
                  Height: (896 / 896) * windowHeight,
                  top: (0 / 896) * windowHeight,
                  marginVertical: 2,
                  justifyContent: 'space-between',
                }}>
                                <TouchableOpacity
                  style={styles.tagButton}
                //   onPress={() =>}
                ><Text style={{ color: "white" }}>
                {key}
              </Text></TouchableOpacity>
                                </View>
                        )
                    })
                    }
                    {/* <Text>{tagArray}</Text>         */}
                </View>
                </LinearGradient>
        </View>
);
}
}
}

const styles = StyleSheet.create({
    container: {
        position:"relative",
        width: "100%",
        height: "100%",
        overflow: 'hidden',
    },
    background: {
        position:"relative",
        width: windowWidth,
        height: windowHeight,
    },
    title:{
        position:"absolute",
        left:0.35*windowWidth,
        resizeMode:'contain',
        height: 0.1*windowHeight,
        width: 0.35*windowWidth,
    },
    menu:{
        position:"absolute",
        resizeMode:'contain',
        top:0.10*windowHeight,
        height: 0.05*windowHeight,
        width: 1*windowWidth,
    },

    searchIcon:{
        position:"absolute",
        resizeMode:'contain',
        top:0.11*windowHeight,
        left:0.7*windowWidth,
        height: 0.03*windowHeight,
        width: 0.03*windowWidth,
    },

    InputStyle1:{
        "position": "absolute",
        top: 107/1024*windowHeight,
        right: 85/1440*windowWidth,
        height: 42/1024*windowHeight,
        width: 305/1440*windowWidth,
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


    robototxt:{ 
        "fontStyle": "normal",
        "fontWeight": "500",
        "fontSize": 14,
        "color": "#FFFFFF"
    },

    highlighttxt:{ 
        "fontStyle": "normal",
        "fontWeight": "500",
        "fontSize": 15,
        borderBottomColor: "#FFFFFF",
        borderBottomWidth: 1,
        "color": "#FFFFFF"
    },

    defaultStar:{
    position: "absolute",
    width: 275 / 1440 * windowWidth,
    height: 50 / 1024 * windowHeight,
    left: 75 / 1440 * windowWidth,
    top: 200 / 1024 * windowHeight,
    justifyContent: 'center',
    alignItems: 'center'
    },

    lightStar:{
        // position: "absolute",
        width: 275 / 1440 * windowWidth,
        height: 50 / 1024 * windowHeight,
        left: 0 * windowWidth,
        top: 0 * windowHeight,
        },

    lightStarContainer:{
        position: "absolute",
        // backgroundColor: "rgba(255, 255, 255, 0.95)",
        height: 50 / 1024 * windowHeight,
        left: 75 / 1440 * windowWidth,
        top: 200 / 1024 * windowHeight,
        overflow: 'hidden',
        },

    Button:
  {
    position: "absolute",
    width: 136 / 1440 * windowWidth,
    height: 53 / 1024 * windowHeight,
    left: 433 / 1440 * windowWidth,
    top: 330 / 1024 * windowHeight,
    backgroundColor: "#39750A",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  ButtonText:
  {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 16,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#FFFFFF"
  },

    homebtn:{
        position:"absolute",
        top:0.11*windowHeight,
        left:0.05*windowWidth,
        height: 0.03*windowHeight,
    },
    profilebtn:{
        position:"absolute",
        top:0.11*windowHeight,
        left:0.20*windowWidth,
        height: 0.03*windowHeight,
    },
    mygamesbtn:{
        position:"absolute",
        top:0.11*windowHeight,
        left:0.35*windowWidth,
        height: 0.03*windowHeight,
    },
    gamehubbtn:{
        position:"absolute",
        top:0.107*windowHeight,
        left:0.50*windowWidth,
        height: 0.03*windowHeight,
    },
    searchbar:{
        position:"absolute",
        resizeMode:'contain',
        top:0.10*windowHeight,
        left:0.7*windowWidth,
        height: 0.05*windowHeight,
        width: 0.25*windowWidth,
    },
      followBtn:{
        position:"absolute",
        resizeMode:'contain',
        top:0.7*0.424*windowHeight,
        left:0.9*0.302*windowWidth,
        height: 0.1*windowHeight,
        width: 0.1*windowWidth,
    },
    ratingContainer:{
        position: "absolute",
        width: 0.302*windowWidth,
        height: 0.424*windowHeight,
        top: 0.15*windowHeight,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        transform: "matrix(1, 0, 0, 1, 0, 0)"
      },
      desclabContainer:{
        position: "absolute",
        width: 0.302*windowWidth,
        height: 0.195*windowHeight,
        top: 0.574*windowHeight,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        transform: "matrix(1, 0, 0, 1, 0, 0)"
      },
      taglabContainer:{
        position: "absolute",
        width: 0.302*windowWidth,
        height: 0.227*windowHeight,
        top: 0.769*windowHeight,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        transform: "matrix(1, 0, 0, 1, 0, 0)"
      },

    ratingTxt:{
        position: "absolute",
        top: 70/1024 *windowHeight,
        width: '100%',
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "22px",
        lineHeight: "26px",
        textAlign: "center",
        color: "#FFFFFF"
      },

      descriptionTxt:{
        position: "absolute",
        top: 20/1024 *windowHeight,
        left: 15/1440 *windowWidth,
        width: 900/1440 *windowWidth,
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "20px",
        lineHeight: "23px",
        textAlign: "justify",
        color: "#FFFFFF"
      },

      gameTitleTxt:{
        position: "absolute",
        // left: 0.28*windowWidth,
        // top: 0.02*windowHeight,
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: "22px",
        lineHeight: "26px",
        textAlign: "center",
        color: "#FFFFFF"
      },
      gameContainer:{
        position: "absolute",
        width: 0.698*windowWidth,
        height: 0.424*windowHeight,
        top: 0.15*windowHeight,
        left:0.302*windowWidth,
        backgroundColor: "rgba(255, 255, 255, 0.20)",
        transform: "matrix(1, 0, 0, 1, 0, 0)"
      },
      descContainer:{
        position: "absolute",
        width: 0.698*windowWidth,
        height: 0.195*windowHeight,
        top: 0.574*windowHeight,
        left:0.302*windowWidth,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        transform: "matrix(1, 0, 0, 1, 0, 0)"
      },
      tagContainer:{
        position: "absolute",
        width: 0.698*windowWidth,
        height: 0.227*windowHeight,
        top: 0.769*windowHeight,
        left:0.302*windowWidth,
        backgroundColor: "rgba(255, 255, 255, 0.20)",
        transform: "matrix(1, 0, 0, 1, 0, 0)"
      },
    spike1:{
        position:"absolute",
        resizeMode:'contain',
        right:"0px",
        height: 0.2*windowHeight,
        width:0.15* windowWidth,
    },
    spike2:{
        position:"absolute",
        bottom:"0px",
        resizeMode:'contain',
        height: 0.2*windowHeight,
        width:0.15* windowWidth,
    },
    dpicture:{
        position: "absolute",
        top:0.08*windowHeight,
        left:0.29*windowWidth,
        width:0.20*windowHeight,
        height:0.20*windowHeight,
        backgroundColor: "rgba(120, 225, 100, 0.2)"
    },
    tagButton: {
        position: "absolute",
        width: 0.08 * windowWidth,
        height: 0.02 * windowHeight,
        backgroundColor: "rgba(0,0, 0, 0.5)",
        color: "white",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
      },
});