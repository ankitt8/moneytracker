import React, {useState} from 'react';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import AddTransactionModal from "./AddTransactionModal";

interface AddTransactionPropsInterface {
    userId: object;
}

const AddTransaction: React.FC<AddTransactionPropsInterface> = ({userId}) => {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <AddOutlinedIcon fontSize="large" onClick={handleClickOpen}/>
            <AddTransactionModal userId={userId} open={open} handleClose={handleClose}/>
        </>

    )
}

export default AddTransaction;

