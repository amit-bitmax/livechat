// components/CallHistory.js
import React from 'react';

import { toast } from 'react-toastify';
import { useGetCallHistoryQuery } from '../../features/room/roomApi';

const CallHistory = () => {
  const { data: calls, error, isLoading } = useGetCallHistoryQuery();

  if (isLoading) return <div>Loading call history...</div>;
  if (error) {
    toast.error('Failed to load call history');
    return <div>Error loading call history</div>;
  }

  return (
    <div className="call-history">
      <h2>Call History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Participants</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {calls?.data?.map((call) => (
            <tr key={call._id}>
              <td>{new Date(call.createdAt).toLocaleString()}</td>
              <td>
                {call.participants.map(p => (
                  <div key={p.userId._id}>
                    {p.userId.name} ({p.role})
                  </div>
                ))}
              </td>
              <td>{call.duration || 0} seconds</td>
              <td>{call.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallHistory;