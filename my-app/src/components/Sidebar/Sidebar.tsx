import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        signOut(getAuth())
            .then(() => {
                alert('ログアウトしました');
                navigate('/');
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const drawerContent = (
        <Box className="sidebar">
            <Toolbar className="sidebar-toolbar">
                <Typography variant="h6" noWrap>
                    Trust X
                </Typography>
            </Toolbar>
            <List className="sidebar-list">
                <ListItem disablePadding component={NavLink} to="/top" className="sidebar-list-item">
                    <ListItemIcon className="sidebar-list-item-icon">
                        <HomeIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="ホーム" className="sidebar-list-item-text" />
                </ListItem>
                <ListItem disablePadding component={NavLink} to="/mypage" className="sidebar-list-item">
                    <ListItemIcon className="sidebar-list-item-icon">
                        <PersonIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="マイページ" className="sidebar-list-item-text" />
                </ListItem>
                <ListItem disablePadding component={NavLink} to="/createpost" className="sidebar-list-item">
                    <ListItemIcon className="sidebar-list-item-icon">
                        <AddIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="新規投稿" className="sidebar-list-item-text" />
                </ListItem>
                <ListItem disablePadding component="div" onClick={handleLogout} className="sidebar-logout">
                    <ListItemIcon className="sidebar-list-item-icon">
                        <LogoutIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="ログアウト" className="sidebar-list-item-text" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <MenuIcon />
            </IconButton>
            {/* モバイルビュー用 */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }} // モバイルパフォーマンスの最適化
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawerContent}
            </Drawer>
            {/* デスクトップビュー用 */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;