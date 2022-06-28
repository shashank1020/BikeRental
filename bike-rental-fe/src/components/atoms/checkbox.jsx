import React from 'react';
// components
import {Checkbox, Grid, Typography} from "@mui/material";
import styled from "styled-components";
import {Rating} from "@mui/lab";

const FlexBox = styled(Grid)`
  display: flex;
  align-items: center;
  margin: 0;

  .MuiCheckbox-root {
    padding: var(--s-1);
  }
`

export default function CCheckbox({base, title, rating = false, onChange, checked}) {
    return (
        <FlexBox>
            <Checkbox
                checked={checked}
                onChange={() => onChange(title, base)}
                inputProps={{'aria-label': 'controlled'}}
            />
            {!rating && <Typography variant={'subtitle2'}>{title}</Typography>}
            {rating && <Rating name="read-only" value={title} readOnly size="small"/>}
        </FlexBox>
    );
}
