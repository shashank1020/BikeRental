import React, {useState} from 'react';
// component
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {SearchButton, SearchWrapper, Wrapper} from "./styles";
// helper
import {validate} from "../../lib/common";
// notification
import {Location} from "../../lib/constants/constants";

const initForm = {
    location: '',
    fromDate: null,
    toDate: null,
}

const SearchBar = ({setForm, form}) => {
    const [formItem, setFormItem] = useState(form)
    const handleChange = (event) => {
        setFormItem({...formItem, location: event.target.value})
    };
    const handleRide = (e) => {
        e.preventDefault()
        if (validate(initForm, formItem))
            return setForm(formItem)
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SearchWrapper>
                <Wrapper>
                    <FormControl fullWidth>
                        <InputLabel id='location-select-label'>Location</InputLabel>
                        <Select
                            labelId='location-select-label'
                            id='Location-select'
                            value={formItem.location || ''}
                            label='Location'
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {Location.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Wrapper>
                <Wrapper>
                    <FormControl>
                        <DatePicker
                            disablePast
                            label="From"
                            value={formItem.fromDate}
                            onChange={(newValue) => setFormItem({...formItem, fromDate: newValue})}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </FormControl>
                </Wrapper>
                <Wrapper>
                    <DatePicker
                        disablePast
                        label="To"
                        value={formItem.toDate || ''}
                        onChange={(newValue) => setFormItem({...formItem, toDate: newValue})}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Wrapper>
                <SearchButton onClick={handleRide}>Ride Now</SearchButton>
            </SearchWrapper>
        </LocalizationProvider>
    )
}

export default SearchBar;