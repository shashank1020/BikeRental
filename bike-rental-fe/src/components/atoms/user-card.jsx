import {Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import {PrimaryButton} from "../../styles";
import {addUser, deleteUser, updateUser} from "../../services/user-auth.service";
import {toast} from "react-toastify";
import {useUserAuthContext} from "../../lib/context/userContext";

const UserCard = ({userObj, createUser = false, setAddUser, setRefreshPage}) => {
    const [isEdit, setIsEdit] = useState(createUser)
    const [editedUser, setEditedUser] = useState(userObj)
    const navigate = useNavigate()
    const {user, authToken, setUser, setAuthToken} = useUserAuthContext()
    const logout = () => {
        setUser(null)
        setAuthToken(null)
        localStorage.removeItem('token')
    }
    const handleUpdateUser = () => {
        if (JSON.stringify(editedUser) !== JSON.stringify(userObj))
            updateUser({...editedUser, id: userObj.id}, authToken).then(r => {
                toast.success('User was updated')
                setRefreshPage(true)
                setIsEdit(false)
                if (user.id === userObj.id && editedUser.role !== userObj.role) {
                    logout()
                }
            })
                .catch(e => {
                    if (e?.response?.data?.statusCode === 401){
                        logout()
                    }
                toast.error(e?.response?.data?.message.toString().replace('\"', ''))
            })
        else {
            toast.warning('Some entries are missing')
        }
    }

    const handleAddUser = () => {
        if (JSON.stringify(editedUser) !== JSON.stringify(userObj))
            addUser(editedUser, authToken).then(r => {
                toast.success('User was added')
            }).then(() => {
                setAddUser(false)
                setRefreshPage(true)
            })
                .catch(e => {
                    if (e?.response?.data?.statusCode === 401){
                        logout()
                    }
                    toast.error(e?.response?.data?.message.toString().replace('\"', ''))
                })
        else {
            toast.warning('some entries are missing')
        }
    }

    const handleDelete = () => {
        if (createUser)
            return setAddUser(false)
        else {
            deleteUser(userObj.id, authToken).then(() => {
                toast.success('User was delete')
                if (user.id === userObj.id) {
                    logout()
                }
                setRefreshPage(true)
            }).catch((e) => {
                if (e?.response?.data?.statusCode === 401){
                    logout()
                }
                toast.error(e?.response?.data?.message.toString().replace('\"', ''))
            })
        }
    }
    const handleSave = (e) => {
        e.preventDefault();
        return createUser ? handleAddUser() : handleUpdateUser()
    }
    useEffect(() => {
        console.log(editedUser)
    }, [editedUser])
    return (
        <Wrapper component="form" onSubmit={handleSave}>
            <Card className='user-card' variant="outlined">
                <CardMedia>
                    <Avatar variant='square' style={{background: 'var(--c-blue-dark)'}} className='avatar'>{userObj.email.split('@')[0]}</Avatar>
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
                                    <option value={'Manager'}>
                                        Manager
                                    </option>
                                    <option value={'Regular'}>
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
                                                    onClick={() => navigate(`/reservations?userId=${userObj.id}`)}>
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
                                            <PrimaryButton variant='contained' size={'small'}
                                            > Edit </PrimaryButton>}
                                    </Button>
                                )}
                                {isEdit && <Button variant='outlined' size="small" type="submit" color={'success'}>
                                    Save
                                </Button>}
                            </div>
                        </div>
                    </CardActions>
                </Box>
                {isEdit && <CustomClose onClick={handleDelete}>
                    <CloseIcon className='close'/>
                </CustomClose>}
            </Card>
        </Wrapper>
    )
}

export default UserCard;

const CustomClose = styled(IconButton)`
  position: absolute;
  right: -20px;
  top: -20px;
  background: var(--c-blue-dark);
  border-radius: 50%;
  border: 2px solid var(--c-blue);
    color: white;
  &:hover {
    background: var(--c-blue);
  }
`

const Wrapper = styled(Box)`
  display: flex;
  margin: 1.2rem;
  max-width: 375px;

  .user-card {
    border-color: var(--c-blue-dark);
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
    padding: 0 8px;
    justify-content: space-between;
    align-items: center;

    button {
      margin-right: 4px;
    }
  }

`