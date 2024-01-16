import { createClient } from "@supabase/supabase-js";

import.meta.env.VITE_PROJECT_SUPABASE_NAME
import.meta.env.VITE_PROJECT_SUPABASE_TOKEN



const supabase = createClient(`https://${import.meta.env.VITE_PROJECT_SUPABASE_NAME}.supabase.co`, import.meta.env.VITE_PROJECT_SUPABASE_TOKEN);
export function useSupabase() {
    

    const createRoom =async(roomName:string,roomCode:string)=>{
        return await supabase.from("roomInfo").insert({roomName:roomName,roomCode:btoa(roomCode)})
    }

    const checkRoom = async(roomCode:string) => {
        console.log("roomCode : " + btoa(roomCode))
        return await supabase.from("roomInfo").select("*").eq("roomCode",btoa(roomCode).replace(/^\s+|\s+$/gm,''))
    }

    return {createRoom,checkRoom}
}
