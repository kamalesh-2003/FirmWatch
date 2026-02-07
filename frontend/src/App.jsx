import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ReportAnalysis from './pages/ReportAnalysis'
import ChatBot from './components/chat/ChatBot'
import bgImage from './assets/bg.png'

function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
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

