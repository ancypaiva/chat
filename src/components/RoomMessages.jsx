import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { RoomContext } from '../context/RoomContext'
import RoomMessage from './RoomMessage'

const RoomMessages = () => {
  const [messages,setMessages] = useState([])
  const {data} = useContext(RoomContext)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats",data.RoomId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    },[messages]);
    return () => {
      unsub()
    }
  },[data.RoomId])
  console.log(messages,'messages');
  return (
    <div className='messages'>
      {messages.map((m) => (

        <RoomMessage message = {m} key={m.id}/>
      ))}
    </div>
  )
}

export default RoomMessages