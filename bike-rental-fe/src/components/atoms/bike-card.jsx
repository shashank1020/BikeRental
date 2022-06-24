import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {BikeModals} from "../../lib/constants/constants";
import {Grid} from "@mui/material";
import styled from "styled-components";
import {Rating} from "@mui/lab";

const BookButton = styled(Button)`
  margin-left: var(--s-3);
  width: 120px;
  max-height: 54px;
  background-color: darkblue;
  color: white;

  &:hover {
    color: white;
    background-color: blue;
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

function BikeCard({bikeObj, isEditMode}) {
    const [edit, setEdit] = useState(isEditMode)
    // console.log(bikeObj)
    return (
        <Grid item>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="150"
                    image={BikeModals[bikeObj.modal]}
                    alt={bikeObj.modal.toString()}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {bikeObj.modal}
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
                        <Rating name="read-only" value={bikeObj.avgRating} readOnly size="small"/>
                    </Grid>
                    <BookButton size="medium">Book now</BookButton>
                </CardActions>
            </Card>
        </Grid>
    );
}

export default BikeCard;