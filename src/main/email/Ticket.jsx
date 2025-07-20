import React, { useMemo, useRef, useState } from 'react';
import {
  Box, Typography, Grid, Paper, TableContainer, Table, TableHead,
  TableCell, TableBody, Tooltip, TableRow,
  OutlinedInput, Chip, Button, Checkbox,
  InputAdornment, IconButton
} from '@mui/material';
import { Search, Star, StarBorder } from '@mui/icons-material';
import Paginations from '../../components/common/Paginations';

import TicketModal from './TicketModel';
import { useGetAgentTicketsQuery } from '../../features/ticket/ticketApi';

const Ticket = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const timerRef = useRef(null);

  const { data, isLoading, error } = useGetAgentTicketsQuery();

  const tableHeaders = ['Star', 'Username', 'Employee ID', 'Mobile', 'Email', 'Status', 'Active Since'];

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalType('');
  };

  const handleSubmit = (newAgent) => {
    handleClose(); 
  };

  const handleStarClick = (id) => {
    console.log('Toggle star for', id);
  };

  const handleSelectAll = () => {
    const allSelected = selectedItems.length === tickets.length;
    setSelectedItems(allSelected ? [] : tickets.map(emp => emp.email));
  };

  const handleCheckboxChange = (email) => {
    setSelectedItems(prev =>
      prev.includes(email)
        ? prev.filter(item => item !== email)
        : [...prev, email]
    );
  };

  const tickets = data?.data || [];
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tickets?.filter(emp =>
      emp.subject?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query)
    );
  }, [tickets, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tickets</div>;

  return (
    <>
      <Paper elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} justifyContent={'space-between'} alignItems="center" mb={2}>
          <Grid size={{xs:12,lg:4}}>
            <Typography variant="h6">
              Tickets [{filteredData.length}]
            </Typography>
          </Grid>
          <Grid size={{xs:12,lg:4}}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <Search sx={{ color: '#999' }} />
                </InputAdornment>
              }
              size="small"
              fullWidth
              type="search"
              placeholder="Search by subject or email..."
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ backgroundColor: '#fff' }}
            />
          </Grid>
          <Grid size={{xs:12,lg:4}}>
            <Button
              variant="outlined"
              sx={{ color: 'primary', textTransform: 'none' }}
              onClick={() => handleOpenModal('add')}
            >
              + Add Agent
            </Button>
          </Grid>
        </Grid>

        <TableContainer sx={{ maxHeight: 640 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ background: "#f1f2f9" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    color="success"
                    onClick={handleSelectAll}
                    checked={
                      selectedItems.length === tickets.length && tickets.length > 0
                    }
                    sx={{
                      backgroundColor: '#F0F0F0',
                      '&:hover': { backgroundColor: '#E0E0E0' }
                    }}
                  />
                </TableCell>
                {tableHeaders.map(header => (
                  <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length ? (
                paginatedData.map((ticket) => (
                  <TableRow key={ticket._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={selectedItems.includes(ticket.email)}
                        onChange={() => handleCheckboxChange(ticket.email)}
                      />
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Star/Unstar" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleStarClick(ticket._id)}
                        >
                          {ticket.starred ? (
                            <Star sx={{ fontSize: '15px' }} color="warning" />
                          ) : (
                            <StarBorder sx={{ fontSize: '15px' }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell>{ticket.subject || 'N/A'}</TableCell>
                    <TableCell>{ticket.employeeId || '-'}</TableCell>
                    <TableCell>{ticket.mobile || '-'}</TableCell>
                    <TableCell>{ticket.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status || 'New'}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatTime(ticket.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeaders.length + 1} align="center">
                    No tickets found.
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

      {modalType === 'add' && (
        <TicketModal
          open={open}
          handleClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default Ticket;
