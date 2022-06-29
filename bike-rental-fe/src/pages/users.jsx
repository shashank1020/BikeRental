import * as React from 'react';
// context
import {useUserAuthContext} from "../lib/context/userContext";
import UserCard from "../components/atoms/user-card";
import {Button, Divider, Grid, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import styled from 'styled-components'
import {PrimaryButton} from "../styles";
import {getUsers} from "../services/user-auth.service";
import {Pagination} from "@mui/lab";
import {useNavigate} from "react-router-dom";

const initUser = {
    email: '',
    password: '',
    role: 'Regular'
}

const UsersPage = () => {
    const {user, authToken} = useUserAuthContext()
    const navigate = useNavigate()
    const [addUser, setAddUser] = useState(false)
    const [pages, setPages] = useState({ currPage: 1, totalPages: 3 });
    const [refreshPage, setRefreshPage] = useState(false)
    const [users, setUsers] = useState([])

    useEffect(() => {
        getUsers(pages.currPage, authToken).then(r=> {
            setUsers(r.users)
            setPages({currPage: r.page, totalPages: r.totalPages})
            setRefreshPage(false)
        }).catch(e=>{
            console.log('user page', e)
        })
    }, [authToken, refreshPage, pages.currPage])

    if (user.role === 'Regular')
        navigate('/')

    return (
        <Wrapper>
            <Typography variant='h2' textAlign={'center'}>All Users</Typography>
            <Divider/>
            <div className='add-user-button center'>
                <PrimaryButton variant={'contained'} size='large' onClick={() => setAddUser(true)}>Add User</PrimaryButton>
            </div>
            <div className={`${addUser?'add-user': ''} center`}>
                {addUser && <UserCard createUser userObj={initUser} setRefreshPage={setRefreshPage} setAddUser={setAddUser} />}
            </div>
            <Grid container className='user-grid'>
                {users && users.length > 0 && users.map(user => <UserCard setRefreshPage={setRefreshPage} userObj={user}/>)}
                {users && users.length <= 0 && <Typography variant="h4">No Users Found</Typography>}
            </Grid>
            <div className="center">
                {users && users.length > 0 && <Pagination
                    count={pages.totalPages}
                    page={pages.currPage}
                    onChange={(_, pageNumber) => setPages({ ...pages, currPage: pageNumber })}
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
  .add-user{
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
  }
  .user-grid {
    max-width: 1200px;
    margin: 0 auto;
    z-index: 10;
  }
  .center {
    display: flex;
    justify-content: center;
  }
`
