import React from 'react';
import './Account.css';

const Account = () => {
  return (
    <div className="account-wrapper">
      <section className="account-header">
        <div className="account-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Account</h1>
            </div>
          </div>
        </div>
      </section>
      <section className="Content">
        <div className="Content-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <table id="example1" className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>ACCOUNT NUMBER</th>
                        <th>LOAN TYPE</th>
                        <th>SHARE CAPITAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>08/06/2024</td>
                        <td>12345</td>
                        <td>Emergency</td>
                        <td>200,000.00</td>
                      </tr>
                      <tr>
                        <td>08/05/2024</td>
                        <td>123456</td>
                        <td>Regular</td>
                        <td>500,000.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;
