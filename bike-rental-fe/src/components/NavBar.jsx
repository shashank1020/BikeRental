import React, {useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Outlet, useNavigate} from 'react-router-dom'
import {useUserAuthContext} from "../lib/context/userContext";
import {Divider, Stack} from "@mui/material";
import styled from 'styled-components';
import {logout} from "../lib/common";
import {UserRole} from "../lib/constants/constants";

const managerPages = [ 'Users', 'Reservations'];
const userPages = ['Reservations'];

const Logo = styled(Typography)`
  margin-right: var(--s-4);
  font-family: 'monospace';
  font-weight: var(--fw-bold);
  color: inherit;
  text-decoration: none;
  letter-spacing: 0.3rem;
`
const CustomNavBar = styled(AppBar)`
  background-color:  var(--c-blue-dark);
`
const NavBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const {user, setUser, setAuthToken} = useUserAuthContext()
    const pages = user.role === UserRole.MANAGER ? managerPages : userPages
    const navigate = useNavigate()
    const handleLogout = () => logout(setUser, setAuthToken)
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigate = (page) => navigate(`${page.replace(/\s/g, "").toLowerCase()}`)

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token !== {}) {
            setAuthToken(token?._authToken)
            setUser(token?._user)
        }
    }, [])
    return (
        <>
            <CustomNavBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        <Logo
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{display: {xs: 'none', md: 'flex'}}}
                            onClick={(e) => {
                                e.preventDefault()
                                navigate('')
                            }}
                        >
                            GoBikes
                        </Logo>

                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={() => handleNavigate(page)}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                        <Logo
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                            }}
                            onClick={(e) => {
                                e.preventDefault()
                                navigate('')
                            }}
                        >
                            GoBikes
                        </Logo>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={()=>handleNavigate(page)}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar>{user.email[0].toUpperCase()}</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Box sx={{p: 2}}>
                                    <Stack>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography component="span" variant="h6" sx={{fontWeight: 400}}>
                                                {user.email}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="subtitle2">{user.role}</Typography>
                                    </Stack>
                                    <Divider/>
                                </Box>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </CustomNavBar>
            <Outlet/>
        </>
    );
};
export default NavBar;
