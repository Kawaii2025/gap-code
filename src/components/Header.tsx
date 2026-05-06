import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

interface HeaderProps {
  toggleTheme: () => void
}

function Header({ toggleTheme }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dbStatus, setDbStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`)
        const data = await response.json()
        setDbStatus(data.database)
      } catch (err) {
        console.error('Error fetching DB status:', err)
        setDbStatus('Unknown')
      }
    }

    fetchDbStatus()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-gapcode text-2xl font-bold">GapCode</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex space-x-6">
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gapcode px-3 py-2 text-sm font-medium">题库</Link>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gapcode px-3 py-2 text-sm font-medium">竞赛</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gapcode px-3 py-2 text-sm font-medium">题解</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Database Status Badge */}
            {dbStatus && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                <i className={`fa fa-database ${dbStatus.includes('Neon') ? 'text-purple-500' : 'text-blue-500'}`}></i>
                <span className="text-gray-700 dark:text-gray-300">{dbStatus}</span>
              </div>
            )}
            
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <i className="fa fa-moon-o dark:hidden"></i>
              <i className="fa fa-sun-o hidden dark:inline-block"></i>
            </button>
            
            {!isLoggedIn ? (
              <div className="flex items-center space-x-2" onClick={() => setIsLoggedIn(true)}>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gapcode">登录</button>
                <button className="px-3 py-1.5 text-sm font-medium bg-gapcode text-white rounded hover:bg-gapcode/90">注册</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <img src="https://picsum.photos/id/1005/40/40" className="w-8 h-8 rounded-full" alt="User" />
                <span className="hidden md:inline-block">用户</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
