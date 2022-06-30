import styled from "styled-components";
import {Grid, Paper} from "@mui/material";

export const Container = styled(Grid)`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 512px) {
    flex-direction: column;
  }
  .add-bike {
    margin: var(--s-4);
  }
  .all-bike-wrapper {
    height: 70vh;
    overflow-y: scroll;
    margin-bottom: var(--s-1);
  }
  .pagination-style{
    margin:25px 0;
    display:flex;
    justify-content:center;
  }
`
export const FilterWrapper = styled(Grid)`
  padding: var(--s-2);
`
