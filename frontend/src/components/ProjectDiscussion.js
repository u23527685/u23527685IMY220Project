import React from 'react';
import"../../public/assets/css/projectdiscussion.css";
function ProjectDiscussion({ discussion }) {
  // discussion: array of { id, user, message, timestamp }
  const handlesubmit=(event)=>{
    event.preventDefault();
  }
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
        <button onClick={handlesubmit} type="submit">Post</button>
      </form>
    </section>
  );
}

export default  ProjectDiscussion;

//u23427685 18