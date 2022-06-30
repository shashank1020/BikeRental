import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useUserAuthContext} from "../lib/context/userContext";
import {getReservations} from "../services/bike.service";
import {error400, logout} from "../lib/common";
import styled from 'styled-components'
import ReservationCard from "../components/atoms/reservation-card";
import {Divider, Grid, Typography} from "@mui/material";
import {Pagination} from "@mui/lab";

const ReservationPage = () => {
    const [reservations, setReservations] = useState(null);
    const [pages, setPages] = useState({currPage: 1, totalPages: 3});
    const [refreshPage, setRefreshPage] = useState(true);
    const {user, authToken, setUser, setAuthToken} = useUserAuthContext()
    const [searchParams, _] = useSearchParams();
    const [heading, setHeading] = useState('')
    const getHeading = () => {
        const title = 'All Reservations of '
        const userid = searchParams.get('userId')
        if (userid) return title + searchParams.get('email').split('@')[0]
        const bikeid = searchParams.get('bikeId')
        if (bikeid) return title + searchParams.get('name')
        return title + user.email.split('@')[0]
    }
    useEffect(() => {
        getReservations({
            page: pages.currPage || 1,
            bikeId: searchParams.get('bikeId'),
            userId: searchParams.get('userId')
        }, authToken)
            .then(r => {
                setReservations(r.reservations)
                setPages({currPage: r.page, totalPages: r.totalPages})
                setHeading(() => getHeading())
                setRefreshPage(false)
            })
            .catch(e => {
                if (e.error?.response?.data?.statusCode === 401) {
                    logout(setUser, setAuthToken)
                }
                error400(e)
            })
    }, [pages.currPage, refreshPage, authToken])
    return <>
        <Wrapper>
            <Grid>
                <Typography variant='h2' textAlign={'center'}>{heading}</Typography>
                <Divider/>
            </Grid>
            <Grid className='reservation' container md={9} justifyContent="center">
                <Grid container justifyContent="center" spacing={5} className='all-reservation-wrapper'>
                        {reservations && reservations.length > 0 && reservations.map(reservation =>
                            <ReservationCard key={reservation.id} reservations={reservation}
                                             setRefreshPage={setRefreshPage}/>
                        )}
                </Grid>
                {reservations && reservations.length <= 0 &&
                    <Typography variant="h4">No Reservations Found</Typography>}
                <Grid className="pagination-style">
                    {reservations && reservations.length > 0 && <Pagination
                        count={pages.totalPages}
                        page={pages.currPage}
                        onChange={(_, cpage) => setPages({...pages, currPage: cpage})}
                        color="primary"
                    />}
                </Grid>
            </Grid>
        </Wrapper>
    </>
}


const Wrapper = styled.div`
  // width:50%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .reservation {
    margin: 20px auto;
  }
  
  .all-reservation-wrapper {
    margin-bottom: var(--s-1);
  }
  
  .pagination-style {
    // background:yellow;
    margin: 25px 0;
    display: flex;
    justify-content: center;
  }

  .add-btn {
    position: fixed;
    bottom: 12px;
    right: 60px;
  }

`

export default ReservationPage