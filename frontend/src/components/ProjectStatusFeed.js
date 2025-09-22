import React from 'react';
function ProjectStatusFeed({ feed }) {
  // feed: array of { user, action: 'check-in' | 'check-out', message, timestamp }
  return (
    <section>
      <h2>Project Activity</h2>
      <ul>
        {feed.map(({ user, action, message, timestamp }, index) => (
          <li key={index}>
            <strong>{user}</strong> {action === 'check-in' ? 'checked in' : 'checked out'} at {new Date(timestamp).toLocaleString()}
            <p>Message: {message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectStatusFeed;

//u23427685 18