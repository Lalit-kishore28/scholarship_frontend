import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';
import API_URL from './config';

function ScholarshipFinder() {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/scholarships`);
      setScholarships(response.data);
      setFilteredScholarships(response.data);
    } catch (err) {
      setError('Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterScholarships(term, categoryFilter);
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    filterScholarships(searchTerm, category);
  };

  const filterScholarships = (term, category) => {
    let filtered = scholarships;

    if (term) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term)
      );
    }

    if (category) {
      filtered = filtered.filter((s) => s.category === category);
    }

    setFilteredScholarships(filtered);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading scholarships...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Find Scholarships</h1>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search scholarships..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={categoryFilter}
          onChange={handleCategoryFilter}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="merit-based">Merit-Based</option>
          <option value="need-based">Need-Based</option>
          <option value="sports">Sports</option>
          <option value="arts">Arts</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((scholarship) => (
          <div key={scholarship._id} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-2">{scholarship.title}</h2>
            <p className="text-gray-600 mb-2">{scholarship.description.substring(0, 100)}...</p>
            <div className="mb-4">
              <span className="text-green-600 font-bold text-lg">${scholarship.amount}</span>
              <span className="text-gray-500 ml-2 text-sm">
                Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/scholarship/${scholarship._id}`}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
              >
                View Details
              </Link>
              <button
                onClick={() => toggleFavorite(scholarship._id)}
                className={`px-4 py-2 rounded ${
                  favorites.includes(scholarship._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                ♥
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No scholarships found
        </div>
      )}
    </div>
  );
}

export default ScholarshipFinder;
