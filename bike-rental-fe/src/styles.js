import styled from "styled-components";
import {Button} from "@mui/material";

export const PrimaryButton = styled(Button)`
  background: var(--c-blue-dark);
  color: var(--c-white);
  &:hover {
    background: var(--c-blue);
  }
`