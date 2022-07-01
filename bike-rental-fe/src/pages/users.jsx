import * as React from 'react';
import {useEffect, useState} from 'react';
// context
import {useUserAuthContext} from "../lib/context/userContext";
import UserCard from "../components/atoms/user-card";
import {Divider, Grid, Pagination, Typography} from "@mui/material";
import styled from 'styled-components'
import {PrimaryButton} from "../styles";
import {getUsers} from "../services/user-auth.service";
import {useNavigate} from "react-router-dom";
import {logout} from "../lib/common";
import {UserRole} from "../lib/constants/constants";

const initUser = {
    email: '',
    password: '',
    role: UserRole.REGULAR
}

const UsersPage = () => {
    const {user, authToken, setAuthToken, setUser} = useUserAuthContext()
    const navigate = useNavigate()
    const [addUser, setAddUser] = useState(false)
    const [pages, setPages] = useState({currPage: 1, totalPages: 3});
    const [refreshPage, setRefreshPage] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        getUsers(pages.currPage, authToken).then(r => {
            setUsers(r.users)
            setPages({currPage: r.page, totalPages: r.totalPages})
            setRefreshPage(false)
        }).catch(e => {
            if (e?.response?.data?.statusCode === 401)
                logout(setAuthToken, setUser)
        })
    }, [authToken, refreshPage, pages.currPage])

    if (user.role === UserRole.REGULAR)
        navigate('/')

    return (
        <Wrapper>
            <Typography variant='h2' textAlign={'center'}>All Users</Typography>
            <Divider/>
            <div className='add-user-button center'>
                <PrimaryButton variant={'contained'} size='large' onClick={() => setAddUser(true)}>Add
                    User</PrimaryButton>
            </div>
            <div className={` center`}>
                {addUser &&
                    <UserCard createUser userObj={initUser} setRefreshPage={setRefreshPage} setAddUser={setAddUser}/>}
            </div>
            <Grid container className='user-grid'>
                {users && users.length > 0 && users.map(user => <UserCard key={user.id} setRefreshPage={setRefreshPage}
                                                                          userObj={user}/>)}
                {users && users.length <= 0 && <Typography variant="h4">No Users Found</Typography>}
            </Grid>
            <div className="center">
                {users && users.length > 0 && <Pagination
                    count={pages.totalPages}
                    page={pages.currPage}
                    onChange={(_, pageNumber) => setPages({...pages, currPage: pageNumber})}
                    color="primary"
                />}
            </div>
        </Wrapper>
    )
}

export default UsersPage;


const Wrapper = styled.div`
  position: relative;

  .add-user-button {
    padding: var(--s-2);
  }

  .user-grid {
    max-width: 1200px;
    margin: 0 auto;
  }
`
