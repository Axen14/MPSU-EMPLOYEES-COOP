import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Members.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
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

  // Deleting a member
  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/members/${id}/`);
      setMembers(members.filter(member => member.memId !== id));
    } catch (err) {
      setError(err);
    }
  };

  const handleEditMember = async (id) => {
    const updatedMember = {
      ...editingMember,
    };

    try {
      const response = await axios.put(`http://localhost:8000/api/members/${id}/`, updatedMember);
      setMembers(members.map(member => (member.memId === id ? response.data : member)));
      setEditingMember(null);
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.membersSection} style={{ width: '100%', border: '2px solid red', background: 'white' }}>
      <div className={styles.tableHeader}>
        <h2 className={styles.membersTitle} style={{ width: '50%', display: 'inline-block', flexGrow: '1' }}>MEMBERS</h2>

        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
          style={{ width: '10%', marginLeft: '250px', backgroundColor: '#41ac6a' }}
        >
          Add Member
        </button>
      </div>

      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <h3>Add Member Form</h3>
        <input
          type="text"
          placeholder="First Name"
          value={newMember.first_name || ''}
          onChange={(e) => setNewMember({ ...newMember, first_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Middle Name"
          value={newMember.middle_name || ''}
          onChange={(e) => setNewMember({ ...newMember, middle_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newMember.last_name || ''}
          onChange={(e) => setNewMember({ ...newMember, last_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newMember.email || ''}
          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={newMember.phone_number || ''}
          onChange={(e) => setNewMember({ ...newMember, phone_number: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={newMember.address || ''}
          onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
        />
        <button onClick={handleAddMember}>Submit</button>
      </Modal>

      <table className={styles.membersTable} style={{ border: '2px solid #000', width: '100%' }}>
        <thead style={{ border: '2px solid #000' }}>
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
            <tr key={member.memId} style={{ textAlign: 'center' }}>
              <td>{member.memId}</td>
              <td>{member.first_name} {member.last_name}</td>
              <td>{member.email}</td>
              <td>{member.phone_number}</td>
              <td>{member.address}</td>
              <td>
                <button onClick={() => setEditingMember(member)}>Edit</button>
                <button onClick={() => handleDeleteMember(member.memId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingMember && (
        <div>
          <h3>Edit Member</h3>
          <input
            type="text"
            placeholder="First Name"
            value={editingMember.first_name || ''}
            onChange={(e) => setEditingMember({ ...editingMember, first_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Middle Name"
            value={editingMember.middle_name || ''}
            onChange={(e) => setEditingMember({ ...editingMember, middle_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={editingMember.last_name || ''}
            onChange={(e) => setEditingMember({ ...editingMember, last_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={editingMember.email || ''}
            onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={editingMember.phone_number || ''}
            onChange={(e) => setEditingMember({ ...editingMember, phone_number: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={editingMember.address || ''}
            onChange={(e) => setEditingMember({ ...editingMember, address: e.target.value })}
          />
          <button onClick={() => handleEditMember(editingMember.memId)}>Save</button>
          <button onClick={() => setEditingMember(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Members;
