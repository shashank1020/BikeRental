import {useState} from "react";
import {useNavigate} from "react-router-dom";
// components
import {Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, TextField, Typography} from "@mui/material";
import styled from 'styled-components'
import DeleteIcon from '@mui/icons-material/Delete';
import {CardActionButton, PrimaryButton, theme} from "../../styles";
// service
import {addUser, deleteUser, updateUser} from "../../services/user-auth.service";
import {useUserAuthContext} from "../../lib/context/userContext";
import {error400, logout, validateEmail, validatePassword} from "../../lib/common";
import {UserRole} from "../../lib/constants/constants";
// notification
import {toast} from "react-toastify";

const UserCard = ({userObj, createUser = false, setAddUser, setRefreshPage}) => {
    const [isEdit, setIsEdit] = useState(createUser)
    const [editedUser, setEditedUser] = useState(userObj)
    const navigate = useNavigate()
    const {user, authToken, setAuthToken, setUser} = useUserAuthContext()

    const handleUpdateUser = () => {
        if (validateEmail(editedUser.email))
            updateUser({...editedUser, id: userObj.id}, authToken).then(() => {
                toast.success('User was updated')
                setRefreshPage(true)
                setIsEdit(false)
                if (user.id === userObj.id && editedUser.role !== userObj.role) {
                    logout(setAuthToken, setUser)
                }
            })
                .catch(e => {
                    if (e?.response?.data?.statusCode === 401) {
                        logout(setAuthToken, setUser)
                    }
                    error400(e)
                })

    }

    const handleAddUser = () => {
        if (validateEmail(editedUser.email) && validatePassword(editedUser.password))
            addUser(editedUser, authToken).then(() => {
                toast.success('User was added')
            }).then(() => {
                setAddUser(false)
                setRefreshPage(true)
            })
                .catch(e => {
                    if (e?.response?.data?.statusCode === 401) {
                        logout(setAuthToken, setUser)
                    }
                    error400(e)
                })
    }

    const handleDelete = () => {
        if (createUser)
            return setAddUser(false)
        else {
            deleteUser(userObj.id, authToken).then(() => {
                toast.success('User was delete')
                if (user.id === userObj.id) {
                    logout(setAuthToken, setUser)
                }
                setRefreshPage(true)
            }).catch((e) => {
                if (e?.response?.data?.statusCode === 401) {
                    logout(setAuthToken, setUser)
                }
                error400(e)
            })
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        return createUser ? handleAddUser() : handleUpdateUser()
    }
    return (
        <Wrapper component="form" onSubmit={handleSave}>
            <Card className='user-card' variant="outlined" sx={{borderColor: theme(userObj)}}>
                <CardMedia>
                    <Avatar variant='square' style={{background: theme(userObj)}}
                            className='avatar'>{userObj.email.split('@')[0]}</Avatar>
                </CardMedia>
                <Box className='card-content'>
                    {isEdit ?
                        <CardContent sx={{paddingBottom: "0"}}>
                            <TextField fullWidth required margin="normal" id="outlined-email"
                                       label="Email" type="email" size='small'
                                       value={editedUser?.email}
                                       onChange={(e) => setEditedUser({
                                           ...editedUser,
                                           email: e.target.value
                                       })}/>
                            {createUser && (
                                <>
                                    <TextField fullWidth required margin="normal"
                                               id="outlined-password"
                                               label="Password" type="password"
                                               size='small'
                                               value={editedUser?.password || ''}
                                               onChange={(e) => setEditedUser({
                                                   ...editedUser,
                                                   password: e.target.value
                                               })}
                                    />
                                </>
                            )}
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <strong>Role: </strong>
                                <TextField
                                    id="role-select"
                                    select
                                    value={editedUser.role}
                                    onChange={(e) => setEditedUser({...editedUser, role: e.target.value})}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    size={'small'}
                                >
                                    <option value={UserRole.MANAGER}>
                                        Manager
                                    </option>
                                    <option value={UserRole.REGULAR}>
                                        Regular
                                    </option>
                                </TextField>
                            </div>
                        </CardContent> : <CardContent>
                            <div className="user-header">
                                <Typography variant="p">
                                    <strong>Email:</strong> {userObj.email}
                                </Typography>
                            </div>
                            <Typography variant="p">
                                <strong>Role:</strong> {userObj.role}
                            </Typography>
                        </CardContent>
                    }
                    <CardActions sx={{flexGrow: 1}}>
                        <div className="user-actions">
                            <div>
                                {!isEdit && <Button variant={'outlined'} size="small"
                                                    onClick={() => navigate(`/reservations?userId=${userObj.id}&email=${userObj.email}`)}>
                                    Reservation
                                </Button>}
                            </div>
                            <div>
                                {!createUser && (
                                    <Button size="small" onClick={() => {
                                        setIsEdit(!isEdit)
                                    }}>
                                        {isEdit ?
                                            <Button variant='contained' size={'small'} color={'error'}>Cancel</Button> :
                                            <PrimaryButton variant='contained' size={'small'}> Edit </PrimaryButton>}
                                    </Button>
                                )}
                                {isEdit && <Button variant='outlined' size="small" type="submit" color={'success'}>
                                    Save
                                </Button>}
                            </div>
                        </div>
                    </CardActions>
                </Box>
                {isEdit && <CardActionButton onClick={handleDelete}>
                    <DeleteIcon/>
                </CardActionButton>}
            </Card>
        </Wrapper>
    )
}

export default UserCard;


const Wrapper = styled(Box)`
  display: flex;
  margin: var(--s-5);
  max-width: 375px;

  .user-card {
    overflow: visible;
    position: relative;
    display: flex;
  }

  .avatar {
    width: 100px;
    height: 100%;
  }

  .card-content {
    display: flex;
    flex-direction: column;
  }

  .user-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0;

  }

  .user-actions {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0 var(--s-2);
    justify-content: space-between;
    align-items: center;

    button {
      margin-right: 4px;
    }
  }

`