import { useState } from 'react'
import './App.css'
import { AdminLayout } from './components/layout/AdminLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AdminLayout />
    </>
  )
}

export default App
