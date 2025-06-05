import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../utils/auth';
import { loginUser } from '../../utils/apiClient';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();    // Check if user is already logged in and handle messages from other components
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }

        // Check for success message passed from another component (like Register)
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [navigate, location]); const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginUser({ email, password });
            console.log('Login response:', response);


            let token = null;

            if (response.data?.token) {
                // Direct token in data object
                token = response.data.token;
            } else if (response.token) {
                // Token directly in response
                token = response.token;
            } else if (typeof response === 'string') {
                // In case the token is directly returned as a string
                token = response;
            }

            if (!token) {
                console.error('Token structure not found in response:', response);
                throw new Error('Authentication failed: Could not retrieve token');
            }

            // Use the login utility function to save token
            login(token);
            console.log('Authentication successful, token saved');
            toast.success('Login success');
            navigate('/');
              
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please check your credentials.');
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-vh-100 d-flex align-items-center ">
            <div className="container-fluid p-0">
                <div className="card o-hidden border-0 shadow-lg m-0">
                    <div className="card-body p-0">
                        <div className="row vh-100">
                            <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                            <div className="col-lg-6">
                                <div className="p-5 h-100 d-flex flex-column justify-content-center">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                    </div>                                  
                                      {/* {successMessage && (
                                        <div className="alert alert-success" role="alert">
                                            {successMessage}
                                        </div>
                                    )} */}
                                    {/* {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )} */}
                                    <form className="user" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                className="form-control form-control-user"
                                                id="exampleInputEmail"
                                                aria-describedby="emailHelp"
                                                placeholder="Enter Email Address..."
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control form-control-user"
                                                id="exampleInputPassword"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox small">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="customCheck"
                                                />
                                                <label className="custom-control-label" htmlFor="customCheck">
                                                    Remember Me
                                                </label>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-user btn-block"
                                            disabled={loading}
                                        >
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                        <hr />
                                       
                                    </form>
                                    <hr />                                    <div className="text-center">
                                        <Link className="small" to="/forgot-password">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="text-center">
                                        <Link className="small" to="/register">
                                            Create an Account!
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;
