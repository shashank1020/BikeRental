import * as React from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
// components
import {Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// service
import {signUp} from "../services/user-auth.service";
// notification
import {toast} from "react-toastify";

export default function SignUpPage() {
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onBlur"});
    const onSubmit = (data) => {
        console.log(data)
        signUp(data).then(() => {
            toast.success('User Registered')
            navigate('/login')
        }).catch((e) => {
            if (e?.response?.data?.statusCode === 409)
                toast.error('Email already taken, try another')
            else if (e?.response?.data?.statusCode === 400)
                toast.warning('Invalid fields were given')
            else
                toast.error('Something went wrong')
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                autoComplete="email"
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: {
                                        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'Please enter a valid email',
                                    },
                                })}
                                error={Boolean(errors.email)}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                {...register("password", {
                                    required: "Password  is required.",
                                    minLength: {value: 6, message: 'Password should be at-least of 6 char'}
                                })}
                                error={Boolean(errors.password)}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
