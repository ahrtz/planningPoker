import { useSupabase } from "@/utils/SupabaseUtil.tsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NicknameModal from "../organism/NicknameModal";
import { Button } from "@mui/material";
import CopyModal from "../organism/CopyModal";

type participantInfo = {
  nickName: string;
  point: string | undefined;
};

const PlanningPokerPage = () => {
  const {
    getRoomInfo,
    createRealtimeConnection,
    updatePoints,
    deleteParticipant,
    updateParticipantDefault,
  } = useSupabase();
  const [participants, setParticipants] = useState<participantInfo[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const roomCode = location.pathname.slice(1).toString();
  const [nickName, setNickName] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [cardOpen, setCardOpen] = useState<boolean>(false);
  const handleChange = async (payload: any) => {
    await setParticipants((prevData) => {
      const existItem = prevData?.find(
        (item) => item.nickName === payload.new.nickName
      );
      const oldItem = prevData?.find(
        (item) => item.nickName === payload.old.nickName
      );
      if (payload.eventType == "DELETE") {
        return prevData?.filter((item) => item?.nickName != oldItem?.nickName);
      } else if (existItem || oldItem) {
        return prevData?.map((item) =>
          item?.nickName === (existItem?.nickName || oldItem?.nickName)
            ? payload.new
            : item
        );
      } else {
        return [...prevData, payload.new];
      }
    });
  };

  const getParticipantInfo = async () => {
    const result = await getRoomInfo(roomCode);
    if (result.data) setParticipants(result.data);
  };
  const handleUpdatePoints = (e: any) => {
    updatePoints(roomCode, nickName, e.target.value);
  };
  const handledelete = async () => {
    await deleteParticipant(roomCode, nickName);
    sessionStorage.removeItem(roomCode);
    navigate("/");
  };
  const handleFlipCard = () => {
    setCardOpen(true);
  };
  const handleInit = () => {
    setCardOpen(false);
    updateParticipantDefault(roomCode);
  };
  useEffect(() => {
    createRealtimeConnection(roomCode, handleChange);
    if (sessionStorage.getItem(roomCode)) {
      setNickName(sessionStorage.getItem(roomCode)!);
      setOpen(false);
      // 방에 등록되어있으면
      // 그냥 진행
    } else {
      // 사용자 등록하기
      setOpen(true);
    }
    getParticipantInfo();
  }, []);

  return (
    <>
      {/* todo 각 컴포넌트 분리 
    1. 참여자
    2. 점수입력 카드 
    */}
      참여자
      <ul>
        {participants.map((participant) => (
          <li key={participant?.nickName}>
            {participant?.nickName + ":"}
            {cardOpen && participant?.point}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handledelete}> 방나가기</button>
        <button onClick={handleFlipCard}>Flip Card</button>
        <button onClick={handleInit}>다음 스토리</button>
      </div>
      점수
      <div>
        <button onClick={handleUpdatePoints} value={"1"}>
          {" "}
          1
        </button>
        <button onClick={handleUpdatePoints} value={"2"}>
          {" "}
          2
        </button>
        <button onClick={handleUpdatePoints} value={"3"}>
          {" "}
          3
        </button>
        <button onClick={handleUpdatePoints} value={"4"}>
          {" "}
          4
        </button>
      </div>
      <NicknameModal isOpen={open} callbackFunc={setNickName} />
      <CopyModal />
    </>
  );
};

export default PlanningPokerPage;
