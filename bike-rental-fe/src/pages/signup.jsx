import * as React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {
    TextField,
    CssBaseline,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Container,
    Typography,
    Box,
    Grid,
    Button,
    Avatar
} from "@mui/material";
import {signUp} from "../services/user-auth.service";
import {toast} from "react-toastify";

const theme = createTheme();

export default function SignUpPage() {
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onBlur"});
    const onSubmit = (data) => signUp(data).then(() => {
        toast.success('User Registered')
        navigate('/login')
    }).catch(() => toast.error('Something went wrong'))
    const [role, setRole] = React.useState("");

    const handleChange = (event) => {
        setRole(event.target.value);
    };
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
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="First Name"
                                    autoFocus
                                    {...register('name', {required: "Name must not be empty"})}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoComplete="email"
                                    {...register("username", {
                                        required: "Username is required."
                                    })}
                                    error={Boolean(errors.username)}
                                    helperText={errors.username?.message}
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
                        <FormControl sx={{mt: 3, minWidth: 120}}>
                            <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                            <Select {...register('role')}
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={role}
                                    label="Age"
                                    onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="Regular">Regular</MenuItem>
                                <MenuItem value="Manage">Manger</MenuItem>
                            </Select>
                        </FormControl>
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
        </ThemeProvider>
    );
}
