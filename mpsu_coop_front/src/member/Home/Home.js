import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Welcome!!!</h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Member Info Section */}
            <div className="col-md-6">
              <div className="card member-info">
                <div className="card-header">
                  <h3 className="card-title">Marbert Bernardez</h3>
                </div>
                <div className="card-body">
                  <p><strong>Account Number:</strong> 1232516</p>
                  <p><strong>Share Capital:</strong> 50,000</p>
                  <div className="row loan-details">
                    <div className="col-6">
                      <div className="loan-type">
                        Regular Loan<br />100,000
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="loan-type">
                        Emergency Loan<br />100,000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Status Section */}
            <div className="col-md-6">
              <div className="card loan-status">
                <div className="card-header">
                  <h3 className="card-title">Loan Due on August 26, 2024</h3>
                </div>
                <div className="card-body">
                  <p className="amount-paid">10,272.90</p>
                  <p>Amount Paid</p>
                  <p>10,272.90 out of 61,637.39</p>
                  <div className="progress">
                    <div className="progress-bar bg-success" style={{ width: '20%' }}></div>
                  </div>
                  <p><strong>Interest Rate:</strong> 5%</p>
                  <p><strong>Interest Due:</strong> 1,637.39</p>
                  <a href="ledger" className="btn btn-primary">View Ledger</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
