import React, { useState } from 'react';
import auth from '../../utils/GudangAPI';

const ForgotPassword = () => {

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
                                            <p className="mb-4">
                                                We get it, stuff happens. Just enter your email address below
                                                and we'll send you a link to reset your password!
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {success && (
                                            <div className="alert alert-success" role="alert">
                                                {success}
                                            </div>
                                        )}

                                        <form className="user" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <input
                                                    type="email"
                                                    className="form-control form-control-user"
                                                    id="email"
                                                    placeholder="Enter Email Address..."
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-user btn-block"
                                                disabled={loading}
                                            >
                                                {loading ? 'Processing...' : 'Reset Password'}
                                            </button>
                                        </form>
                                        <hr />
                                        <div className="text-center">
                                            <a className="small" href="/register">
                                                Create an Account!
                                            </a>
                                        </div>
                                        <div className="text-center">
                                            <a className="small" href="/login">
                                                Already have an account? Login!
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
