import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {BikeModalImages} from "../lib/constants/constants";
import {Divider, Grid} from "@mui/material";
import styled from "styled-components";
import {random} from "lodash";
import {Rating} from "@mui/lab";

const ButtonStyles = styled(Button)`
  margin-left: 10px;
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
  border: black 2px solid;
  background-color: ${props => props.color || 'black'};
`

function BikeCard({bikeObj, isEditMode}) {
    const [edit, setEdit] = useState(isEditMode)
    console.log(bikeObj)
    return (
        <Grid item>
            <Card sx={{maxWidth: 345}}>
                <CardMedia
                    component="img"
                    height="150"
                    image={BikeModalImages[bikeObj.modal]}
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
                        <Rating name="read-only" value={bikeObj.avgRating} readOnly size="small" />
                        {/*<Divider/>*/}
                    </Grid>
                    <ButtonStyles size="medium">Book now</ButtonStyles>
                </CardActions>
            </Card>
        </Grid>
    );
}

export default BikeCard;