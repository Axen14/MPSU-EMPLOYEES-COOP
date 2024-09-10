import React from 'react';
import './login.css';

function login() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="container">
      <div className="background"></div>
      <div className="login-box">
        <div className="login-container">
          <h1>MPSPC Employees Credit Cooperative System</h1>
        </div>
        <div className="card-body">
          <button
            type="button"
            className="btn btn-block btn-primary btn-lg"
            onClick={() => setShowLoginModal(true)}
          >
            <i className="fa fa-lock"></i> Log in
          </button>
          <div className="or-divider">OR</div>
          <button
            type="button"
            className="btn btn-block btn-info btn-lg"
            onClick={() => setShowRegisterModal(true)}
          >
            <i className="fa fa-pen"></i> Sign up
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Log in Form</h5>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Username" />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user"></span>
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input type="password" className="form-control" placeholder="Password" />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowLoginModal(false)}
                >
                  <i className="fa fa-times"></i> Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fa fa-unlock"></i> Log in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content register-modal-content">
              <div className="modal-header register-modal-header">
                <h5 className="modal-title">Sign up Form</h5>
              </div>
              <div className="modal-body register-modal-body">
                <form>
                  <div className="row">
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="First Name" />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Middle Name" />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Last Name" />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Email Address" />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-envelope"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Contact Number" />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-phone"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-3">
                      <select className="form-control">
                        <option disabled selected>
                          Select Gender
                        </option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Username" />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-user"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="input-group mb-3">
                        <input type="password" className="form-control" placeholder="Password" />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <span className="fas fa-lock"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="input-group mb-3">
                        <input type="file" className="form-control custom-file-input" id="customFile" />
                        <label className="custom-file-label" htmlFor="customFile">
                          Choose file
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowRegisterModal(false)}
                >
                  <i className="fa fa-times"></i> Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fa fa-check"></i> Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default login;
