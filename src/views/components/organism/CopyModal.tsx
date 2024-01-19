import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react"

const CopyModal:React.FC = () => {
    const [open,setOpen] = useState<boolean>(false)
    const handleOpen = () => {
        setOpen(true);
      };
    const handleClose = () => {
        setOpen(false);
      };
      const handleCopy = async (text: string) => {
        try {
          await navigator.clipboard.writeText(text);
          alert('복사되었습니다.');
        } catch (e) {
          alert('복사에 실패하였습니다');
        }
    };
    return <>
        <Button onClick={handleOpen}>
            공유하기
        </Button>
        <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          
        }}
        maxWidth= 'xs'
        
      >
        <DialogTitle>공유하기</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            disabled
            margin="dense"
            id="address"
            name="address"
            type="text"
            fullWidth
            variant="standard"
            value={ window.location.href}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>handleCopy(window.location.href.toString())}>복사하기</Button>
        </DialogActions>
      </Dialog>
    </>
}

export default CopyModal