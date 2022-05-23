import { useEffect } from "react";

const client_id = 'e69b238f40cf4abd8af17c89d5b764bb';
const scope = 'playlist-modify-public';
const redirect_uri = 'http://localhost:3000/';
let token = localStorage.getItem('Token');

export const getAccessToken = () => {
    if (!token) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        token = params.get('access_token');

        if (token) {
            localStorage.setItem('Token', token);
            window.history.pushState('Access Token', null, '/');
            return token;
        }

        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        //url += '&state=' + encodeURIComponent(state);
        
        window.location.href = url;
    }

    return token;
}

export const fetchUserId = async () => {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    });
    const data = await response.json();
    return data.id;
}

export const fetchPlaylists = async (page) => {
    const id = await fetchUserId();
    const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists?offset=${page * 10}&limit=10`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    });
    const data = await response.json();
    console.log(page * 10);
    return data;
}

export const removePlaylist = (id) => {
    return fetch(`https://api.spotify.com/v1/playlists/${id}/followers`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    });
}

export const fetchPlaylistDetails = async (id) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`
        }
    });
    const data = await response.json();
    return data;
}