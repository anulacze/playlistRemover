import { useEffect, useState } from "react"
import { fetchPlaylists, removePlaylist } from './Spotify.js';
import { Link, useSearchParams } from 'react-router-dom';

export function Playlists() {
    const [markedPlaylists, setMarkedPlaylists] = useState([]);
    const [data, setData] = useState(null);
    let [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 0;

    const playlists = data?.items;
    let allMarked = playlists?.every((playlist) => markedPlaylists.includes(playlist.id));


    const fetchData = () => {
        fetchPlaylists(page).then(data => {
            setData(data);
        });
    }

    const markPlaylist = (id, event) => {
        if (event.target.checked) {
            setMarkedPlaylists((prev) => [...prev, id])
        } else {
            setMarkedPlaylists((prev) => prev.filter(element => element !== id))
        }
    }

    const markAllPlaylists = () => {
        if (allMarked === false) {
            const arrOfAllPlaylistsId = playlists.map(playlist => playlist.id);        
            setMarkedPlaylists(arrOfAllPlaylistsId);
        } else {
            setMarkedPlaylists([]);
        }
    }

    const deleteElementAndSetPlaylists = (id) => {
        removePlaylist(id);
        setData((prev) => ({
                ...prev,
                items: prev.items.filter(playlist => playlist.id !== id)
            }))
    }

    const removeCheckedPlaylists = () => {
        markedPlaylists.forEach(id => {
            deleteElementAndSetPlaylists(id);
        })
    }

    useEffect(() => {
        fetchData();
    }, [page]);

    const goPreviousPage = () => {
        setSearchParams({
            page: page - 1
        })
    }

    const goNextPage = () => {
        setSearchParams({
            page: page + 1
        })
    }

    return (
        <>
            <h1>Your playlists:</h1>
            <div className='mainContainer'>
                <div className="allButtonsContainer">
                    <button className='removeAllButton' onClick={() => {
                        markAllPlaylists()
                        }}>{allMarked ? 'Uncheck all' : 'Check all'}</button>
                    <button className='removeAllButton' onClick={() => {
                        removeCheckedPlaylists()
                        }}>Remove all checked</button>
                </div>
                {!playlists ? <div>Loading...</div> : playlists.map(element => {
                    return (
                        <Link to={`/playlist/${element.id}`} key={element.id} className='elementContainer'>
                            {element.images[0] !== undefined ? <img className='playlistImage' src={element.images[0].url}/> : <p className='noImage'>Brak obrazka</p>}
                            <div className='playlistName'>
                                {element.name}
                            </div>
                            <div className='buttonsContainer'>
                                <button className='removeButton' onClick={(event) => {
                                    event.preventDefault();
                                    deleteElementAndSetPlaylists(element.id);
                                }}>Remove</button>
                                <input className='removeCheckbox' type='checkbox' checked={markedPlaylists.includes(element.id)} onClick={(event) => {
                                    event.stopPropagation();
                                }} onChange={(event) => {
                                    markPlaylist(element.id, event);
                                }}/>
                            </div>
                        </Link>
                    )
                })}
            </div>
            <footer>
                {data?.previous && <button className="nextPreviousPage" onClick={goPreviousPage}>Previous page</button>}
                <p>Page {page + 1}</p>
                {data?.next && <button className="nextPreviousPage" onClick={goNextPage}>Next page</button>}
            </footer>
        </>
    )
}