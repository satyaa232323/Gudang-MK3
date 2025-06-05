import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import { getDashboardData, getProducts, getUserProfile } from '../utils/apiClient';
import StatsCard from '../components/cards/StatsCard';
import axios from 'axios';


const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');

    const [user, setUser] = useState({
        name: '',
    });


    const [stats, setStats] = useState({
        totalProducts: 0,
        totalTransactions: 0,
        totalCategories: 0
    });


    const [products, setProducts] = useState([]);

    // Fetch dashboard data on component mount
    useEffect(() => {
        const fetchData = async () => {
            // fetch products
            try {
                setLoading(true);
                const [userData, dashData] = await Promise.all([
                    getUserProfile(),
                    getDashboardData(),
                ]);
                setUser(userData);
                setDashboardData(dashData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load dashboard data');
                // If error is due to authentication, redirect to login
                if (err.message.includes('Unauthorized') || err.message.includes('Unauthenticated')) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const fetchStats = async () => {
            try {
                const [productsRes, transactionsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/products', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }),
                    axios.get('http://127.0.0.1:8000/api/transactions', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                ]);


                const products = productsRes.data.data || [];
                const transactions = transactionsRes.data.data || [];

                setStats({
                    totalProducts: products.length,
                    totalTransactions: transactions.length,
                    totalCategories: new Set(products.map(product => product.category_id)).size
                });

            }
            catch (error) {
                console.error('Error fetching stats:', error);
                setError('Failed to load statistics');
            }
        };
        fetchStats();

        const fetchUser = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();






    }, [navigate], []);





    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <>
            {/* Main Content */}
            <div>
                {/* Begin Page Content */}

                {/* Page Heading */}
                <h1 className='h3 mb-4 text-gray-800'>Dashboard</h1>
                <div className="row">
                    <StatsCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon="fa-boxes"
                        color="primary"

                    />
                    <StatsCard
                        title="Total Transactions"
                        value={stats.totalTransactions}
                        icon="fa-exchange-alt"
                        color="success"
                    />

                    <StatsCard
                        title="Categories"
                        value={stats.totalCategories}
                        icon="fa-tags"
                        color="info"
                    />
                </div>

            </div>
            {/* Content Row */}

            {/* Content Row */}
            <div className="row">
                {/* Content Column */}

                <div className="col-xl mb-4">
                    {/* Illustrations */}
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">
                                Hello {user.name || 'User'}!
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="text-center">
                            </div>
                            <p>
                                selamat datang di dashboard Gudang, sebuah aplikasi yang dirancang untuk membantu Anda mengelola produk dan transaksi dengan mudah. Di sini, Anda dapat melihat statistik penting seperti jumlah produk, transaksi, dan kategori yang tersedia.


                            </p>

                        </div>
                    </div>
                    {/* Approach */}
                </div>
            </div>


            {/* /.container-fluid */}            {/* End of Main Content */}


            {/* Scroll to Top Button*/}
            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up" />
            </a>
            {/* Logout Modal*/}
            <div
                className="modal fade"
                id="logoutModal"
                tabIndex={-1}
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Ready to Leave?
                            </h5>
                            <button
                                className="close"
                                type="button"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Select "Logout" below if you are ready to end your current session.
                        </div>                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                type="button"
                                data-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button className="btn btn-primary" type="button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
