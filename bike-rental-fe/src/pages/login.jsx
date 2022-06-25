import * as React from 'react';
import {Avatar, Button, CssBaseline, TextField, Grid, Box, Container, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {loginUser} from "../services/user-auth.service";
import {useUserAuthContext} from "../lib/context/userContext";
import {toast} from 'react-toastify';

const theme = createTheme();

export default function LogInPage() {
    const navigate = useNavigate()
    const {user, setUser, setAuthToken} = useUserAuthContext()
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onBlur"});
    const onSubmit = (data) => {
        loginUser(data)
            .then((res) => {
                const {access_token, ...rest} = res
                setUser(rest)
                setAuthToken(access_token)
                localStorage.setItem('token', JSON.stringify({
                    _authToken: access_token,
                    _user: rest
                }))

                toast.success(`welcome ${rest.email}`)
            })
            .then(() => navigate('/'))
            .catch((e) => {
                console.error(e)
                toast.error('Authentication Error')
            })
    }


    return (
        <ThemeProvider theme={theme}>
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
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            autoFocus
                            {...register("email", {required: "Email is required."})}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register("password", {
                                required: "Password  is required.",
                                minLength: {value: 6, message: 'Password should be at-least of 6 char'}
                            })}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to='/signup'>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
