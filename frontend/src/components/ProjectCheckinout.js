import React from "react";

function ProjectCheckInOut() {
  return (
    <section>
      <h2>Check In / Check Out Files</h2>
      <form>
        <label htmlFor="fileToCheckIn">Select File to Check In</label>
        <input type="file" id="fileToCheckIn" name="fileToCheckIn" />
        <label htmlFor="checkInMessage">Check-in Message</label>
        <textarea id="checkInMessage" name="checkInMessage" />
        <button type="submit">Check In</button>
      </form>
      <form>
        <label htmlFor="fileToCheckOut">Select File to Check Out</label>
        <select id="fileToCheckOut" name="fileToCheckOut">
        </select>
        <button type="submit">Check Out</button>
      </form>
    </section>
  )
}

export default ProjectCheckInOut;