import styled from "styled-components";
import Box from "@mui/material/Box";
import {Button} from "@mui/material";

export const SearchWrapper = styled(Box)`
  display: flex;
  max-width: 700px;
  margin: var(--s-9) auto;
  padding: 0 var(--s-9);
`
export const SearchButton = styled(Button)`
  margin-left: var(--s-2);
  width: 170px;
  max-height: 54px;
  background-color: var(--c-blue-dark);
  color: var(--c-white);

  &:hover {
    background-color: var(--c-blue);
  }
`