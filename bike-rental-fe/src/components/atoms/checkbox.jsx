import React from 'react';
// components
import {Checkbox, Grid, Rating, Typography} from "@mui/material";
import styled from "styled-components";

function CCheckbox({base, title, rating = false, onChange, checked}) {
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

export default CCheckbox;

const FlexBox = styled(Grid)`
  display: flex;
  align-items: center;
  margin: 0;

  .MuiCheckbox-root {
    padding: var(--s-1);
  }
`