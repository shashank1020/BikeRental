import styled from "styled-components";
import {Button} from "@mui/material";
import {UserRole} from "./lib/constants/constants";

export const PrimaryButton = styled(Button)`
  background: var(--c-blue-dark);
  color: var(--c-white);
  &:hover {
    background: var(--c-blue);
  }
`

export const theme = (userObj) => `${userObj.role === UserRole.MANAGER ? 'var(--c-red)':'var(--c-blue-dark)'}`