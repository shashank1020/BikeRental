import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useUserAuthContext} from "../lib/context/userContext";
import {getReservations} from "../services/bike.service";
import {error400, logout} from "../lib/common";
import styled from 'styled-components'
import ReservationCard from "../components/atoms/reservation-card";
import {Typography} from "@mui/material";
import {Pagination} from "@mui/lab";

const ReservationPage = () => {
    const [reservations, setReservations] = useState(null);
    const [pages, setPages] = useState({currPage: 1, totalPages: 3});
    const [refreshPage, setRefreshPage] = useState(true);
    const {user, authToken, setUser, setAuthToken} = useUserAuthContext()
    const [searchParams, _] = useSearchParams();

    useEffect(() => {
        getReservations({
            page: pages.currPage || 1,
            bikeId: searchParams.get('bikeId'),
            userId: searchParams.get('userId')
        }, authToken)
            .then(r => {
                setReservations(r.reservations)
                setPages({currPage: r.page, totalPages: r.totalPages})
            })
            .catch(e => {
                if (e.error?.response?.data?.statusCode === 401) {
                    logout(setUser, setAuthToken)
                }
                    error400(e)
            })
    }, [pages.currPage, refreshPage, authToken])
    return <>
        <StyledComponents>
            <div className="container">
                {reservations && reservations.length > 0 && reservations.map(reservation =>
                    <ReservationCard key={reservation.id} reservations={reservation} setRefreshPage={setRefreshPage} />
                )}
                {reservations && reservations.length <= 0  && <Typography variant="h4">No Reservations Found</Typography>}
                <div className="pagination-style">
                    {reservations && reservations.length > 0 && <Pagination
                        count={pages.totalPages}
                        page={pages.currPage}
                        onChange={(_, cpage) => setPages({ ...pages, currPage: cpage })}
                        color="primary"
                    />}
                </div>
            </div>
        </StyledComponents>
    </>
}


const StyledComponents = styled.div`
    // width:50%;
    margin:0 auto;

    .pagination-style{
        // background:yellow;
        margin:25px 0;
        display:flex;
        justify-content:center;
    }

    .container{
        // background:red;
        display:flex;
        flex-direction: column;
        margin: 30px auto;
        width: 50%;
        padding: 20px;
    }

    .add-btn{
        position:fixed;
        bottom:12px;
        right:60px;
    }

`

export default ReservationPage