import React from 'react';
import styles from './MembersTable.css';

function MembersTable() {
  return (
    <div className={styles.membersSection} style={{ width:'100%', border: '2px solid red', background:'white'}}>
      <div className={styles.tableHeader} >
        <h2 className={styles.membersTitle} style={{width:'50%', display:'inline-block',flexGrow: '1'}}>MEMBERS</h2>
        
        <button className={styles.addButton} style={{width:'10%', marginLeft:'250px', backgroundColor: '#41ac6a'}}>Add</button>
      </div>
      <table className={styles.membersTable} style={{border: '2px solid #000', width:'100%'}}>
        <thead style={{border: '2px solid #000', }}>
          <tr >
            <th>ID</th>
            <th>NAME</th>
            <th>ACCOUNT ID</th>
            <th>TYPE</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} style={{textAlign:'center'}}>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default MembersTable;