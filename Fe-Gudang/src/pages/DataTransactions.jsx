import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTransactions, deleteTransaction, getProducts } from '../utils/apiClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataTransactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const showSuccessToast = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const showErrorToast = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    // Fetch transactions and products when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch products first to use for displaying product names
                const productsResponse = await getProducts();
                const productsData = productsResponse?.data || [];

                // Create a map of product id to product name for easier lookup
                const productMap = {};
                productsData.forEach(product => {
                    if (product && product.id) {
                        productMap[product.id] = product.nama_barang || 'Unnamed';
                    }
                });

                setProducts(productMap);

                // Now fetch transactions
                const transactionsResponse = await getTransactions();
                const transactionsData = transactionsResponse?.data || [];
                setTransactions(transactionsData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load transactions. " + (err.message || "Please try again later."));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle transaction deletion
    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            setTransactions(transactions.filter(transaction => transaction.id !== id));
            setConfirmDelete(null);
            showSuccessToast('Transaksi berhasil dihapus!');
        } catch (err) {
            console.error("Error deleting transaction:", err);
            showErrorToast(err.message || 'Gagal menghapus transaksi');
        }
    };

    // Filter transactions based on search term
    const filteredTransactions = transactions.filter(transaction =>
        products[transaction.id_product]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.jenis_transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.id && transaction.id.toString().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <ToastContainer />
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Transaction Management</h1>
                <p className="mb-4">
                    View, edit, and manage all your transactions from this dashboard.
                </p>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Search and Add button */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control bg-light border-0 small"
                                placeholder="Search for transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        <Link to="/createTransaction" className="btn btn-primary">
                            <i className="fas fa-plus fa-sm text-white-50 mr-2"></i>
                            Add New Transaction
                        </Link>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                        <h6 className="m-0 font-weight-bold text-primary">Transactions List</h6>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-2">Loading transactions...</p>
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="text-center my-5">
                                <p className="text-muted">No transactions found</p>                                <Link to="/createTransaction" className="btn btn-outline-primary">
                                    Add your first transaction
                                </Link>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered" width="100%" cellSpacing="0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Produk</th>
                                            <th>Jenis Transaksi</th>
                                            <th>Jumlah</th>

                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map(transaction => (
                                            <tr key={transaction.id}>
                                                <td>{transaction.id}</td>
                                                <td>{products[transaction.id_product] || 'Unknown'}</td>
                                                <td>{transaction.jenis_transaksi}</td>
                                                <td>{transaction.jumlah}</td>

                                                <td>
                                                    <div className="btn-group" role="group">                                            <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => navigate(`/createTransaction`, { state: { id: transaction.id } })}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => setConfirmDelete(transaction.id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {confirmDelete && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="close" onClick={() => setConfirmDelete(null)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataTransactions;
