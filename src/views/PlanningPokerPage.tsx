import { useEffect } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import {useSupabase} from '@/utils/SupabaseUtil.tsx' 

const PlanningPokerPage = () => {    
    const location = useLocation();
    console.log((location.pathname.slice(1)))
    console.log(btoa(location.pathname.slice(1).toString()))
    const {checkRoom} = useSupabase();

    const onLoad = async() => {
        const result = await checkRoom(location.pathname.slice(1).toString())
        console.log(result)
        if (result.data.length>0){
            console.log("있음") // todo : 있을때 로직 진행
        }else{
            console.log("없음") // 없을때 에러화면 진행 
        }
    }
    useEffect(()=>{
        onLoad()
    },[])
    return <>
        pokerPage
        </>
}

export default PlanningPokerPage