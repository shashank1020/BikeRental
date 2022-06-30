import {useState} from "react";
import {ReservationStatus} from "../../lib/constants/constants";
import {Box, Button, Card, CardActions, CardContent, Rating, Tooltip, Typography} from "@mui/material";
import styled from "styled-components";
import CircleIcon from '@mui/icons-material/Circle';
import {useUserAuthContext} from "../../lib/context/userContext";
import {error400} from "../../lib/common";
import {toast} from "react-toastify";
import {addRating, cancelReservation} from "../../services/bike.service";

const ReservationCard = ({reservations, setRefreshPage}) => {
    const [rate, setRate] = useState(reservations.bike.avgRating || 0);
    const [ratingMode, setRatingMode] = useState(false);
    const {user,authToken} = useUserAuthContext()
    const isActive = reservations?.status === ReservationStatus.ACTIVE;
    const handleAddRating = () => {
        if (rate === 0) return toast.error("Please enter a rating");
        addRating({id: reservations.id, rate}, authToken)
            .then(() => {
                toast.success("Rating added!");
                setRatingMode(false);
                setRefreshPage(true)
            })
            .catch(e => error400(e));
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
        <StyledComponents>
            <Box sx={{minWidth: 275}}>
                <Card variant="outlined">
                        <CardContent sx={{paddingBottom: "0"}}>
                            <div className="column">
                                <Typography variant="h4" component="div">
                                    {reservations.bike.model}
                                </Typography>
                                <Tooltip title={<p>{isActive ? "Active" : "Cancelled"}</p>} placement="top"
                                         arrow><CircleIcon color={isActive ? 'success' : 'error'}/></Tooltip>
                            </div>
                            <div className="column">
                                <div>
                                    <Rating className="rating" name="read-only" value={rate}
                                            onChange={(_, newValue) => ratingMode && setRate(newValue)}
                                            readOnly={!ratingMode}/>
                                </div>
                                <Typography variant="h6">
                                    {reservations.fromDate.slice(0, 10)} to {reservations.toDate.slice(0, 10)}
                                </Typography>
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
            </Box>
        </StyledComponents>
    </>;
}


const StyledComponents = styled.div`

  margin: 15px 0;
  box-ashadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  .heading {
    text-align: center;
  }

  .column {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .rating {
    margin: 8px 0 0 0;
  }
`

export default ReservationCard