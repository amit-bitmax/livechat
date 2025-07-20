import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  Box, Typography, Grid, Paper, TableContainer, Table, TableHead, 
  TableCell, TableBody, Tooltip,TableRow,
  OutlinedInput, Chip, Button,Switch,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import AgentModal from './AgentModal';
import { agentData } from './data';
import Paginations from '../../components/common/Paginations';

const Agents = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState(agentData);

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setEmployees(prev =>
        prev.map(emp => {
          if (!emp.onBreak) {
            return {
              ...emp,
              elapsedTime: emp.elapsedTime + 1,
            };
          }
          return emp;
        })
      );
    }, 1000); // Update every second

    return () => clearInterval(timerRef.current);
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalType('');
  };

  const handleSubmit = (newAgent) => {
    setEmployees((prev) => [...prev, { ...newAgent, id: prev.length + 1 }]);
    handleClose();
  };

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


  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return employees.filter(emp =>
      emp.username.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const tableHeaders = ['S.No', 'Username', 'Employee ID', 'Mobile', 'Email', 'Status', 'Active Since', 'Break'];
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={4} my={2}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Typography variant="h6">Agents List [{filteredData.length}]</Typography>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box>
              <OutlinedInput
				startAdornment={
					<InputAdornment position="start">
					<Search sx={{ color: '#999' }} />
					</InputAdornment>
				}
                sx={{ color: '#000' }}
                size="small"
                fullWidth
                type="search"
                placeholder="Search by name or email..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Button
              color='primary.main'
              variant="contained"
              sx={{ background: '#efefef', }}
              onClick={() => handleOpenModal('add')}
            >
              + Add Agent
            </Button>
          </Grid>
        </Grid>

        <TableContainer sx={{ maxHeight: 640 }}>
          <Table>
            <TableHead>
              <TableRow sx={{
                background:"#999"
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
                  <TableCell>{formatTime(emp.elapsedTime)}</TableCell>
                  <TableCell>
                    <Tooltip title={emp.onBreak ? "On Break" : "Active"}>
                      <Switch
                        size="small"
                        checked={!emp.onBreak}
                        onChange={() => toggleBreakStatus(emp.id)}
                        color="success"
                        inputProps={{ 'aria-label': 'status toggle' }}
                      />
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

        <Paginations
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />

      </Paper>

      {/* Agent Add Modal */}
      {modalType === 'add' && (
        <AgentModal
          open={open}
          handleClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default Agents;
