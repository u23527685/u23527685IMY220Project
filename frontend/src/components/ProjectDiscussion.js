import React from 'react';
function ProjectDiscussion({ discussion }) {
  // discussion: array of { id, user, message, timestamp }
  return (
    <section>
      <h2>Project Discussion</h2>
      <ul>
        {discussion.map(({ id, user, message, timestamp }) => (
          <li key={id}>
            <strong>{user}</strong> at {new Date(timestamp).toLocaleString()}
            <p>{message}</p>
          </li>
        ))}
      </ul>
      <form>
        <label htmlFor="newMessage">Add Message</label>
        <textarea id="newMessage" name="newMessage" />
        <button type="submit">Post</button>
      </form>
    </section>
  );
}

export default  ProjectDiscussion;