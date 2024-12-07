import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerContent = (
        <Box sx={{ width: 250, bgcolor: '#2d445d', height: '100%', color: 'white' }}>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Hackathon X
                </Typography>
            </Toolbar>
            <List>
                <ListItem button component={Link} to="/top">
                    <ListItemIcon>
                        <HomeIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="トップページ" />
                </ListItem>
                <ListItem button component={Link} to="/mypage">
                    <ListItemIcon>
                        <PersonIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="マイページ" />
                </ListItem>
                <ListItem button component={Link} to="/createpost">
                    <ListItemIcon>
                        <AddIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="新規投稿" />
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