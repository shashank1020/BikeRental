import React, {useState} from 'react';
import {Typography, Checkbox, Grid} from "@mui/material";
import styled from "styled-components";

const FlexBox = styled(Grid)`
  display: flex;
  align-items: center;
`

export default function CCheckbox({title}) {
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <FlexBox>
            <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{'aria-label': 'controlled'}}
            />
            <Typography variant={'subtitle2'}>{title}</Typography>
        </FlexBox>
    );
}
