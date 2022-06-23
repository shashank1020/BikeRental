import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styled from 'styled-components'
import {location} from "../lib/constants/constants";
import {Button, FormHelperText} from "@mui/material";
import {GetBikes} from "../services/bike.service";
import {useUserAuthContext} from "../lib/context/userContext";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const SearchWrapper = styled(Box)`
  display: flex;
  max-width: 700px;
  margin: 30px auto;
  padding: 0 30px;
`
const ButtonStyles = styled(Button)`
  margin-left: 10px;
  width: 170px;
  max-height: 54px;
  background-color: darkblue;
  color: white;
  &:hover {
    color: white;
    background-color: blue;
  }
`

const SearchBar = ({setBikes}) => {
    const [item, setItem] = React.useState('');
    const [error, setError] = React.useState(false)
    const navigate = useNavigate()
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
                console.log(e)
                if (e.response.status === 401) {
                    setUser(null)
                    setAuthToken(null)
                    localStorage.removeItem('token')
                }
                toast.error('try re-login')
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
                        {location.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                    </Select>
                    {error && <FormHelperText style={{color: 'red'}}>must select one location</FormHelperText>}
                </FormControl>
            </Box>
            <ButtonStyles onClick={handleRide}>Ride Now</ButtonStyles>
        </SearchWrapper>
    )
}

export default SearchBar;