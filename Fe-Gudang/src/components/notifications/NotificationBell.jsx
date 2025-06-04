import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/material/Accordion'
const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/notifications', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setNotifications(response.data.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Refresh notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/notifications/${id}/mark-as-read`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(notif => notif.status === 'unread').length;

    return (
        <div>
            <IconButton
                color="inherit"
                onClick={handleClick}
                aria-controls="notifications-menu"
                aria-haspopup="true"
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                id="notifications-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 300,
                        width: '300px',
                    },
                }}
            >
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => handleMarkAsRead(notification.id)}
                            sx={{
                                backgroundColor: notification.status === 'unread' ? '#f5f5f5' : 'transparent',
                                whiteSpace: 'normal',
                                textAlign: 'left'
                            }}
                        >
                            <Typography variant="body2">
                                {notification.pesan}
                            </Typography>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        <Typography variant="body2">
                            Tidak ada notifikasi
                        </Typography>
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

export default NotificationBell;
