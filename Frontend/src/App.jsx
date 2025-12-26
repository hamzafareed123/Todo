import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 '>
    <h1 className='font-bold text-2xl '>TodoApp</h1>
    <button className='btn btn-primary'>button</button>
    </div>
    </>
  )
}

export default App
