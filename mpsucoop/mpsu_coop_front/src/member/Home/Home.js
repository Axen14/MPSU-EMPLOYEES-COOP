import React from 'react';

const Home = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: '37px', backgroundColor: 'black'}}>
      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
        <section id="welcome" style={{ marginBottom: '100px' }}>
          <h1 style={{ fontSize: '50px', color: 'white', textAlign: 'left' }}>Welcome!!!</h1>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <section id="member-info" style={{ marginBottom: '20px', width: '40%' }}>
            <div style={{backgroundColor: '#4CAF50', borderRadius: '8px', overflow: 'hidden'}}>
              <div style={{backgroundColor: 'gray', color: 'black', padding: '15px', fontSize: '1.2rem', fontWeight: 'bold'}}>
                <h3 style={{ margin: 0 }}>Capstoneee!!</h3>
              </div>

              <div style={{ padding: '20px' }}>
                <p><strong>Account Number:</strong> 1232516</p>
                <p><strong>Share Capital:</strong> 50,000</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold' }}>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>
                    Regular Loan<br />100,000
                  </div>
                  <div style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '5px', textAlign: 'center' }}>
                    Emergency Loan<br />100,000
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="loan-status" style={{ marginBottom: '20px', width: '48%' }}>
            <div style={{backgroundColor: '#4CAF50', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: 'gray', color: 'black', padding: '15px', fontSize: '1.2rem', fontWeight: 'bold'}}>
                <h3 style={{ margin: 0 }}>Loan Due on August 26, 2024</h3>
              </div>

              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'black', marginBottom: '10px' }}>10,272.90</p>
                <p>Amount Paid</p>
                <p>10,272.90 out of 61,637.39</p>
                <div style={{ height: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '20px' }}>
                  <div style={{height: '100%', borderRadius: '5px', backgroundColor: 'red', width: '20%'}}></div>
                </div>
                <p><strong>Interest Rate:</strong> 5%</p>
                <p><strong>Interest Due:</strong> 1,637.39</p>
                <a href="Ledger" style={{
                  display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: 'black', fontSize: '1rem',
                  textAlign: 'center', borderRadius: '5px', textDecoration: 'none', transition: 'background-color 0.3s'
                }}>View Ledger</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
