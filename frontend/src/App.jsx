import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import Dashboard from './pages/Dashboard'
import ReportAnalysis from './pages/ReportAnalysis'
import ChatBot from './components/chat/ChatBot'
import darkBg from './assets/DarkMode.jpeg'
import lightBg from './assets/LightMode.jpeg'

function App() {
  const { isDark } = useTheme()
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${isDark ? darkBg : lightBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report/:id" element={<ReportAnalysis />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </div>
  )
}

export default App

