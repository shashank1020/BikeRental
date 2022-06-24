import React, {useState} from 'react';
import {Location} from "../../lib/constants/constants";
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import {GetBikes} from "../../services/bike.service";
import {useUserAuthContext} from "../../lib/context/userContext";
import {toast} from "react-toastify";
import {SearchButton, SearchWrapper} from "./styles";


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
                    {error && <FormHelperText sx={{color: 'red'}}>must select one location</FormHelperText>}
                </FormControl>
            </Box>
            <SearchButton onClick={handleRide}>Ride Now</SearchButton>
        </SearchWrapper>
    )
}

export default SearchBar;