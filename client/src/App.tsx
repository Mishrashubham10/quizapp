import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';

import { useSocketListeners } from './hooks/useSocketListeners';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultPage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import CountdownPage from './pages/CountDownPage';

function App() {
  useSocketListeners();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/lobby" element={<LobbyPage />} />

      <Route path="/quiz" element={<QuizPage />} />

      <Route path="/results" element={<ResultsPage />} />

      <Route path="/create-room" element={<CreateRoomPage />} />

      <Route path="/join-room" element={<JoinRoomPage />} />

      <Route path="/countdown" element={<CountdownPage />} />
    </Routes>
  );
}

export default App;