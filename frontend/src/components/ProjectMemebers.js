import React from 'react';
function ProjectMembers({ owner, members }) {
  // owner: { id, name }
  // members: array of { id, name }
  return (
    <section>
      <h2>Project Members</h2>
      <p><strong>Owner:</strong> {owner.name}</p>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name}
            <button>Remove</button>
            <button>Give Ownership</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProjectMembers;