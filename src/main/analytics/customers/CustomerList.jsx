import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Grid, Paper, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody,  Stack, Tooltip, IconButton,
  OutlinedInput, Chip, Pagination, Select, MenuItem,
  Button
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { customerData } from '../data';


// 🟩 Mock Employee Data

const CustomerList = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState(customerData);

  // 🔁 Toggle Break/Resume Status
  const toggleBreakStatus = (id) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === id
          ? {
              ...emp,
              onBreak: !emp.onBreak,
              status: !emp.onBreak ? "On Break" : "Active"
            }
          : emp
      )
    );
  };

  // 🔍 Filtered Data
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return employees.filter(emp =>
      emp.username.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  // 📄 Paginated Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const tableHeaders = ['S.No', 'Username', 'Employee ID', 'Mobile', 'Email', 'Status', 'Active Since', 'Break'];

  return (
    <>
     
        <Paper elevation={0} sx={{ p: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Employee List [{filteredData.length}]</Typography>
            <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: '50px', border: '1px solid #eee', px: 1 }}>
                <Search sx={{ color: '#333' }} />
                <OutlinedInput
                sx={{ color: '#000' }}
                size="small"
                fullWidth
                type="search"
                placeholder="Search by name or email..."
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>
            </Grid>
        </Grid>

        <TableContainer sx={{ maxHeight: 640 }}>
            <Table>
            <TableHead>
                <TableRow sx={{
                backgroundImage: "linear-gradient(to left,rgb(252, 252, 252),rgba(126, 131, 17, 0.57),rgb(255, 255, 255))"
                }}>
                {tableHeaders.map(header => (
                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                ))}
                </TableRow>
            </TableHead>

            <TableBody>
                {paginatedData.length ? paginatedData.map((emp, index) => (
                <TableRow key={emp.id} hover>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{emp.username}</TableCell>
                    <TableCell>{emp.employeeId}</TableCell>
                    <TableCell>{emp.mobile}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>
                    <Chip
                        label={emp.status}
                        color={emp.onBreak ? 'warning' : 'success'}
                        size="small"
                    />
                    </TableCell>
                    <TableCell>{new Date(emp.activeSince).toLocaleTimeString()}</TableCell>
                    <TableCell>
                    <Tooltip title={emp.onBreak ? "Resume" : "Break"}>
                        <IconButton onClick={() => toggleBreakStatus(emp.id)} color={emp.onBreak ? 'success' : 'warning'}>
                        {emp.onBreak ? '▶️' : '⏸️'}
                        </IconButton>
                    </Tooltip>
                    </TableCell>
                </TableRow>
                )) : (
                <TableRow>
                    <TableCell colSpan={tableHeaders.length} align="center">
                    No employees found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <Grid container justifyContent="space-between" alignItems="center" mt={2}>
            <Grid size={{xs:12,lg:6}} >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2">Rows per page:</Typography>
                    <Select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setPage(1);
                    }}
                    size="small"
                    >
                    {[5, 10, 15].map(n => (
                        <MenuItem key={n} value={n}>{n}</MenuItem>
                    ))}
                    </Select>
                    <Typography variant="body2" color="textSecondary">
                    Page {page} of {totalPages}
                    </Typography>
                </Stack>
             </Grid>
            <Grid size={{xs:12,lg:6}}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                shape="rounded"
            />
            </Grid>
        </Grid>
        </Paper>

    </>
  );
};

export default CustomerList;
