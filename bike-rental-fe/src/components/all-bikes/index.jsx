import BikeCard from "../bike-card";
import {Grid, Paper, Typography} from "@mui/material";
import styled from "styled-components";
import Button from "@mui/material/Button";
import {BikeModals, ColorTypes} from "../../lib/constants/constants";
import CCheckbox from "../atoms/checkbox";
import {useEffect, useState} from "react";
import {Container, FilterBox, FilterWrapper} from "./styles";


const initFilter = {
    modal: [], color: [], rating: []
}

const AllBikes = ({bikeList}) => {
    const [allBikes, setAllBikes] = useState(bikeList)
    const [selectedFilter, setSelectedFilter] = useState(initFilter)

    const handleCheckboxChange = (title, key) => {
        const index = selectedFilter[key]?.indexOf(title)
        let newAr
        if (index > -1) {
            newAr = selectedFilter[key]
            newAr.splice(index, 1)
        } else newAr = [...selectedFilter[key], title]
        setSelectedFilter({...selectedFilter, [key]: newAr})
    }
    const clearFilter = () => {
        setSelectedFilter(initFilter)
        setAllBikes(bikeList)
    }

    useEffect(() => {
        let filteredBikes = []
        if (JSON.stringify(selectedFilter) === JSON.stringify(initFilter))
            setAllBikes(bikeList)
        else {
            filteredBikes = allBikes.filter(function(item) {
                for (let key in selectedFilter) {
                    if (item[key] !== undefined && selectedFilter[key]?.includes(item[key]))
                        return true;
                }
                return false;
            });
            setAllBikes(filteredBikes)
        }
    }, [selectedFilter])
    return (<Container spacing={2}>
            <FilterWrapper container flexDirection='column' justifyContent='flex-start' md={3}>
                <FilterBox variant='elevation' elevation={5}>
                    <Grid container flexDirection='row' justifyContent='space-between'>
                        <Typography variant='h5'>FILTER</Typography>
                        <Button variant="outlined" onClick={clearFilter}>clear</Button>
                    </Grid>
                    <div className="filter">
                        <div className="filter_heading">Modals</div>
                        <div className="filter_content">
                            {Object.keys(BikeModals).map(key => <CCheckbox key={key} base='modal' title={key}
                                                                           onChange={handleCheckboxChange}
                                                                           checked={selectedFilter.modal.includes(key)}/>)}
                        </div>
                        <div className="filter_heading">Colors</div>
                        <div className="filter_content">
                            {ColorTypes.map(key => <CCheckbox key={key} base='color' title={key}
                                                              onChange={handleCheckboxChange}
                                                              checked={selectedFilter.color.includes(key)}
                            />)}
                        </div>
                        <div className="filter_heading">Ratings</div>
                        <div className="filter_content">
                            {[1, 2, 3, 4, 5].map(key => <CCheckbox key={key} base='rating' title={key} rating
                                                                   onChange={handleCheckboxChange}
                                                                   checked={selectedFilter.rating.includes(key)}/>)}
                        </div>
                    </div>
                </FilterBox>
            </FilterWrapper>
            <Grid container justifyContent="center" md={9} spacing={5}>
                {allBikes.map(bike => (<BikeCard key={bike.id} bikeObj={bike}/>))}
            </Grid>
        </Container>)
}

export default AllBikes;