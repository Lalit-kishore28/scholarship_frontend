import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from './config';

function AdminDashboard() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/scholarships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScholarships(response.data);
    } catch (err) {
      setError('Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/scholarships/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScholarships(scholarships.filter((s) => s._id !== id));
      } catch (err) {
        alert('Failed to delete scholarship');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/add-scholarship"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Scholarship
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {scholarships.length === 0 ? (
        <p className="text-gray-500">No scholarships yet</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">Title</th>
              <th className="border border-gray-300 p-2 text-left">Amount</th>
              <th className="border border-gray-300 p-2 text-left">Category</th>
              <th className="border border-gray-300 p-2 text-left">Deadline</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((scholarship) => (
              <tr key={scholarship._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{scholarship.title}</td>
                <td className="border border-gray-300 p-2">${scholarship.amount}</td>
                <td className="border border-gray-300 p-2 capitalize">{scholarship.category}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2 flex gap-2">
                  <Link
                    to={`/edit-scholarship/${scholarship._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(scholarship._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
