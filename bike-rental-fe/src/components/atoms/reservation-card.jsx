import {useState} from "react";
import {BikeModels, ReservationStatus} from "../../lib/constants/constants";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Divider,
    Grid,
    Rating,
    Typography
} from "@mui/material";
import styled from "styled-components";
import {useUserAuthContext} from "../../lib/context/userContext";
import {error400} from "../../lib/common";
import {toast} from "react-toastify";
import {addRating, cancelReservation} from "../../services/bike.service";
import {useNavigate} from "react-router-dom";

const ReservationCard = ({reservations, setRefreshPage}) => {
    const [rate, setRate] = useState(reservations.bike.avgRating || 0);
    const [ratingMode, setRatingMode] = useState(false);
    const {user, authToken} = useUserAuthContext()
    const isActive = reservations?.status === ReservationStatus.ACTIVE;
    const navigate = useNavigate()
    const handleAddRating = () => {
        if (rate === 0) return toast.error("Please enter a rating");
        addRating({id: reservations.id, rate}, authToken)
            .then(() => {
                toast.success("Rating added!");
                setRatingMode(false);
                setRefreshPage(true)
            })
            .catch(e => {
                if (e.response.data.statusCode === 401) {
                    navigate('/')
                }
                error400(e)
            });
    }

    const handleClick = () => {
        cancelReservation(reservations.id, authToken)
            .then(() => {
                toast.success("Reservation has been cancelled!");
                setRefreshPage(true)
            })
            .catch(e => error400(e));
    }
    return <>
        <Wrapper item>
                <Card variant="outlined" style={{background: `${isActive ? 'var(--c-white)' : 'var(--c-gray-light)'}`}}>
                    {!isActive && <div className="center"><CardHeader title='CANCELED' /></div>}
                    <CardMedia
                        component="img"
                        height="150"
                        image={BikeModels[reservations.bike.model]}
                        alt={reservations.bike.model.toString()}
                    />
                    <CardContent sx={{paddingBottom: "0"}}>
                        <div className="column">
                            <Typography gutterBottom variant="h5" component="div">
                                {reservations.bike.model}
                            </Typography>
                        </div>
                        <Typography variant="body1">
                            <strong>from: </strong>{reservations.fromDate.slice(0, 10)}
                        </Typography>
                        <Typography variant="body1">
                            <strong>to: </strong>{reservations.toDate.slice(0, 10)}
                        </Typography>
                        <div className="column">
                            <Rating className="rating" name="read-only" value={rate}
                                    onChange={(_, newValue) => ratingMode && setRate(newValue)}
                                    readOnly={!ratingMode} size={ratingMode ? 'medium' : 'small'}/>

                        </div>
                    </CardContent>
                    <CardActions>
                        <div className="column">
                            <div>
                                {!reservations.userRating && reservations.userId === user.id && isActive && (ratingMode ?
                                    <Button onClick={handleAddRating}>Done</Button> :
                                    <Button onClick={() => setRatingMode(true)}>Rate Now</Button>)}
                            </div>
                            {isActive && <Button onClick={handleClick}>Cancel Reservation</Button>}
                        </div>
                    </CardActions>
                </Card>
        </Wrapper>
    </>;
}


const Wrapper = styled(Grid)`
  max-width: 325px;
  .heading {
    text-align: center;
  }

  .column {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .rating {
    margin-top: var(--s-2);
  }
`

export default ReservationCard