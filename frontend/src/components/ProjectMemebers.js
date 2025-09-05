import React from 'react';
import"../../public/assets/css/projectmembers.css";
function ProjectMembers({ owner, members }) {
  // owner: { id, name }
  // members: array of { id, name }
  return (
    <section>
      <h2>Project Members</h2>
      <p><strong>Owner:</strong> {owner}</p>
      <ul>
        {members.map((member,i) => (
          <li key={i}>
            {member.username}
            <button>Remove</button>
            <button>Give Ownership</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectMembers;