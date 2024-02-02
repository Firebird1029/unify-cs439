import {useEffect, useState} from 'react';
import axios from 'axios';
import * as utils from './utils'

function App() {
const CLIENT_ID = "319f3f19b0794ac28b1df51ca946609c"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const [token, setToken] = useState("")
const [userprofile, setUserProfile] = useState(null)
//const [spotifyURL, setSpotifyURL] = useState('');
const [svgContent, setSvgContent] = useState('')
const [topsongs, setTopSongs] = useState([])
const [topartists, setTopArtists] = useState([])
const [topsongimages, setTopSongImages] = useState([])

const getSVGString = async(spotifyURL) => {
    const pathToFile = "test.svg";
    const format = "svg";
    const backgroundColor = "FFFFFF"; //Math.floor(Math.random()*16777215).toString(16);
    const textColor = "black";
    const imageWidth = "400";

    const type_regex = /open\.spotify\.com\/([^\/?]+)/;

    console.log(spotifyURL)

    const url = `https://scannables.scdn.co/uri/plain/${format}/${backgroundColor}/${textColor}/${imageWidth}/${spotifyURL}`;

    try {

    console.log(`${url}`)

    console.log('Start image creation')

    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const svgString = new TextDecoder('utf-8').decode(new Uint8Array(response.data));

    console.log('SVG String:', svgString);

    return modifySvg(svgString, spotifyURL); 

    } catch (error) {
        console.error(`Error saving Spotify code: ${error.message}`);
    }
};

const saveSpotifyCode = async (spotifyURL) => {
    const pathToFile = "test.svg";
    const format = "svg";
    const backgroundColor = "FFFFFF"; //Math.floor(Math.random()*16777215).toString(16);
    const textColor = "black";
    const imageWidth = "400";

    const type_regex = /open\.spotify\.com\/([^\/?]+)/;

    console.log(spotifyURL)

    const url = `https://scannables.scdn.co/uri/plain/${format}/${backgroundColor}/${textColor}/${imageWidth}/${spotifyURL}`;

    try {

    console.log(`${url}`)

    console.log('Start image creation')

    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const svgString = new TextDecoder('utf-8').decode(new Uint8Array(response.data));

    const modifiedSvgString = modifySvg(svgString, spotifyURL);

    setSvgContent(modifiedSvgString);

    //console.log(svgString)

    //console.log(response.data)
    const svgData = new Blob([response.data], { type: 'image/svg+xml' });
    const svgURL = URL.createObjectURL(svgData);

    } catch (error) {
        console.error(`Error saving Spotify code: ${error.message}`);
    }

    console.log('Created image')
};

// Example function to modify the SVG content
const modifySvg = (svgString, uri) => {
    console.log(uri)
    console.log(utils.hashCode(uri))
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');

    // Example: Change the color of all paths to red
    const whiteRectangles = doc.querySelectorAll('rect[fill="#ffffff"]');
    whiteRectangles.forEach((rect) => {
        rect.setAttribute('fill', 'none');
    });

    const codeElements = doc.querySelectorAll('rect[fill="#000000"]')// , path[fill="#000000"]');
    codeElements.forEach((element) => {
        element.setAttribute("transform", "translate(300 75) scale(0.25)");
    });

    const spotifyLogo = doc.querySelectorAll('path[fill="#000000"]');
    spotifyLogo.forEach((logo) => {
        logo.setAttribute("transform", "translate(285 60) scale(0.25)");
    });
    

    const svgElement = doc.querySelector('svg');

    for (let i = 0; i < 4; i++) { // Change 2 to the number of rectangles you want
        const rect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', `${i * 100}`);
        rect.setAttribute('y', '0');
        rect.setAttribute('width', '100');
        rect.setAttribute('height', '100');
    
        //const randomColor = getRandomColor();
        const randomColor = utils.getColorFromSeed(utils.hashCode(uri) + i * 1000000);
        console.log(randomColor)
        rect.setAttribute('fill', randomColor);
    
        svgElement.insertBefore(rect, svgElement.firstChild);
    }

    // Convert the modified DOM back to string
    const serializer = new XMLSerializer();
    const modifiedSvgString = serializer.serializeToString(doc);

    return modifiedSvgString;
};

useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

}, [])

const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
}

const getUserProfile = async (f) => {
    f.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log(data)
    setUserProfile(data)
    console.log(`user profile uri: ${data.uri}`)
    //setSpotifyURL(data.uri)
    saveSpotifyCode(data.uri)
    //console.log(userprofile)
}

const getTopSongs = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log("get top songs")
    console.log(data)
    setTopSongs(data.items)
}

const getTopArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=5", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log("get top artists")
    console.log(data)
    setTopArtists(data.items)
}

const renderUserProfile = () => {
if (!userprofile) {
    return <p>No user profile available.</p>;
}

else {
    console.log(userprofile)
    return (
    <div>
        <p>Display Name: {userprofile.display_name}</p>
        <p>User URL: {userprofile.external_urls.spotify}</p>
        <p>URI: {userprofile.uri}</p>
        <p>Total Followers: {userprofile.followers.total}</p>
    </div>
    )
}
};

const renderTopSongs = () => {
    return topsongs.map(song => (
        <div key={song.id}>
            {song.name}
        </div>
    ))
}

const renderTopArtists = () => {
    return topartists.map(artist => (
        <div key={artist.id}>
            {artist.name}
        </div>
    ))
}

return (
    <div className="App">
        <header className="App-header">
            <h1>Spotify React</h1>
            {!token ?
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-read-email&scope=user-library-read&scope=user-follow-read&scope=user-top-read`}>Login
                    to Spotify</a>
                : <button onClick={logout}>Logout</button>}
            <button onClick={getUserProfile}>Get User Profile</button>
            {renderUserProfile()}
        </header>
        {svgContent && (
        <div>
            <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`}
                alt="Spotify Code"
                style={{ width: '600px', height: '150px' }}
            />
        </div>
        )}
        <div>
            <p><button onClick={getTopSongs}>Get Top Songs</button></p>
            {renderTopSongs()}
        </div>
        <div>
            <p><button onClick={getTopArtists}>Get Top Artists</button></p>
            {renderTopArtists()}
        </div>
    </div>
);
}

export default App;