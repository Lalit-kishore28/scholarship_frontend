import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from './config';

function ScholarshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchScholarshipDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/scholarships/${id}`);
      setScholarship(response.data);
    } catch (err) {
      setError('Failed to fetch scholarship details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchScholarshipDetails();
  }, [fetchScholarshipDetails]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !scholarship) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{scholarship.title}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Amount</p>
            <p className="text-2xl font-bold text-green-600">${scholarship.amount}</p>
          </div>
          <div>
            <p className="text-gray-600">Deadline</p>
            <p className="text-xl font-semibold">
              {new Date(scholarship.deadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Category</p>
            <p className="text-xl font-semibold capitalize">{scholarship.category}</p>
          </div>
          <div>
            <p className="text-gray-600">Posted By</p>
            <p className="text-xl font-semibold">{scholarship.createdBy?.name}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{scholarship.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Eligibility</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{scholarship.eligibility}</p>
        </div>

        {scholarship.website && (
          <div className="mb-6">
            <a
              href={scholarship.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 inline-block"
            >
              Visit Official Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScholarshipDetails;
