import React from "react";
import "../../public/assets/css/filter.css";

function Filter() {
  return (
    <div className="filter-container">
      <h3>Filter Projects</h3>

      <div className="filter-group">
        <label htmlFor="filter-owner">Owner:</label>
        <select id="filter-owner" name="owner" defaultValue="">
          <option value="">All</option>
          <option value="AlexCoder">AlexCoder</option>
          <option value="DanGrimm">DanGrimm</option>
          <option value="SarahDev">SarahDev</option>
          <option value="Ben10">Ben10</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-date">Date Created:</label>
        <select id="filter-date" name="dateCreated" defaultValue="">
          <option value="">Anytime</option>
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
          <option value="lastYear">Last year</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-likes">Minimum Likes:</label>
        <input type="number" id="filter-likes" name="minLikes" min="0" placeholder="0" />
      </div>

      <div className="filter-group">
        <label htmlFor="filter-downloads">Minimum Downloads:</label>
        <input type="number" id="filter-downloads" name="minDownloads" min="0" placeholder="0" />
      </div>

      <button type="button" className="filter-apply-btn">Apply Filters</button>
    </div>
  );
}

export default Filter;