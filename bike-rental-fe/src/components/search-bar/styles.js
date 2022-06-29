import styled from "styled-components";
import {Box} from "@mui/material";
import {PrimaryButton} from "../../styles";

export const SearchWrapper = styled(Box)`
  display: flex;
  max-width: 1200px;
  flex-wrap: wrap;
  margin: var(--s-9) auto;
  padding: 0 var(--s-9);
  justify-content: center;
`
export const SearchButton = styled(PrimaryButton)`
  width: 170px;
  max-height: 54px;
`

export const Wrapper = styled.div`
  min-width: 230px;
  margin: 0 var(--s-2) var(--s-2) 0;
`
