import styled from "styled-components";
import {Grid, Paper} from "@mui/material";

export const Container = styled(Grid)`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 512px) {
    flex-direction: column;
  }
`
export const FilterWrapper = styled(Grid)`
  padding: var(--s-2);
`

export const FilterBox = styled(Paper)`
  border-radius: var(--radius-none);
  padding: var(--s-5);
  height: inherit;
  max-width: 300px;

  h5 {
    font-weight: var(--fw-base);
    font-size: large;
  }

  @media only screen and (max-width: 512px) {
    width: 100%;
    margin: 0 auto var(--s-10);
  }

  .filter {
    position: relative;
    height: inherit;
  }

  .filter .filter_heading {
    margin-top: var(--s-1);
    font-weight: var(--fw-medium);
  }

  .filter .filter_content {
    height: 130px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 2px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: var(--radius-base);
      background-color: var(--c-gray-lighter);
      -webkit-box-shadow: var(--shadow-0);
    }
  }
`
