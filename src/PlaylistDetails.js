import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { fetchPlaylistDetails } from './Spotify.js';

export function PlaylistDetails() {
    const { playlistID } = useParams();
    const [details, setDetails] = useState(null);
    
    useEffect(() => {
        fetchPlaylistDetails(playlistID).then((data) => {
            setDetails(data);
        });
    }, []);

    console.log(details);
    return (
        details ? <div className='playlistDetailsContainer'>
            <div className='playlistDetailsContainer'>
                <div className='topDetails'>
                    <img className='detailsImage' src={details.images[0] ? details.images[0].url : <p>No picture</p>} />
                    <h2>{details.name}</h2>
                </div>
                <div className='bottomDetails'>
                    <h3>List of tracks:</h3>
                    {details.tracks.items.map((element, index) => {
                        const className = ['playlistElement'];
                        if (index % 2 === 0) {
                            className.push('playlistElementLight');
                        }
                        return (
                            <div className={className.join(' ')} key={`${index}`}>
                                <div className='trackIndex'>{index+1}</div>
                                <div className='trackInfo'>
                                    <div className='trackInfoName'>{element.track.name}</div>
                                    <div>{element.track.artists[0].name}</div>
                                </div>
                            </div>
                        )   
                    })}
                </div>
            </div>
        </div> : <div>Loading...</div>
    )
}