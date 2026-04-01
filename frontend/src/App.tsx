import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { BottomNav } from './components/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { StoreScreen } from './screens/StoreScreen'
import { BoostersScreen } from './screens/BoostersScreen'
import { TasksScreen } from './screens/TasksScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { WalletScreen } from './screens/WalletScreen'

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg-primary">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/store" element={<StoreScreen />} />
            <Route path="/boosters" element={<BoostersScreen />} />
            <Route path="/tasks" element={<TasksScreen />} />
            <Route path="/leaderboard" element={<LeaderboardScreen />} />
            <Route path="/wallet" element={<WalletScreen />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App
