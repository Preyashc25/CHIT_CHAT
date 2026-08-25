import {Route,Routes} from 'react-router'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
    <Routes>
      <Route path='/' element={<ChatPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
    </Routes>
    </div>
    )
}

export default App