import styled from "styled-components";
import {Button} from "@mui/material";
import {UserRole} from "./lib/constants/constants";
import IconButton from "@mui/material/IconButton";

export const PrimaryButton = styled(Button)`
  background: var(--c-blue-dark);
  color: var(--c-white);
  &:hover {
    background: var(--c-blue);
  }
`

export const theme = (userObj) => `${userObj.role === UserRole.MANAGER ? 'var(--c-red)':'var(--c-blue-dark)'}`

export const CustomClose = styled(IconButton)`
  position: absolute;
  right: -20px;
  top: -20px;
  background: var(--c-blue-dark);
  border-radius: 50%;
  border: 2px solid var(--c-blue);
  color: white;

  &:hover {
    background: var(--c-blue);
  }
`