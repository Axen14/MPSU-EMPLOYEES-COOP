import React from 'react';
import './Loans.css';


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
    <div className="wrapper">
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Loans</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">

                    <form className="search-form" id="search-form" onSubmit={(e) => e.preventDefault()}>
                      <input
                        type="text"
                        className="search-input"
                        id="search-query"
                        placeholder="Find Something....."
                        onChange={handleSearch}
                      />
                      <button type="submit" className="search-button">
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </form>

                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>DATE</th>
                          <th>ACCOUNT NUMBER</th>
                          <th>OR NUMBER</th>
                          <th>LOAN TYPE</th>
                          <th>BALANCE</th>
                        </tr>
                      </thead>
                      <tbody id="table-body">
                        <tr>
                          <td>2024-09-01</td>
                          <td>123456</td>
                          <td>1001</td>
                          <td>Emergency</td>
                          <td>$5000</td>
                        </tr>
                        <tr>
                          <td>2024-09-02</td>
                          <td>654321</td>
                          <td>1002</td>
                          <td>Regular</td>
                          <td>$10000</td>
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
    </div>
  );
};

export default Loans;
