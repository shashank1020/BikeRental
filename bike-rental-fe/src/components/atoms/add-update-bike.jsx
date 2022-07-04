import React, {useState} from "react";
import {Box, Card, CardActions, CardContent, CardMedia, Checkbox, MenuItem, Modal, TextField,} from "@mui/material";
import {BikeModels, ColorTypes, Location} from "../../lib/constants/constants";
import {createBike, updateBike} from "../../services/bike.service";
import {error400, logout, validate} from "../../lib/common";
import {useUserAuthContext} from "../../lib/context/userContext";
import {toast} from "react-toastify";
import {CardActionButton, PrimaryButton} from "../../styles";
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";

const AddUpdateBike = ({isUpdate = false, openModal, setOpenModal, bikeObj, setRefreshPage}) => {
    const [editedBike, setEditedBike] = useState(bikeObj)
    const {authToken, setAuthToken, setUser} = useUserAuthContext()

    const handleClose = () => {
        setOpenModal(prev => ({...prev, openModal: false}))
    }

    const handleUpdate = () => {
        updateBike(editedBike, authToken)
            .then(() => {
                toast.success('bike was successfully update')
                setOpenModal(false)
                setRefreshPage(true)
            })
            .catch(e => error400(e))
    }

    const handleCreate = () => {
        if (validate(bikeObj, editedBike, ['isAvailable']))
            createBike(editedBike, authToken).then(r => {
                toast.success('bike was successfully created')
                setOpenModal(false)
                setRefreshPage(true)
            }).catch(e => {
                if (e.response.data.statusCode === 401 || e.statusCode === 401) {
                    logout(setAuthToken, setUser)
                } else error400(e)
            })
    }

    const onSubmit = () => isUpdate ? handleUpdate() : handleCreate()

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="add-bike-modal"
        >
            <Wrapper>
                <AddCard>
                    <CardMedia
                        component="img"
                        height="150"
                        image={BikeModels[editedBike.model]}
                    />
                    <CardContent>
                        <div>
                            <strong>Model</strong>
                            <TextField
                                style={{width: '100%'}}
                                id="location"
                                select
                                value={editedBike.model}
                                onChange={(e) => setEditedBike({...editedBike, model: e.target.value})}>
                                {Object.keys(BikeModels).map((bike, index) => (
                                    <MenuItem key={index} value={bike}>
                                        {bike}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div>
                            <strong>Location</strong>
                            <TextField
                                style={{width: '100%'}}
                                id="location"
                                select
                                value={editedBike.location || ''}
                                onChange={(e) => setEditedBike({...editedBike, location: e.target.value})}
                            >
                                {Location.map((loc, index) => (
                                    <MenuItem key={index} value={loc}>
                                        {loc}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div>
                            <strong>Color</strong>
                            <TextField
                                style={{width: '100%'}}
                                id="color"
                                select
                                value={editedBike.color || ''}
                                onChange={(e) => setEditedBike({...editedBike, color: e.target.value})}
                            >
                                {ColorTypes.map((color, index) => (
                                    <MenuItem key={index} value={color}>
                                        {color}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div>
                            <Checkbox
                                checked={editedBike.isAvailable}
                                onChange={(e) => setEditedBike({...editedBike, isAvailable: e.target.checked})}
                                inputProps={{'aria-label': 'controlled'}}
                            />
                            <span>Bike is Available</span>
                        </div>
                        <CardActions>
                            <CardActionButton onClick={handleClose}>
                                <CloseIcon/>
                            </CardActionButton>
                            <PrimaryButton onClick={onSubmit}
                                           className='add-button'>{isUpdate ? 'Update' : 'Add'}</PrimaryButton>
                        </CardActions>
                    </CardContent>
                </AddCard>
            </Wrapper>
        </Modal>
    )
}

export default AddUpdateBike;

const Wrapper = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--c-white);
  padding: var(--s-2);
  overflow: visible;
`

const AddCard = styled(Card)`
  position: relative;
  width: 300px;
  box-shadow: none;
  overflow: visible;

  .add-button {
    width: 100%;
  }
`