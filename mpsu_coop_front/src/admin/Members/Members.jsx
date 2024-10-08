import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Members.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return <div className="spinner">Loading...</div>;
}

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({});
  const [editingMember, setEditingMember] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/members/');
        setMembers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (showAddForm || editingMember) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showAddForm, editingMember]);

  const handleAddMember = async () => {
    // Basic validation
    if (!newMember.first_name || !newMember.last_name || !newMember.email) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/members/', newMember);
      setMembers([...members, response.data]);
      setNewMember({});
      setShowAddForm(false);
      setSuccessMessage('Member added successfully!');
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/members/${id}/`);
      setMembers(members.filter(member => member.memId !== id));
      setSuccessMessage('Member deleted successfully!');
    } catch (err) {
      setError(err);
    }
  };

  const handleEditMember = async (id) => {
    const updatedMember = { ...editingMember };
    try {
      const response = await axios.put(`http://localhost:8000/api/members/${id}/`, updatedMember);
      setMembers(members.map(member => (member.memId === id ? response.data : member)));
      setEditingMember(null);
      setSuccessMessage('Member updated successfully!');
    } catch (err) {
      setError(err);
    }
  };

  // Calculate statistics based on members
  const totalBorrowers = members.length;
  const activeBorrowers = members.filter(member => member.status === 'active').length; 
  const paidOffBorrowers = members.filter(member => member.status === 'paid-off').length; 

  const totalLoans = totalBorrowers; 
  const activeLoans = activeBorrowers; 

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="errorMessage">Error: {error.message}</div>;

  return (
    <div className="dashboard">
      <section className="stats-section">
        <div className="stat-card">
          <h3>Borrowers</h3>
          <p>{totalBorrowers}</p>
          <small>Active: {activeBorrowers}</small>
          <small>Paid-off: {paidOffBorrowers}</small>
        </div>
        <div className="stat-card">
          <h3>Net Total Loan Amount</h3>
          <p>{/* Calculate total loan amount here */} 5,000,000</p>
          <small>Received: {/* Received amount calculation */} 3,000,000</small>
        </div>
        <div className="stat-card">
          <h3>Loans</h3>
          <p>{totalLoans}</p>
          <small>Active: {activeLoans}</small>
          <small>Fully Paid: {/* Calculate fully paid loans here */} </small>
        </div>
      </section>

      <div className="membersSection">
        <div className="tableHeader">
          <h2 className="membersTitle">MEMBERS</h2>
          <button className="addButton" onClick={() => setShowAddForm(true)}>
            <i className="fas fa-user-plus"></i> Add Member
          </button>
        </div>

        {successMessage && <div className="successMessage">{successMessage}</div>}

        {/* Modal for Add Member */}
        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <h3>Add Member</h3>
          {['first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'address'].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace('_', ' ').toUpperCase()}
              value={newMember[field] || ''}
              onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })}
            />
          ))}
          <button className="submitButton" onClick={handleAddMember}>Submit</button>
        </Modal>

        {/* Members Table */}
        <table className="membersTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.memId}>
                <td>{member.memId}</td>
                <td>{`${member.first_name} ${member.last_name}`}</td>
                <td>{member.email}</td>
                <td>{member.phone_number}</td>
                <td>{member.address}</td>
                <td>
                  <button className="editButton" onClick={() => setEditingMember(member)}>
                    <i className="fas fa-user-edit"></i> Edit
                  </button>
                  <button className="deleteButton" onClick={() => handleDeleteMember(member.memId)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Member Form */}
        {editingMember && (
          <Modal isOpen={!!editingMember} onClose={() => setEditingMember(null)}>
            <h3>Edit Member</h3>
            {['first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'address'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace('_', ' ').toUpperCase()}
                value={editingMember[field] || ''}
                onChange={(e) => setEditingMember({ ...editingMember, [field]: e.target.value })}
              />
            ))}
            <button className="submitButton" onClick={() => handleEditMember(editingMember.memId)}>Save</button>
            <button className="cancelButton" onClick={() => setEditingMember(null)}>Cancel</button>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Members;
