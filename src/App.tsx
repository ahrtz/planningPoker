import './App.css'
import { Button } from '@mui/material'
import {useSupabase} from './utils/SupabaseUtil' 
import { useState } from 'react';
import {
useNavigate
} from "react-router-dom";

function App() {

  const {createRoom} = useSupabase();
  const navigate = useNavigate();
  const [roomName,setRoomName] = useState<string>("");
  const handleButtonClick = async() => {
    const time = Date.now();
    const result =  await createRoom(roomName,time.toString())
    if (result.status == 201){
      console.log("성공")
      navigate(`${btoa(time.toString())}`);
    }else{
      console.log("실패")
    }
    console.log(result)
  }
  return (
    <>
     
    <h1>Vite + React</h1>
    <input type="text" value={roomName} onChange={(e)=>setRoomName(e.target.value)}/>
    <Button onClick={handleButtonClick}>
        방 생성하기 
    </Button>
    </>
  )
}

export default App
