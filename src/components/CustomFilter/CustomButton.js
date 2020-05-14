import React from 'react';
import './CustomButton.sass';
import {Button, CircularProgress} from '@material-ui/core';

const CustomButton = (props) => {
    const {loading, className, children, onClick, disabled} = props

    return (
        <Button onClick={onClick} disabled={disabled} className={"customButton " + className}>
            {loading ? <CircularProgress thickness={5} className="loader" /> :  children}
        </Button>
    )
}

export default CustomButton;