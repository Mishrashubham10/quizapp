import { Routes, Route } from 'react-router-dom';

// =========== LAYOUTS ============
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

// ============ PROTECTED ROUTE ===========
import ProtectedRoute from './routes/ProtectedRotue';

// ============== PUBLIC PAGES =============
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// ============ PRIVATE PAGES ==============
import DashboardPage from './pages/private/DashboardPage';
import LobbyPage from './pages/private/LobbyPage';
import QuizPage from './pages/private/QuizPage';
import ResultsPage from './pages/private/ResultPage';
import CreateRoomPage from './pages/private/CreateRoomPage';
import JoinRoomPage from './pages/private/JoinRoomPage';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Private */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/join-room" element={<JoinRoomPage />} />
          <Route path="/lobby/:roomCode" element={<LobbyPage />} />
          <Route path="/quiz/:roomCode" element={<QuizPage />} />
          <Route path="/results/:sessionId" element={<ResultsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;