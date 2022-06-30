import React, {useState} from 'react';
// component
import {Button, Card, CardActions, CardContent, CardMedia, Grid, MenuItem, TextField, Typography} from '@mui/material';
import {Rating} from "@mui/lab";
import {BikeModels} from "../../lib/constants/constants";
import styled from "styled-components";

const CustomButtom = styled(Button)`
  margin-left: var(--s-3);
  width: 120px;
  max-height: 54px;
  color: white;
`
const BookButton = styled(CustomButtom)`
  background-color: var(--c-blue-dark);

  &:hover {
    background-color: var(--c-blue);
  }
`
const BookedButtom = styled(CustomButtom)`
  background-color: var(--c-gray-lighter);

  &:hover {
    cursor: not-allowed;
    background-color: var(--c-gray-lighter);
  }
`
const ColoredDot = styled.div`
  display: inline-flex;
  align-content: center;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  border: var(--border-size-base) var(--border-ci-dark) solid;
  background-color: ${props => props.color || 'black'};
`

function BikeCard({addBike = false, bikeObj, handelBooking, setAddBike}) {
    const [isBooked, setIsBooked] = useState(false)
    const bookBike = () => {
        handelBooking(bikeObj.id).then(data => {
            setIsBooked(true)
        })
    }
    return (
        <Grid item>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="150"
                    image={BikeModels[bikeObj.model]}
                    alt={bikeObj.model.toString()}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {bikeObj.model.toString()}
                    </Typography>
                    <Grid container justifyContent='space-between'>
                        <Typography variant='caption' component="span">
                            Location: {bikeObj.location}
                        </Typography>
                        <Typography variant='caption' component='span'>
                            color: <ColoredDot color={bikeObj.color}/>
                        </Typography>
                    </Grid>
                </CardContent>
                <CardActions sx={{justifyContent: 'space-between'}}>
                    <Grid item flexDirection='column' xs={3}>
                        <Typography variant='caption' component='p'>Rating</Typography>
                        <Rating name="read-only" value={Number(bikeObj.avgRating)} readOnly size="small"/>
                    </Grid>
                    {!isBooked && <BookButton size="medium" onClick={bookBike}>Book now</BookButton>}
                    {isBooked && <BookedButtom size="medium">Booked</BookedButtom>}
                </CardActions>
            </Card>
        </Grid>
    );
}

export default BikeCard;