import { REALTIME_LISTEN_TYPES, createClient } from "@supabase/supabase-js";

import.meta.env.VITE_PROJECT_SUPABASE_NAME;
import.meta.env.VITE_PROJECT_SUPABASE_TOKEN;

const supabase = createClient(
  `https://${import.meta.env.VITE_PROJECT_SUPABASE_NAME}.supabase.co`,
  import.meta.env.VITE_PROJECT_SUPABASE_TOKEN
);
export function useSupabase() {
  const createRoom = async (roomName: string, roomCode: string) => {
    return await supabase
      .from("roomInfo")
      .insert({ roomName: roomName, roomCode: roomCode });
  };
  const checkRoom = async (roomCode: string) => {
    return await supabase
      .from("roomInfo")
      .select("*")
      .eq("roomCode", roomCode.trim());
  };
  const getRoomInfo = async (roomCode: string) => {
    return await supabase
      .from("roomParticipationInfo")
      .select("*")
      .eq("roomCode", roomCode.trim());
  };
  const insertParticipant = async (roomCode: string, nickName: string) => {
    return await supabase
      .from("roomParticipationInfo")
      .insert({ roomCode: roomCode, nickName: nickName })
      .select();
  };
  const createRealtimeConnection = async (
    roomCode: string,
    handleChange: (payload: any) => void
  ) => {
    supabase
      .channel(roomCode)
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        { event: "*", schema: "public", table: "roomParticipationInfo" },
        await handleChange
      )
      .subscribe();
  };
  const updatePoints = async (
    roomCode: string,
    nickName: string,
    point: string | number
  ) => {
    await supabase
      .from("roomParticipationInfo")
      .update({ roomCode: roomCode, nickName: nickName, point: point })
      .eq("roomCode", roomCode)
      .eq("nickName", nickName);
  };

  const deleteParticipant = async (roomCode: string, nickName: string) => {
    await supabase
      .from("roomParticipationInfo")
      .delete()
      .match({ roomCode: roomCode, nickName: nickName });
  };

  const updateParticipantDefault = async (roomCode: string) => {
    await supabase
      .from("roomParticipationInfo")
      .update({ roomCode: roomCode, point: null,openYn:false })
      .eq("roomCode", roomCode);
  };
  const updateOpenYn = async (roomCode: string) => {
    await supabase
      .from("roomParticipationInfo")
      .update({ openYn: true })
      .eq("roomCode", roomCode);
  };

  return {
    createRoom,
    checkRoom,
    getRoomInfo,
    insertParticipant,
    createRealtimeConnection,
    updatePoints,
    deleteParticipant,
    updateParticipantDefault,
    updateOpenYn
  };
}
