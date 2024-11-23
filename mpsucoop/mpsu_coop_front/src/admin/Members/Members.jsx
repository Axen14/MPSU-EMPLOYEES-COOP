import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {AiOutlineUsergroupAdd} from "react-icons/ai";
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from "react-icons/fa6";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [newMember, setNewMember] = useState({});
  const [editingMember, setEditingMember] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/members/');
        setMembers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddMember = async () => {
    if (!newMember.first_name || !newMember.last_name) {
      setFormError('First and last names are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/members/', newMember);
      setMembers([...members, response.data]);
      setNewMember({});
      setShowAddForm(false);
      setFormError(null);
    } catch (err) {
      setFormError('Error adding member. Please try again.');
    }
  };

  const handleDeleteMember = async id => {
    try {
      await axios.delete(`http://localhost:8000/members/${id}/`);
      setMembers(members.filter(member => member.memId !== id));
    } catch (err) {
      setError('Error deleting member.');
    }
  };

  const handleEditMember = async () => {
    if (!editingMember.first_name || !editingMember.last_name) {
      setFormError('First and last names are required.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/members/${editingMember.memId}/`,
        editingMember
      );
      setMembers(
        members.map(member =>
          member.memId === editingMember.memId ? response.data : member
        )
      );
      setEditingMember(null);
      setShowAddForm(false);
      setFormError(null);
    } catch (err) {
      setFormError('Error updating member. Please try again.');
    }
  };

  const handleStartEdit = (member) => {
    setEditingMember({ ...member });
    setShowAddForm(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {showAddForm ? (
        <div style={{ margin: '20px', border: '2px solid red', padding: '5px', borderRadius: '5px' }}>
          <h3>{editingMember ? 'Edit Member' : 'Add Member'}</h3>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}

          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            value={editingMember?.first_name || newMember.first_name || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
            style={{ margin: '20px 3px', padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="last_name"
            value={editingMember?.last_name || newMember.last_name || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
            style={{ margin: '20px 3px', padding: '5px' }}
          />
          <button
            onClick={editingMember ? handleEditMember : handleAddMember}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            {editingMember ? 'Save Changes' : 'Submit'}
          </button>
          <button onClick={() => setShowAddForm(false)} style={{ padding: '5px 10px' }}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'left' }}>
            <h2 style={{ margin: 0 }}>MEMBERS</h2>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                marginLeft: '50%',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'black',
                cursor: 'pointer',
              }}
            >
              <AiOutlineUsergroupAdd />Add Member
            </button>
          </div>

          <table style={{ height: '10%' ,width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Account No.</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Name</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Email</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Phone Number</th>
                <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.memId} style={{ textAlign: 'center', borderBottom: '1px solid red' }}>
                  <td style={{ padding: '8px' }}>{member.accountN || 'No Account'}</td>
                  <td style={{ padding: '8px' }}>{member.first_name} {member.last_name}</td>
                  <td style={{ padding: '8px' }}>{member.email}</td>
                  <td style={{ padding: '8px' }}>{member.phone_number}</td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={() => handleStartEdit(member)}
                      style={{ marginRight: '5px', padding: '5px 10px' }}
                    >
                      <FaEdit />Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.memId)}
                      style={{ padding: '5px 10px', backgroundColor: 'red', color: 'black', border: 'none', borderRadius: '3px' }}
                    >
                      <FaTrash />Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Members;
