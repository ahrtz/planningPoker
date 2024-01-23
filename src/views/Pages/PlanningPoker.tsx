import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSupabase } from "@/utils/SupabaseUtil.tsx";
import PlanningPokerPage from "@/views/components/template/PlanningPokerPage.tsx";

const PlanningPoker = () => {
  const location = useLocation();
  const { checkRoom } = useSupabase();
  const [roomExist, setRoomExist] = useState(false);

  const onLoad = async () => {
    const result = await checkRoom(location.pathname.slice(1).toString());

    if (result?.data && result?.data.length > 0) {
      setRoomExist(true);
      // todo : 있을때 로직 진행
    } else {
      setRoomExist(false);
      // 없을때 에러화면 진행
    }
  };
  useEffect(() => {
    onLoad();
  }, []);

  return <>{roomExist ? <PlanningPokerPage /> : "에러페이지"}</>;
};

export default PlanningPoker;
