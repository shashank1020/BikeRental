import BikeCard from "./bike-card";
import {Card, Grid, Paper} from "@mui/material";
import styled from "styled-components";

const Container = styled(Grid)`
  display: flex;
  flex-direction: row;
  background-color: transparent;
  @media only screen and (max-width: 512px) {
    flex-direction: column;
  }
`
const FilterWrapper = styled(Grid)`
  //background-color: red;
  height: 50vh;
  padding: 10px;

`

const FilterBox = styled(Paper)`
  //border: 1px gray solid;
  border-radius: 0;
  height: inherit;
  max-width: 300px;
  @media only screen and (max-width: 512px) {
    width: 100%;
    margin: 0 auto 40px;
  }
`

export const Bikes = ({bikeList}) => {
    console.log(bikeList, typeof bikeList)
    return (
        <Container spacing={2}>
            <FilterWrapper container flexDirection='column' justifyContent={'flex-start'} md={3}>
                <FilterBox variant={'elevation'} elevation={5}>
                    <p>sjdhb</p>
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