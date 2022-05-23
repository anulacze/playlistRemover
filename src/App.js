import './App.css';
import { Playlists } from './Playlists.js';
import { PlaylistDetails } from './PlaylistDetails.js';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/playlistRemover'>
            <Route path='' element={<Playlists />} />
            <Route path='playlist/:playlistID' element={<PlaylistDetails />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
