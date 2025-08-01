import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar.jsx'
import { Routes ,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Search from './pages/Search.jsx'
import Shortlisted from './pages/Shortlisted.jsx'
import updateProfile from './pages/UpdateProfile.jsx'
import Matches from './pages/Matches.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import RecentChats from './pages/RecentChats.jsx'
import ChatRoom from './pages/ChatRoom.jsx'
import { useSocketJoin } from './hooks/useSocketJoin.js'






function App() {
   useSocketJoin();

  return (
      <> 
    <Navbar />
    <Routes>
      <Route  path="/" element={<Home/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
        } />
      <Route path="/search" element={
         <ProtectedRoute>
           <Search />
        </ProtectedRoute>

        } />
         <Route path="/shortlist" element={
        <ProtectedRoute> 
        <Shortlisted />
      </ProtectedRoute>} />

      <Route
    path="/update-profile"
      element={
    <ProtectedRoute>
      <updateProfile />
    </ProtectedRoute>

    
  }
/>
<Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />

<Route path="/adminDashboard" element={
        <ProtectedRoute> 
        <AdminDashboard/>
      </ProtectedRoute>} />


<Route path="/recentChats" element={
        <ProtectedRoute> 
        <RecentChats />
      </ProtectedRoute>} />

      <Route path="/chat/:userId" element={
        <ProtectedRoute> 
        <ChatRoom />
      </ProtectedRoute>} />


    </Routes>
   
    </>

    
  )
}

export default App
