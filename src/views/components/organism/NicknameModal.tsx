import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { useSupabase } from "@/utils/SupabaseUtil";

interface modalProps {
  isOpen: boolean;
  callbackFunc: (nickname: string) => void;
}
const NicknameModal: React.FC<modalProps> = ({
  isOpen = false,
  callbackFunc,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { insertParticipant } = useSupabase();
  const roomCode = location.pathname.slice(1).toString();

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (nickname: string) => {
    await insertParticipant(roomCode, nickname);
    sessionStorage.setItem(roomCode, nickname);
    callbackFunc(nickname);
  };
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const nickname = formJson.nickname;
            await handleSubmit(nickname);
            handleClose();
          },
        }}
        maxWidth="xs"
      >
        <DialogTitle>닉네임 등록</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nickname"
            name="nickname"
            label="닉네임"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NicknameModal;
