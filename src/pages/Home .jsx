import React from 'react'
import Sidebar from '../components/Sidebar'
import'./styles.css'
import Chat from '../components/Chat'

const Home  = () => {
  return (

        <div className='home-container'>
            <Sidebar/>
            <Chat/>
        </div>

  )
}

export default Home 