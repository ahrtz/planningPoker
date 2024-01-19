import { REALTIME_LISTEN_TYPES, createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";


import.meta.env.VITE_PROJECT_SUPABASE_NAME
import.meta.env.VITE_PROJECT_SUPABASE_TOKEN


const supabase = createClient(`https://${import.meta.env.VITE_PROJECT_SUPABASE_NAME}.supabase.co`, import.meta.env.VITE_PROJECT_SUPABASE_TOKEN);

interface test {
    id:string,
    name:string
}


const SupaTestPage : React.FC =() => {
    const [test,setTest] = useState<test[]|null>([]);
    const handleChange = (payload:any) => {
        setTest((prevData) => {
            const existItem = prevData?.find((item)=> item.id ===payload.new.id)
            if (existItem){
                return prevData?.map((item)=> item?.id === existItem.id ? payload.new : item)
            }else{
                return [...prevData , payload.new]
            }
        })
      }
      
      // Listen to inserts
      supabase
        .channel('countries')
        .on(REALTIME_LISTEN_TYPES.POSTGRES_CHANGES, { event: '*', schema: 'public', table: 'countries' }, handleChange)
        .subscribe()
        
    async function getCountries() {
        const { data } = await supabase.from("countries").select();
        setTest(data)
      }

     const handleclick = async (e:any) => {
       
        await supabase.from("countries").insert({name:e.target.value})

    }
   
    useEffect (()=>{
        getCountries()
    },[])
    return (<>
    <div>
        실시간 통신 테스트 페이지 
    </div>
    <button onClick={handleclick} value={'1번버튼'}> 111</button>
    <button onClick={handleclick} value={'2번버튼'}> 112</button>
    <button onClick={handleclick} value={'3번버튼'}> 113</button>
    {test.map((country) => (
          <li key={country?.id}>{country?.name}</li>
        ))}
    </>)
}

export default SupaTestPage