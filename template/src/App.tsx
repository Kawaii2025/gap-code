import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Full-Stack App</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function HomePage() {
  return <p>Welcome! Replace me with your own content!</p>
}

export default App
