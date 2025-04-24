import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Circuits from './pages/Circuits'
import Pilots from './pages/Pilots'
import CircuitDetail from './pages/CircuitDetail'
import PilotDetail from './pages/PilotDetail'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Constructors from './pages/Constructors'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/circuits" element={<Circuits/>}/>
        <Route path="/pilots" element={<Pilots/>}/>
        <Route path="/constructors" element={<Constructors/>}/>
        <Route path="/pilot/:name" element={<PilotDetail />} />
        <Route path="/circuit/:name" element={<CircuitDetail />} />
        <Route path="/constructor/:name" element={<CircuitDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}