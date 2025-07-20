import React, { useMemo, useRef, useState } from 'react';
import {
  Box, Typography, Grid, Paper, TableContainer, Table, TableHead,
  TableCell, TableBody, Tooltip, TableRow,
  OutlinedInput, Chip, Button, Checkbox,
  InputAdornment, IconButton, Avatar,
  Stack
} from '@mui/material';
import { Search, Star, StarBorder, Reply, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Paginations from '../../components/common/Paginations';
import TicketModal from './TicketModel';
import { useGetAgentTicketsQuery, useReplyToTicketMutation } from '../../features/ticket/ticketApi';

const Ticket = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const timerRef = useRef(null);

  const { data, isLoading, error } = useGetAgentTicketsQuery();
  const [replyToTicket] = useReplyToTicketMutation();

  const tableHeaders = ['Star','Customer',  'Subject', 'Status', 'Last Activity','Action'];

  const handleOpenModal = (type) => {
    setModalType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModalType('');
    setReplyingTo(null);
  };

  const handleReplySubmit = async () => {
    if (!replyingTo || !replyContent.trim()) return;

    try {
      await replyToTicket({
        ticketId: replyingTo._id,
        message: replyContent
      }).unwrap();

      setReplyContent('');
      handleClose();
    } catch (err) {
      console.error('Failed to send reply:', err);
    }
  };

  const handleRowClick = (ticket) => {
    navigate(`/inbox/${ticket.ticketId}`, {
      state: {
        ticketData: ticket,
        replyMode: true
      }
    });
  };

  const handleQuickReply = (ticket, e) => {
    e.stopPropagation();
    setReplyingTo(ticket);
    setModalType('reply');
    setOpen(true);
  };

  const tickets = data?.data || [];
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tickets.filter(ticket =>
      ticket.subject?.toLowerCase().includes(query) ||
      ticket.customerEmail?.toLowerCase().includes(query) ||
      ticket.customerName?.toLowerCase().includes(query)
    );
  }, [tickets, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tickets</div>;

  return (
    <>
      <Paper elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} justifyContent={'space-between'} alignItems="center" mb={2}>
          <Grid item xs={12} lg={4}>
            <Typography variant="h6">
              Tickets [{filteredData.length}]
            </Typography>
          </Grid>
          <Grid item xs={12} lg={4}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <Search sx={{ color: '#999' }} />
                </InputAdornment>
              }
              size="small"
              fullWidth
              type="search"
              placeholder="Search tickets..."
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ backgroundColor: '#fff' }}
            />
          </Grid>
        </Grid>

        <TableContainer sx={{ maxHeight: 640 }}>
          <Table>
            <TableHead >
              <TableRow sx={{ backgroundColor: "#ced1e371" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    color="success"
                    onClick={() => {
                      const allSelected = selectedItems.length === tickets.length;
                      setSelectedItems(allSelected ? [] : tickets.map(t => t._id));
                    }}
                    checked={
                      selectedItems.length === tickets.length && tickets.length > 0
                    }
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
                  <TableRow
                    key={ticket._id}
                    hover
                    onClick={() => handleRowClick(ticket)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={selectedItems.includes(ticket._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedItems(prev =>
                            prev.includes(ticket._id)
                              ? prev.filter(id => id !== ticket._id)
                              : [...prev, ticket._id]
                          );
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Star/Unstar" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle star toggle
                            }}
                          >
                            {ticket.starred ? (
                              <Star sx={{ fontSize: '15px' }} color="warning" />
                            ) : (
                              <StarBorder sx={{ fontSize: '15px' }} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{
                          width: 25,
                          height: 25,
                          mr: 1,
                          bgcolor: stringToColor(ticket.customerName || ticket.customerEmail)
                        }}>
                          {getInitials(ticket.customerName || ticket.customerEmail)}
                        </Avatar>
                        <Stack>
                          <Typography variant="body1">
                            {ticket.customerName || ticket.customerEmail.split('@')[0]}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {ticket.customerEmail}
                          </Typography>
                        </Stack>
                      </Box>
                    </TableCell>
                    <TableCell> 
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                          <Typography variant="body1" fontWeight={'bold'}>
                          {ticket.subject || 'No subject'}
                      </Typography>
                      <Remove sx={{fontSize:'15px'}}/>
                       <Typography variant="body2">
                          {ticket.message || 'No message'}
                      </Typography>
                        </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status || 'New'}
                        color={
                          ticket.status === 'closed' ? 'default' :
                            ticket.status === 'pending' ? 'warning' : 'success'
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {formatTime(ticket.updatedAt || ticket.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Quick Reply" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => handleQuickReply(ticket, e)}
                        >
                          <Reply fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
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

      {/* Reply Modal */}
      {modalType === 'reply' && replyingTo && (
        <TicketModal
          open={open}
          handleClose={handleClose}
          title={`Reply to ${replyingTo.subject}`}
          content={
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>To:</strong> {replyingTo.customerEmail}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Subject:</strong> {replyingTo.subject}
              </Typography>
              <OutlinedInput
                multiline
                rows={6}
                fullWidth
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply here..."
                sx={{ mt: 2, mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleReplySubmit}
                disabled={!replyContent.trim()}
              >
                Send Reply
              </Button>
            </Box>
          }
        />
      )}
    </>
  );
};

// Helper function for avatar colors
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

export default Ticket;  