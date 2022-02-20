import React from 'react';
import {View, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity, Text, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import fire from '../firebase';
import 'firebase/database'
import { getDatabase, onValue, ref, query, orderByChild, equalTo } from "firebase/database";
import 'firebase/auth';
import { getAuth } from "firebase/auth";


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

export default function MyGamesPage ({ navigation, route }){
    const auth = getAuth();
    // const ImageCode = "P0"
    const [games, setGames] = React.useState(null);
    // const [userGameInfo, setuserGameInfo] = React.useState();
    const [displayGame, setDisplayGame] = React.useState([])
    const db = getDatabase();
    const GameRef = query(ref(db,'games'))
    // const gameImage = query(ref(db, 'games'),equalTo('P0'))
    const UserRef = query(ref(db,'users/ToEDaabwu7NlvJq3CjNEJWZzEcG3'))
    console.log(UserRef);
    console.log(GameRef);
    // console.log(ImageCode);
    
    React.useEffect(() => {
        onValue(GameRef, (snapshot) => {
            const data = Object.values(snapshot.val());
            setGames(data)
            console.log(data)
        })

        onValue(UserRef, (snapshot) => {
            const data1 = Object.values(snapshot.val());
            setDisplayGame(data1[3])
            console.log(data1)
            }
        )
        
        // onValue(gameImage, (snapshot) => {
        //     const data2 = Object.values(snapshot.val)
        //     setDisplayGame(data2)
        //     console.log(data2)
        // }
        // )

    },[])

    console.log(games)
    console.log(displayGame);
    // console.log(displayGame[1].charAt(0))

    if (!games) {
        return (<Text>Rukavat ke liye khed hai</Text>)
    }
    return(
        <View style={styles.container}>
            <LinearGradient
                start = {{x:0, y:0}}
                end = {{x:0, y:-1}}
                colors={['#013C00', '#000000']}
                style = {styles.background}
            />
            
            <Image source={require('./MyGamesAssets/designspikes1.png')} 
                style={styles.spikes1} />
            <Image source={require('./MyGamesAssets/designspikes2.png')} 
                style={styles.spikes2} />
            <Image source={require('./MyGamesAssets/GamerVerseTitle.png')} 
                style = {styles.GamerVerseTitle} />   
            <ImageBackground source={require('./MyGamesAssets/MenuBar.png')}
                style = {styles.menuBar} />

            {/* NavBar Buttons     */}
            <TouchableOpacity style={styles.homebtn}  onPress={() => navigation.navigate("Home")}>
                <Text style={styles.robototxt}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profilebtn}  onPress={() => navigation.navigate("Profile")}>
                <Text style={styles.robototxt}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mygamesbtn}  onPress={() => navigation.navigate("MyGames")}>
                <Text style={styles.highlighttxt}>My Games</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gamehubbtn}  onPress={() => navigation.navigate("GameHub")}>
                <Text style={styles.robototxt}>Game Hub</Text>
            </TouchableOpacity>

            <Image source={require('./MyGamesAssets/SearchBar.png')}
                style = {styles.searchBar} />
            <ImageBackground source={require('./MyGamesAssets/HoriDivider.png')}
                style = {styles.horiLine} />
            <Image source={require('./MyGamesAssets/VerLine.png')} 
                style = {styles.verLine} />
            <Image source={require('./MyGamesAssets/VerLine2.png')} 
                style = {styles.verLine2} />

            <Image source={require('./MyGamesAssets/PCLogo.png')}
                style = {styles.pcLogo} />
            <Image source={require('./MyGamesAssets/MobileLogo.png')} 
                style = {styles.mobileLogo} />
            <Image source={require('./MyGamesAssets/ConsoleLogo.png')} 
                style = {styles.consoleLogo} />


            <ScrollView contentContainerStyle= {{justifyContent:'space-around'}} style = {styles.scrollContainer1} showsVerticalScrollIndicator={false}>
            {games.map((item, index) =>{
                    for(let i=1; i<displayGame.length;i++){
                        var computer = displayGame[i].charAt(0)
                        // console.log(computer);
                        
                        console.log(item.Code);
                        var displayComp = item.Code.charAt(0)
                        // for(let j=0; j<item.Code.length; j++)
                        console.log(displayComp);
                        if(displayComp === "P" && computer === "P"){
                            return (
                                <View key={index} >   
                                    {/* {console.log(computer)} */}
                                    <TouchableOpacity style={styles.apexLegend} onPress={() => navigation.navigate("Game", { GameCode: item.Code })}>
                                    <Image source={item.Image}
                                        style={{ resizeMode: 'contain', width: '100%', height: '100%' }} />
                                    </TouchableOpacity>
                               
                                </View>
    
    
                            )
                        }
                            
                    }
                    })}    
                
            </ScrollView>


            <ScrollView style = {styles.scrollContainer2} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => navigation.navigate("Game",{GameCode: 'P1'})}>
            <Image source={require('./MyGamesAssets/cocLogo.png')} 
                    style = {styles.coc} />
            </TouchableOpacity>
            <View style={styles.cocContainer}>
                <Text style={styles.tagText} >Tags: </Text>
                <Text style={styles.tagText} >#BattleRoyale</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Game",{GameCode: 'P1'})}>
            <Image source={require('./MyGamesAssets/CODMLogo.png')} 
                    style = {styles.codMob} />
            </TouchableOpacity>
            <View style={styles.codMobContainer}>
                <Text style={styles.tagText} >Tags: </Text>
                <Text style={styles.tagText} >#BattleRoyale</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Game",{GameCode: 'P1'})}>
            <Image source={require('./MyGamesAssets/PokeLogo.png')} 
                    style = {styles.pogo} />
            </TouchableOpacity>
            <View style={styles.pogoContainer}>
                <Text style={styles.tagText} >Tags: </Text>
                <Text style={styles.tagText} >#BattleRoyale</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Game",{GameCode: 'P1'})}>
            <Image source={require('./MyGamesAssets/FreeFire.png')} 
                    style = {styles.freeFire} />
            </TouchableOpacity>
            <View style={styles.freeFireContainer}>
                <Text style={styles.tagText} >Tags: </Text>
                <Text style={styles.tagText} >#BattleRoyale</Text>
            </View>
            </ScrollView>


            <ScrollView style = {styles.scrollContainer3} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => navigation.navigate("Game",{GameCode: 'P1'})}>
            <Image source={require('./MyGamesAssets/GOWLogo.png')} 
                    style = {styles.gow} />
            </TouchableOpacity>
            <View style={styles.gowContainer}>
                <Text style={styles.tagText} >Tags: </Text>
                <Text style={styles.tagText} >#BattleRoyale</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Game",{GameCode: 'P1'})}>
            <Image source={require('./MyGamesAssets/MortalKombat.png')} 
                    style = {styles.mortalKombat} />
            </TouchableOpacity>
            <View style={styles.mkContainer}>
                <Text style={styles.tagText} >Tags: </Text>
                <Text style={styles.tagText} >#BattleRoyale</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Game",{GameCode: 'P1'})}>
            <Image source={require('./MyGamesAssets/SpiderManLogo.png')} 
                    style = {styles.spiderMan} />
            </TouchableOpacity>
            <View style={styles.spiderContainer}>
                <Text style={styles.tagText} >Tags: </Text>
                <Text style={styles.tagText} >#BattleRoyale</Text>
            </View>
            </ScrollView>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container : {
        position: 'relative',
        width : windowWidth,
        height : windowHeight,
    },

    background: {
        position: 'relative',
        width: windowWidth,
        height: windowHeight,
    },

    spikes1:{
        resizeMode:'contain',
        position:'absolute',
        right: '0px',
        height: 0.2*windowHeight,
        width:0.15* windowWidth,
    },

    spikes2:{
        position:'absolute',
        bottom: '0px', 
        resizeMode:'contain',
        height: 0.2*windowHeight,
        width:0.15* windowWidth,
    },

    GamerVerseTitle:{
        position:"absolute",
        left:0.35*windowWidth,
        resizeMode:'contain',
        height: 0.1*windowHeight,
        width: 0.35*windowWidth,
    },

    menuBar:{
        position:"absolute",
        resizeMode:'contain',
        top:0.10*windowHeight,
        height: 0.05*windowHeight,
        width: 1*windowWidth,
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
   
    homebtn:{
        position:"absolute",
        top:0.11*windowHeight,
        left:0.05*windowWidth,
        height: 0.03*windowHeight,
        width: 0.03*windowWidth
    },
    profilebtn:{
        position:"absolute",
        top:0.11*windowHeight,
        left:0.20*windowWidth,
        height: 0.03*windowHeight,
        width: 0.03*windowWidth
    },
    mygamesbtn:{
        position:"absolute",
        top:0.107*windowHeight,
        left:0.35*windowWidth,
        height: 0.03*windowHeight,
    },
    gamehubbtn:{
        position:"absolute",
        top:0.11*windowHeight,
        left:0.50*windowWidth,
        height: 0.03*windowHeight,
        width: 0.05*windowWidth
    },

    searchBar:{
        position:"absolute",
        resizeMode:'contain',
        top:0.10*windowHeight,
        left:0.7*windowWidth,
        height: 0.05*windowHeight,
        width: 0.25*windowWidth,
    },

    horiLine:{
        position: 'absolute',
        resizeMode: 'contain',
        width: 1*windowWidth,
        height : 0.001*windowHeight,
        top : 0.35* windowHeight
        
    },

    verLine:{
        position: 'absolute',
        resizeMode: 'contain',
        width : 0.1 * windowWidth,
        height : 0.83 * windowHeight,
        left : 0.265*windowWidth,
        top : 0.16*windowHeight
    },

    verLine2:{
       position: 'absolute',
       resizeMode: 'contain',
       width : 0.1 * windowWidth,
       height : 0.83 * windowHeight,
       right: 0.265*windowWidth,
       top: 0.16*windowHeight
    },

    pcLogo:{
        position:'absolute',
        resizeMode:'contain',
        width : 0.15*windowWidth,
        height: 0.2*windowHeight,
        left: 0.08*windowWidth,
        top: 0.15*windowHeight
    },

    mobileLogo:{
        position: 'absolute',
        resizeMode: 'contain',
        height: 0.17*windowHeight,
        width: 0.2*windowWidth,
        left: 0.4*windowWidth,
        top: 0.17*windowHeight
    },

    consoleLogo:{
        position: 'absolute',
        resizeMode: 'contain',
        height: 0.15*windowHeight,
        width: 0.14*windowWidth,
        left: 0.76*windowWidth,
        top : 0.18*windowHeight,
    },

    scrollContainer1:{
        position: 'absolute',
        width: 0.58*windowWidth,
        height : 0.6*windowHeight,
        top : 0.37*windowHeight,
        left : 0.016*windowWidth,
        flexGrow: 0.1
    },

    scrollContainer2:{
        position:'absolute',
        width: 0.58*windowWidth,
        height : 0.6*windowHeight,
        top : 0.37*windowHeight,
        left: 0.345*windowWidth
    },

    scrollContainer3:{
        position:'absolute',
        width: 0.32*windowWidth,
        height : 0.6*windowHeight,
        top : 0.37*windowHeight,
        left: 0.68*windowWidth
    },

    apexLegend:{
        paddingLeft: 10,
        paddingRight: 10,
        width: 0.13 * windowWidth,
        height: 0.24 * windowHeight,
    },

    apexContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.02*windowHeight
    },

   tagText:{
    "fontStyle": "normal",
    "fontWeight": "500",
    "fontSize": 26,
    "color": "#FFFFFF"
   },

    gta5:{
        position: 'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: -0.12*windowWidth,
        top: 0.06*windowHeight
    },

    gta5Container:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.06*windowHeight
    },

    valorant:{
        position: 'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: -0.12*windowWidth,
        top: 0.10*windowHeight
    },

    valorantContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.10*windowHeight
    },

    cod:{
        position: 'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: -0.12*windowWidth,
        top: 0.14*windowHeight
    },

    codContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.14*windowHeight,
    },

    coc:{
        position:'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        top: 0.02*windowHeight,
        left: -0.14*windowWidth
    },

    cocContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.02*windowHeight
    },

    codMob:{
        position:'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        top: 0.06*windowHeight,
        left: -0.14*windowWidth
    },

    codMobContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.06*windowHeight
    },

    pogo:{
        position:'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        top: 0.10*windowHeight,
        left: -0.14*windowWidth
    },

    pogoContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.10*windowHeight
    },

    freeFire:{
        position:'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        top: 0.14*windowHeight,
        left: -0.14*windowWidth
    },

    freeFireContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.14*windowHeight
    },

    gow:{
        position:'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        top: 0.02*windowHeight,
        left: -0.12*windowWidth,
    },

    gowContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.02*windowHeight
    },

    mortalKombat:{
        position:'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        top: 0.06*windowHeight,
        left: -0.12*windowWidth,
    },

    mkContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.06*windowHeight
    },

    spiderMan:{
        position:'absolute',
        resizeMode: 'contain',
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        top: 0.10*windowHeight,
        left: -0.12*windowWidth,
    },

    spiderContainer:{
        width: 0.4*windowWidth,
        height: 0.25*windowHeight,
        left: 0.15*windowWidth,
        top: 0.10*windowHeight
    },
    
    
});
