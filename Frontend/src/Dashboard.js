import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to your Dashboard, {user?.name}!</h1>
      <p>Coming soon - User dashboard with enrolled courses</p>
    </div>
  );
};

export default Dashboard;
