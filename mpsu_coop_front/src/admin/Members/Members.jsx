import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Members.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMember, setNewMember] = useState({});
  const [editingMember, setEditingMember] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch members 
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

  const handleAddMember = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/members/', newMember);
      setMembers([...members, response.data]);
      setNewMember({});
      setShowAddForm(false);
    } catch (err) {
      setError(err);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/members/${id}/`);
      setMembers(members.filter(member => member.memId !== id));
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
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <div className={styles.loadingMessage}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error.message}</div>;

  return (
    <div className={styles.membersSection}>
      <div className={styles.tableHeader}>
        <h2 className={styles.membersTitle}>MEMBERS</h2>
        <button className={styles.addButton} onClick={() => setShowAddForm(true)}>
          Add Member
        </button>
      </div>

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
        <button className={styles.submitButton} onClick={handleAddMember}>Submit</button>
      </Modal>

      {/* Members Table */}
      <table className={styles.membersTable}>
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
                <button className={styles.editButton} onClick={() => setEditingMember(member)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => handleDeleteMember(member.memId)}>Delete</button>
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
          <button className={styles.submitButton} onClick={() => handleEditMember(editingMember.memId)}>Save</button>
          <button className={styles.cancelButton} onClick={() => setEditingMember(null)}>Cancel</button>
        </Modal>
      )}
    </div>
  );
}

export default Members;
