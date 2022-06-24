import React, {useState} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styled from 'styled-components'
import {Location} from "../lib/constants/constants";
import {Button, FormHelperText} from "@mui/material";
import {GetBikes} from "../services/bike.service";
import {useUserAuthContext} from "../lib/context/userContext";
import {toast} from "react-toastify";

const SearchWrapper = styled(Box)`
  display: flex;
  max-width: 700px;
  margin: var(--s-9) auto;
  padding: 0 var(--s-9);
`
const SearchButton = styled(Button)`
  margin-left: var(--s-2);
  width: 170px;
  max-height: 54px;
  background-color: var(--c-blue-dark);
  color: var(--c-white);

  &:hover {
    background-color: var(--c-blue);
  }
`

const SearchBar = ({setBikes}) => {
    const [item, setItem] = useState('');
    const [error, setError] = useState(false)
    const {authToken, setUser, setAuthToken} = useUserAuthContext()
    const handleChange = (event) => {
        setItem(event.target.value);
        setError(false)
    };
    const handleRide = () => {
        if (item === '')
            setError(true)
        else {
            setError(false)
            GetBikes({authToken, location: item}).then(data => {
                setBikes(data)
            }).catch((e) => {
                if (e.response.status === 401) {
                    setUser(null)
                    setAuthToken(null)
                    localStorage.removeItem('token')
                    toast.error('Session Expired')
                } else toast.error('There was some error')
            })
        }
    }
    return (
        <SearchWrapper>
            <Box sx={{width: '100%'}} error={error}>
                <FormControl fullWidth>
                    <InputLabel id='location-select-label'>Location</InputLabel>
                    <Select
                        labelId='location-select-label'
                        id='Location-select'
                        value={item}
                        label='Location'
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {Location.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                    </Select>
                    {error && <FormHelperText style={{color: 'red'}}>must select one location</FormHelperText>}
                </FormControl>
            </Box>
            <SearchButton onClick={handleRide}>Ride Now</SearchButton>
        </SearchWrapper>
    )
}

export default SearchBar;