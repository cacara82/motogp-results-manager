import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Circuits from './pages/Circuits'
import Pilots from './pages/Pilots'
import CircuitDetail from './pages/CircuitDetail'
import PilotDetail from './pages/PilotDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/circuits" element={<Circuits/>}/>
        <Route path="/pilots" element={<Pilots/>}/>
        <Route path="/pilot/:name" element={<PilotDetail />} />
        <Route path="/circuit/:name" element={<CircuitDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}