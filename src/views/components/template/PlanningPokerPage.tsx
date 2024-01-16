
import {useSupabase} from '@/utils/SupabaseUtil.tsx' 
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import NicknameModal from '../organism/NicknameModal';
import { Button } from '@mui/material';

type participantInfo={
    nickName:string,
    point:string|undefined
}


const PlanningPokerPage = () => {
    const {getRoomInfo,createRealtimeConnection,updatePoints} = useSupabase();
    const [participants,setParticipants] = useState<participantInfo[]>([])
    const location = useLocation();
    const roomCode = location.pathname.slice(1).toString()
    const [nickName,setNickName] = useState("")
    const [open,setOpen] = useState<boolean>(false)
   
    const getParticipantInfo = async() => {
        const result = await getRoomInfo(roomCode)
        console.log("방정보: ", result)
        if (result.data) setParticipants(result.data)
    }
    const handleChange = async (payload: any) => {
        console.log(payload)
        await setParticipants((prevData) => {
          const existItem = prevData?.find((item) => item.nickName === payload.new.nickName);
          const oldItem = prevData?.find((item) => item.nickName === payload.old.nickName);
        if (existItem || oldItem) {
            return prevData?.map((item) =>
              item?.nickName === (existItem?.nickName||oldItem?.nickName) ? payload.new : item
            );
          } else {
            return [...prevData, payload.new];
          }
        });
        console.log(participants)
      };
    createRealtimeConnection(roomCode,handleChange)
    const handleUpdatePoints =  (e:any) => {
        console.log(roomCode,nickName,e.target.value)
         updatePoints(roomCode,nickName,e.target.value)
    }
    useEffect(()=>{
        getParticipantInfo()
        if (sessionStorage.getItem(roomCode)){
            setNickName(sessionStorage.getItem(roomCode)!)
            console.log("여기");
            setOpen(false)
            // 방에 등록되어있으면
            // 그냥 진행
        }else{
            // 사용자 등록하기
            setOpen(true)
        }
    },[])

    return (
    <>
        참여자
        <ul>
        {participants.map((participant) => (
          <li key={participant?.nickName}>{participant?.nickName +":"+ participant?.point}</li>
            ))}
        </ul>
        점수
        <div>
            <button onClick={handleUpdatePoints} value={'1'}> 1</button>
            <button onClick={handleUpdatePoints}  value={'2'}> 2</button>
            <button onClick={handleUpdatePoints}  value={'3'}> 3</button>
            <button onClick={handleUpdatePoints}  value={'4'}> 4</button>
           
        </div>
        <NicknameModal isOpen={open} callbackFunc={setNickName}/>
    </>)
}

export default PlanningPokerPage