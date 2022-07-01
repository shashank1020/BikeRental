import React, {useState} from 'react';
// component
import {Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Rating, Typography} from '@mui/material';
import {BikeModels, UserRole} from "../../lib/constants/constants";
import styled from "styled-components";
import {CardActionButton} from "../../styles";
import {useUserAuthContext} from "../../lib/context/userContext";
import {deleteBike} from "../../services/bike.service";
import {toast} from "react-toastify";
import {error400} from "../../lib/common";
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate} from "react-router-dom";

function BikeCard({bikeObj, handelBooking, setRefreshPage, setUpdateBikeData}) {
    const [isBooked, setIsBooked] = useState(false)
    const {user, authToken} = useUserAuthContext()
    const isAvailable = bikeObj.isAvailable
    const navigate = useNavigate()
    const bookBike = () => {
        handelBooking(bikeObj.id).then((r) => {
            setIsBooked(true)
        })
    }

    const handleUpdate = () => {
        setUpdateBikeData({...bikeObj, isUpdate: true, openModal: true})
    }

    const handleDelete = () => {
        deleteBike({id: bikeObj.id}, authToken).then(r => {
            toast.success('deleted successfully')
            setRefreshPage(true)
        }).catch(e => error400(e))
    }

    return (
        <Grid item>
            <Wrapper style={{background: `${isAvailable ? 'var(--c-white)' : 'var(--c-gray-light)'}`}}>
                {!isAvailable && <div className="center"><CardHeader title='Not Available'/></div>}
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
                    {!isBooked && isAvailable && <BookButton size="medium" onClick={bookBike}>Book now</BookButton>}
                    {isBooked && <BookedButton size="medium">Booked</BookedButton>}
                </CardActions>
                {user.role === UserRole.MANAGER && (
                    <CardActions>
                        <Button variant='contained' color='success' onClick={handleUpdate}>Edit</Button>
                        <Button variant='outlined' color='info'
                                onClick={() => navigate(`/reservations?bikeId=${bikeObj.id}&model=${bikeObj.model}`)}>Reservations</Button>
                        <CardActionButton onClick={handleDelete}>
                            <DeleteIcon/>
                        </CardActionButton>

                    </CardActions>
                )}
            </Wrapper>
        </Grid>
    );
}

export default BikeCard;

const Wrapper = styled(Card)`
  position: relative;
  max-width: 375px;
  overflow: visible;
`

const CustomButton = styled(Button)`
  margin-left: var(--s-3);
  width: 120px;
  max-height: 54px;
  color: var(--c-white);
`
const BookButton = styled(CustomButton)`
  background-color: var(--c-blue-dark);

  &:hover {
    background-color: var(--c-blue);
  }
`
const BookedButton = styled(CustomButton)`
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