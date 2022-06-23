import BikeCard from "./bike-card";
import {Card, Grid, Paper, Typography} from "@mui/material";
import styled from "styled-components";
import Button from "@mui/material/Button";
import {BikeModals} from "../lib/constants/constants";
import CCheckbox from "./checkbox";

const Container = styled(Grid)`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 512px) {
    flex-direction: column;
  }
`
const FilterWrapper = styled(Grid)`
  height: 50vh;
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
  .modals {
    overflow: scroll;
  }
  .filter_heading {
    margin-top: var(--s-1);
    font-weight: var(--fw-medium);
  }
`

export const Bikes = ({bikeList}) => {
    console.log(bikeList, typeof bikeList)
    let filter = {}
    const clearFilter = () => filter = {}
    return (
        <Container spacing={2}>
            <FilterWrapper container flexDirection='column' justifyContent='flex-start' md={3}>
                <FilterBox variant='elevation' elevation={5}>
                    <Grid container flexDirection='row' justifyContent='space-between'>
                        <Typography variant='h5'>FILTER</Typography>
                        <Button variant="outlined" onClick={clearFilter}>clear</Button>
                    </Grid>
                    <div className="modals">
                        <div className="filter_heading">Modals</div>
                        {Object.keys(BikeModals).map(key => <CCheckbox key={key} title={key}/>)}
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