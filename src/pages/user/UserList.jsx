import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Skeleton, Stack, Tooltip, IconButton, debounce, TableFooter, OutlinedInput, TablePagination, Chip } from '@mui/material';
import { DeleteOutline, Search, VisibilityOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUser, deleteUser, getAllUser } from '../../features/slices/userSlice';
import { format, parseISO } from 'date-fns';
import UserModal from './UserModel';
const IMG_BASE_URL = "https://shoppee-api.onrender.com/uploads/profiles";

const UserList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { users, loading } = useSelector(state => state.user);
    const [open, setOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        dispatch(getAllUser());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            dispatch(deleteUser(id));
        }
    };

    const handleOpenModal = (type, blog = null) => {
        setModalType(type);
        setSelectedBlog(blog);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBlog(null);
        setModalType(null);
    };
    const handleSubmit = async (values) => {

        try {
            // Ensure required fields are present
            if (!values.title || !values.description) {
                console.warn("Title and description are required.");
                return;
            }

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);

            // Handle image only if present
            if (values.blogImage) {
                if (values.blogImage instanceof File) {
                    formData.append("blogImage", values.blogImage);
                } else if (typeof values.blogImage === 'string') {
                    formData.append("blogImagePath", values.blogImage);
                }
            }

            if (modalType === 'add') {
                await dispatch(createUser(formData)).unwrap();
                toast.success("Blog created successfully");
            }

            handleClose();
            navigate('/admin-dashboard/blogs');
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.error("Failed to save blog");
        }
    };
    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleSearchChange = debounce((event) => {
        setSearchQuery(event.target.value.toLowerCase());
    }, 300);

    const filteredData = useMemo(() => {
        if (!searchQuery) return users || [];
        return users?.filter((item) => {
            const searchStr = searchQuery.toLowerCase();
            const mobile = item?.mobile ? item.mobile.toString().toLowerCase() : '';
            return (
                item?.name?.first_name?.toLowerCase().includes(searchStr) ||
                mobile.includes(searchStr) ||
                item?.email?.toLowerCase().includes(searchStr)
            );
        });
    }, [users, searchQuery]);

    const paginatedData = useMemo(() => {
        if (!Array.isArray(filteredData)) {
            return [];
        }
        return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const tableHeaders = useMemo(() => ['S.No', 'Profile', 'Mobile', 'Last activity', 'Status', 'Actions'], []);
    const statusUser = (item) => {
        if (item?.role === 2) {
            return <Chip size='small' sx={{ background: "#e8f5e9", color: '#4caf50' }} label="Active" />;
        } else if (item?.role === 0) {
            return <Chip size='small' sx={{ background: "#ffebee", color: '#f44336' }} label="Inactive" />;
        } else {
            return <Chip size='small' sx={{ background: "#f3e5f5", color: '#9c27b0' }} label="Unknown" />;
        }
    };

    return (
        <>
            <Paper elevation={0} sx={{ p: 2, }}>
                <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                    <Grid size>
                        <Typography variant="h6">Users [{users?.length || 0}]</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ width: '100%', backgroundColor: '#827717', color: '#ffffff', display: 'flex', borderRadius: '50px', px: 1, alignItems: 'center', border: '1px solid #eee' }}>
                            <Search sx={{ fontSize: '20px', color: '#ffffff' }} />
                            <OutlinedInput
                                sx={{ color: '#ffffff', }}
                                size="small"
                                type="search"
                                fullWidth
                                placeholder="Search by Name, Email, or Mobile..."
                                onChange={handleSearchChange}
                            />
                        </Box>
                    </Grid>
                    <Grid size>
                        <Button variant="none" sx={{ background: '#827717', color: "#ffffff" }} onClick={() => handleOpenModal('add')}>
                            + Add User
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                backgroundImage: "linear-gradient(to left,rgb(252, 252, 252),rgba(126, 131, 17, 0.57),rgb(255, 255, 255))",
                                backgroundColor: "transparent",
                            }}>
                                {tableHeaders.map(header => (
                                    <TableCell key={header} sx={{ color: '#333', fontWeight: 'bold' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 2 }).map((_, rowIdx) => (
                                    <TableRow key={rowIdx}>
                                        {Array.from({ length: tableHeaders.length }).map((_, cellIdx) => (
                                            <TableCell key={cellIdx}>
                                                <Skeleton variant="text" height={20} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <TableRow key={item._id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                                <Box
                                                    component="img"
                                                    src={`${IMG_BASE_URL}/${item?.profileImage}?t=${new Date(item.updatedAt).getTime()}`}
                                                    alt={item.title}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 1,
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant='body2'> {item?.name?.first_name} {item?.name?.last_name}</Typography>
                                                    <Typography variant='body1' fontWeight={'bold'} color='rgba(126, 131, 17, 0.77)'> {item?.email}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2'> {item?.mobile}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body1'>
                                                {item?.updatedAt ? format(parseISO(item.updatedAt), 'dd/MM/yyyy, HH:mm:ss') : ''}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {statusUser(item)}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="View">
                                                    <IconButton aria-label="view" size="small" onClick={() => handleOpenModal('view', item)}>
                                                        <VisibilityOutlined sx={{ fontSize: 18, color: "#1a237e" }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" aria-label="delete" onClick={() => handleDelete(item._id)}>
                                                        <DeleteOutline sx={{ fontSize: 18, color: "#d32f2f" }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={tableHeaders.length} align="center">
                                        No blogs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TablePagination
                                component="paper"
                                rowsPerPageOptions={[5, 10, 20, 30]}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                count={filteredData?.length || 0}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>

            {modalType === 'add' && (
                <UserModal
                    open={open}
                    handleClose={handleClose}
                    onSubmit={handleSubmit}
                />
            )}

            {modalType === 'edit' && (
                <UserModal
                    open={open}
                    handleClose={handleClose}
                    initialValues={selectedBlog}
                    onSubmit={handleSubmit}
                />
            )}

        </>
    );
};

export default UserList;