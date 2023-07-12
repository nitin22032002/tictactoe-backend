import React, { useContext } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ContextMain from "../context/ContextMain"

export default function DialogUser(props) {
    const context=useContext(ContextMain)
    const handleClose = () => {
        context.setOpen({status:false});
        if(context.getOpen.code){
            context.getSocket.emit("timeout");
        }
      };
  return (
    <Dialog
        open={context.getOpen.status}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {context.getOpen.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {context.getOpen.component}
          </DialogContentText>
        </DialogContent>
      </Dialog>
  )
}
