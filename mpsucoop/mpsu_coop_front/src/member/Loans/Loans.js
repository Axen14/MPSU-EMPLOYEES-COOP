import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Loans = () => {
  const handleSearch = (event) => {
    let filter = event.target.value.toLowerCase();
    let rows = document.querySelectorAll('#table-body tr');

    rows.forEach((row) => {
      let match = false;
      row.querySelectorAll('td').forEach((td) => {
        if (td.innerText.toLowerCase().includes(filter)) {
          match = true;
        }
      });
      row.style.display = match ? '' : 'none';
    }); 
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0', backgroundColor: '#f4f7fc' }}>
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
        <section style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Loans</h1>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <div>
            <div>
              <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ padding: '20px' }}>

                  {/* Search Form */}
                  <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <input
                      type="text"
                      onChange={handleSearch}
                      placeholder="Find Something....."
                      style={{
                        padding: '10px',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '80%',
                      }}
                    />
                    <button type="submit" style={{
                      padding: '10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>
                  </form>

                  {/* Table */}
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #ddd',
                  }}>
                    <thead>
                      <tr>
                        <th style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '12px',
                          textAlign: 'left',
                        }}>DATE</th>
                        <th style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '12px',
                          textAlign: 'left',
                        }}>ACCOUNT NUMBER</th>
                        <th style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '12px',
                          textAlign: 'left',
                        }}>OR NUMBER</th>
                        <th style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '12px',
                          textAlign: 'left',
                        }}>LOAN TYPE</th>
                        <th style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          padding: '12px',
                          textAlign: 'left',
                        }}>BALANCE</th>
                      </tr>
                    </thead>
                    <tbody id="table-body">
                      <tr>
                        <td style={{ padding: '12px', textAlign: 'left' }}>2024-09-01</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>123456</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>1001</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>Emergency</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>$5000</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px', textAlign: 'left' }}>2024-09-02</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>654321</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>1002</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>Regular</td>
                        <td style={{ padding: '12px', textAlign: 'left' }}>$10000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Loans;
