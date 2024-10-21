const CLIENT_ID = '2447b4ad00f2495788be95c6146cd455';
const REDIRECT_URI = 'http://localhost:8888/';  // Change to your desired URI

const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPES = 'user-top-read user-read-recently-played';

let accessToken = null;

window.onload = () => {
    // Check if we have an access token in the URL
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        accessToken = getAccessTokenFromUrl(hash);
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('timeFrameSelection').style.display = 'block';
    } else {
        document.getElementById('loginBtn').addEventListener('click', redirectToSpotifyLogin);
    }
}

function redirectToSpotifyLogin() {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
    window.location = authUrl;
}

function getAccessTokenFromUrl(hash) {
    const params = new URLSearchParams(hash.substring(1));
    return params.get('access_token');
}

async function fetchData(timeRange) {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    // Fetch top tracks as an example
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=5`, {
        headers: headers
    });

    if (response.ok) {
        const data = await response.json();
        displayResults(data.items);
    } else {
        alert('Error fetching data');
    }
}

function displayResults(items) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Your Top 5 Tracks:</h3>';

    const ul = document.createElement('ul');
    items.forEach(track => {
        const li = document.createElement('li');
        li.textContent = `${track.name} by ${track.artists[0].name}`;
        ul.appendChild(li);
    });

    resultsDiv.appendChild(ul);
}
