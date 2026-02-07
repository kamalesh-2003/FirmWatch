import React, { useState, useRef, useEffect } from 'react'
import liveChatbotGif from '../../assets/Live chatbot.gif'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi, I\'m the firmMatch assistant. I can help you understand alerts, risk scores, and next steps. Ask me anything about your dashboard or a specific case.',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Placeholder bot reply (replace with real API later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Thanks for your message. Backend integration will connect me to your data—for now this is a placeholder reply.',
          timestamp: new Date(),
        },
      ])
    }, 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 shadow-lg flex items-center justify-center text-slate-100 hover:bg-slate-700 hover:border-blue-500/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <img src={liveChatbotGif} alt="Chat" className="w-12 h-12 object-contain" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-30 w-full max-w-md flex flex-col rounded-2xl border border-slate-600/60 bg-slate-800/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ maxHeight: 'min(calc(100vh - 7rem), 520px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-600/60 rounded-t-2xl bg-slate-800/90">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-700/80 flex items-center justify-center flex-shrink-0 border border-slate-600/50 overflow-hidden">
              <img src={liveChatbotGif} alt="" className="w-10 h-10 object-contain" />
            </div>
            <span className="font-semibold text-slate-100">firmMatch Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-slate-700/80 text-slate-100 border border-slate-600/50 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-600/60 rounded-b-2xl bg-slate-800/90">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about alerts, risk, or cases..."
              className="flex-1 rounded-xl border border-slate-600 bg-slate-700/80 px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="rounded-xl bg-blue-600 px-4 py-3 text-white font-medium text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatBot
