import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createTransaction, getProducts, getTransaction, updateTransaction, getUserProfile, getUsers } from '../utils/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTransactions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [formData, setFormData] = useState({
        id_product: '',
        id_user: '',
        jenis_transaksi: 'masuk',
        jumlah: '',
        tanggal: new Date().toISOString().split('T')[0]
    });

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get all users for selection
                const usersResponse = await getUsers();
                const usersData = usersResponse?.data || [];
                setUsers(Array.isArray(usersData) ? usersData : []);

                // Fetch products
                const productsResponse = await getProducts();
                let productsData = productsResponse?.data || [];
                setProducts(Array.isArray(productsData) ? productsData : []);

                // If editing, fetch transaction data
                if (isEditing && id) {
                    const transactionResponse = await getTransaction(id);
                    if (transactionResponse && transactionResponse.data) {
                        const data = transactionResponse.data;
                        setFormData({
                            id_product: data.id_product?.toString() || '',
                            id_user: data.id_user?.toString() || '',
                            jenis_transaksi: data.jenis_transaksi || 'masuk',
                            jumlah: data.jumlah?.toString() || '',
                            tanggal: data.tanggal ? new Date(data.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        });
                    } else {
                        throw new Error('Transaction data not found');
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(isEditing
                    ? "Failed to load transaction data. " + err.message
                    : "Failed to load data. " + err.message);
                showErrorToast(err.message);
            }
        };

        fetchData();
    }, [id, isEditing]);

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

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;

        // For numeric fields, ensure we have proper numbers
        let processedValue = value;
        if ((id === 'jumlah') && value !== '') {
            processedValue = type === 'number' ? Number(value) : value;
        }

        console.log(`Field ${id} changed to: ${processedValue}`);

        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : processedValue
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showErrorToast('Authentication token not found. Please log in again.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            // Validate required fields
            const requiredFields = ['id_product', 'id_user', 'jumlah', 'tanggal', 'jenis_transaksi'];
            const missingFields = requiredFields.filter(field => !formData[field]);

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Convert jumlah to number
            const transactionData = {
                ...formData,
                jumlah: parseInt(formData.jumlah, 10)
            };

            if (isEditing) {
                const response = await updateTransaction(id, transactionData);
                console.log('Update response:', response);
                showSuccessToast('Transaksi berhasil diperbarui!');
            } else {
                const response = await createTransaction(transactionData);
                console.log('Create response:', response);
                showSuccessToast('Transaksi berhasil dibuat!');
            }

            setTimeout(() => navigate('/transactions'), 1500);
        } catch (err) {
            console.error(isEditing ? "Error updating transaction:" : "Error creating transaction:", err);
            showErrorToast(err.message || 'An error occurred while saving the transaction.');

            if (err.message.includes('Unauthenticated') || err.message.includes('Unauthorized')) {
                setTimeout(() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    }; return (
        <div>
            {/* Begin Page Content */}
            <div className="container-fluid">
                {/* Page Heading */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">
                        {isEditing ? 'Edit Transaction' : 'Tambah Transaksi'}
                    </h1>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <div className="row">
                    <div className="col-lg-8">
                        {/* Form Card */}
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Tambah Transaksi</h6>
                            </div>


                            <div className="card-body">
                                <form onSubmit={handleSubmit}>                                    <div className="form-group row">
                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <label htmlFor="id_user">User</label>
                                        <select
                                            className="form-control"
                                            id="id_user"
                                            value={formData.id_user}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Pilih User</option>
                                            {Array.isArray(users) ? (
                                                users.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name || 'Unnamed user'}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Error loading users</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <label htmlFor="jenis_transaksi">Jenis Transaksi</label>
                                        <select
                                            className="form-control"
                                            id="jenis_transaksi"
                                            value={formData.jenis_transaksi}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="masuk">Masuk</option>
                                            <option value="keluar">Keluar</option>
                                        </select>
                                    </div>
                                </div>

                                    <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <label htmlFor="id_product">Product</label>
                                            <select
                                                className="form-control"
                                                id="id_product"
                                                value={formData.id_product}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                {Array.isArray(products) ? (
                                                    products.map(product => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.nama_barang || product.name || 'Unnamed product'}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Error loading products</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <label htmlFor="jumlah">Jumlah</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Jumlah transaksi"
                                                id="jumlah"
                                                value={formData.jumlah}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm mb-3 mb-sm-0">
                                            <label htmlFor="tanggal">Tanggal</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="tanggal"
                                                value={formData.tanggal}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>


                                    <hr />

                                    <div className="row">
                                        <div className="col text-right">
                                            <button
                                                type="button"
                                                className="btn btn-secondary mr-2"
                                                onClick={() => navigate('/transactions')}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Create Transaction'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        {/* Tips Card */}
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Tips</h6>
                            </div>
                            <div className="card-body">
                                <p>When managing transactions:</p>
                                <ul>
                                    <li>Double-check the product and quantity</li>
                                    <li>Verify the transaction type (masuk/keluar)</li>
                                    <li>Ensure the selected user is correct</li>
                                    <li>Transaction date should be accurate</li>
                                    <li>Stock levels are automatically adjusted</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /.container-fluid */}


        </div>
    )
}

export default CreateTransactions
