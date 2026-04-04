import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { BottomNav } from './components/BottomNav'
import { UpdateToast } from './components/UpdateToast'
import { ParticlesBackground } from './components/ParticlesBackground'
import { useVersionCheck } from './hooks/useVersionCheck'
import { HomeScreen } from './screens/HomeScreen'
import { StoreScreen } from './screens/StoreScreen'
import { BoostersScreen } from './screens/BoostersScreen'
import { TasksScreen } from './screens/TasksScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { WalletScreen } from './screens/WalletScreen'
import { AdminScreen } from './screens/AdminScreen'

function App() {
  const { hasUpdate, handleUpdate } = useVersionCheck(12 * 60 * 60 * 1000)

  return (
    <GameProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg-primary relative">
          <ParticlesBackground />
          <div className="relative z-10">
            <UpdateToast hasUpdate={hasUpdate} onReload={handleUpdate} />
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/store" element={<StoreScreen />} />
              <Route path="/boosters" element={<BoostersScreen />} />
              <Route path="/tasks" element={<TasksScreen />} />
              <Route path="/leaderboard" element={<LeaderboardScreen />} />
              <Route path="/wallet" element={<WalletScreen />} />
              <Route path="/admin" element={<AdminScreen />} />
            </Routes>
            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App
