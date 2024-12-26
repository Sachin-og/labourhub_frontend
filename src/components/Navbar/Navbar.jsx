
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const pageRoutes = {
  Home: { path: '/home', icon: <HomeIcon /> },
  Jobs: { path: '/jobs', icon: <WorkIcon /> },
  Notifications: { path: '/notifications', icon: <NotificationsIcon /> },
  Messages: { path: '/chat', icon: <ChatIcon /> },
};

const settings = ['Profile', 'My Posts', 'Account', 'Dashboard', 'Logout'];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');
    navigate('/');
  };

  const handleNavigate = (path) => {
    const userId = sessionStorage.getItem('userId');
    if (path === '/notifications' && userId) {
      navigate(`/notifications/${userId}`);
    } else {
      navigate(path);
    }
    handleCloseNavMenu();
  };

  // Retrieve the logged-in user's profile picture
  const userProfilePicture = sessionStorage.getItem('userProfilePicture');

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#f5f5f5', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
      <Container maxWidth="xl">        
        <Toolbar disableGutters>
        <AssuredWorkloadIcon  sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#333' }} />
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Arial, sans-serif',
              fontWeight: 600,
              letterSpacing: '.1rem',
              color: '#333',
              textDecoration: 'none',
            }}
          >
            LABOUR HUB
          </Typography>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
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
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {Object.entries(pageRoutes).map(([key, { path }]) => (
                <MenuItem key={key} onClick={() => handleNavigate(path)}>
                  {pageRoutes[key].icon}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center', // Center the icons horizontally
              alignItems: 'center', // Center the icons vertically
              gap: 3, // Add spacing between icons
            }}
          >
            {Object.entries(pageRoutes).map(([key, { path, icon }]) => (
              <IconButton
                key={key}
                onClick={() => handleNavigate(path)}
                sx={{
                  color: '#333',
                  '&:hover': { color: '#0077b6' },
                }}
              >
                {icon}
              </IconButton>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {userProfilePicture ? (
                  <Avatar src={userProfilePicture} alt="Profile Picture" sx={{ width: 40, height: 40 }} />
                ) : (
                  <PersonIcon fontSize="large" sx={{ color: '#333' }} />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
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
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    if (setting === 'Logout') {
                      handleLogout();
                    } else if (setting === 'My Posts') {
                      navigate('/feed');
                    } else if (setting === 'Profile') {
                      navigate('/profile');
                    } else {
                      handleCloseUserMenu();
                    }
                  }}
                >
                  {setting}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
