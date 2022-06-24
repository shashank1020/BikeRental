import BikeCard from "./bike-card";
import {Grid, Paper, Typography} from "@mui/material";
import styled from "styled-components";
import Button from "@mui/material/Button";
import {BikeModals, ColorTypes} from "../lib/constants/constants";
import CCheckbox from "./checkbox";
import {useEffect, useState} from "react";

const Container = styled(Grid)`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 512px) {
    flex-direction: column;
  }
`
const FilterWrapper = styled(Grid)`
  padding: var(--s-2);
`

const FilterBox = styled(Paper)`
  border-radius: var(--radius-none);
  padding: var(--s-5);
  height: inherit;
  max-width: 300px;

  h5 {
    font-weight: var(--fw-base);
    font-size: large;
  }

  @media only screen and (max-width: 512px) {
    width: 100%;
    margin: 0 auto var(--s-10);
  }

  .filter {
    position: relative;
    height: inherit;
  }

  .filter .filter_heading {
    margin-top: var(--s-1);
    font-weight: var(--fw-medium);
  }

  .filter .filter_content {
    height: 130px;
    overflow-y: scroll;
    
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 2px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: var(--radius-base);
      background-color: var(--c-gray-lighter);
      -webkit-box-shadow: var(--shadow-0);
    }
  }
`

const initFilter = {
    modal: [],
    color: [],
    rating: []
}

export const Bikes = ({bikeList}) => {
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
    useEffect(() => {

    }, [selectedFilter])
    const clearFilter = () => setSelectedFilter(initFilter)
    return (
        <Container spacing={2}>
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
                {bikeList && bikeList.length > 0 && bikeList.map(bike => (
                    <BikeCard key={bike.id} bikeObj={bike}/>
                ))}
            </Grid>
        </Container>
    )
}