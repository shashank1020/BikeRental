import styled from "styled-components";
import {Grid} from "@mui/material";

export const Container = styled(Grid)`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 512px) {
    flex-direction: column;
  }

  .all-bike-wrapper {
    height: 65vh;
    overflow-y: scroll;
    margin-bottom: var(--s-1);
  }

  .pagination {
    margin: var(--s-6) 0;
  }
`
export const FilterWrapper = styled(Grid)`
  padding: var(--s-2);
`
