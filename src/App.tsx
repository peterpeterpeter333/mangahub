import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import PostForm from './PostForm'
import WorkDetail from './WorkDetail'
import EpisodeView from './EpisodeView'
import EpisodeForm from './EpisodeForm'
import Auth from './Auth'
import Dashboard from './Dashboard'
import WorkEdit from './WorkEdit'
import WorkManage from './WorkManage'
import EpisodeEdit from './EpisodeEdit'
import UserPage from './UserPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostForm />} />
        <Route path="/work/:id" element={<WorkDetail />} />
        <Route path="/work/:id/episode/:epId" element={<EpisodeView />} />
        <Route path="/work/:id/new-episode" element={<EpisodeForm />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/work/:id/edit" element={<WorkEdit />} />
        <Route path="/work/:id/manage" element={<WorkManage />} />
        <Route path="/work/:id/episode/:epId/edit" element={<EpisodeEdit />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App