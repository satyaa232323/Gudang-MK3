
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct, getCategories } from '../utils/apiClient';
import { toast } from 'react-toastify';

const Data = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); 
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Fetch products and categories when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories first to use for displaying category names
                const categoriesResponse = await getCategories();
                console.log('Categories response:', categoriesResponse);

                // Handle different response formats from Laravel
                let categoriesData = [];

                // Check for various response formats
                if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
                    categoriesData = categoriesResponse.data;
                } else if (categoriesResponse && categoriesResponse.status === 'success' && Array.isArray(categoriesResponse.data)) {
                    categoriesData = categoriesResponse.data;
                } else if (Array.isArray(categoriesResponse)) {
                    categoriesData = categoriesResponse;
                } else if (categoriesResponse && typeof categoriesResponse === 'object') {
                    // Try to extract data from response object
                    if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
                        categoriesData = categoriesResponse.data;
                    }
                }

                console.log('Processed categories data:', categoriesData);

                if (!Array.isArray(categoriesData)) {
                    console.warn('Categories data is not an array:', categoriesData);
                    categoriesData = []; // Fallback to empty array to prevent errors
                }

                // Create a map of category id to category name for easier lookup
                const categoryMap = {};
                categoriesData.forEach(category => {
                    if (category && category.id) {
                        categoryMap[category.id] = category.nama_kategori || category.name || 'Unnamed';
                    }
                });

                console.log('Category map created:', categoryMap);
                setCategories(categoryMap);

                // Now fetch products
                const productsResponse = await getProducts();
                console.log('Products response:', productsResponse);

                // Handle different response formats
                if (productsResponse && productsResponse.data) {
                    setProducts(productsResponse.data);
                } else if (Array.isArray(productsResponse)) {
                    setProducts(productsResponse);
                } else {
                    console.warn('Invalid products data format:', productsResponse);
                    throw new Error('Failed to load products data');
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load products. " + (err.message || "Please try again later."));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle product deletion
    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);

            // Update the products list after deletion
            setProducts(products.filter(product => product.id !== id));

          
            // Reset confirmation state
            setConfirmDelete(null);
        } catch (err) {
            console.error("Error deleting product:", err); setError("Failed to delete product. " + err.message);
        }
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.id && product.id.toString().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Data Produk</h1>
                <p className="mb-4">
                   Atur Produk Anda di sini. Anda dapat menambahkan, mengedit, dan menghapus produk sesuai kebutuhan. Gunakan fitur pencarian untuk menemukan produk dengan cepat.
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
                                placeholder="Search for products..."
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
                        <Link to="/create" className="btn btn-primary">
                            <i className="fas fa-plus fa-sm text-white-50 mr-2"></i>
                            Add New Product
                        </Link>
                    </div>
                </div>

                {/* Products Table */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                        <h6 className="m-0 font-weight-bold text-primary">Products List</h6>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-2">Loading products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center my-5">
                                <p className="text-muted">No products found</p>
                                <Link to="/create" className="btn btn-outline-primary">
                                    Add your first product
                                </Link>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered" width="100%" cellSpacing="0">                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                    <tbody>                    
                                        {filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.nama_barang}</td>
                                            <td>{categories[product.category_id] || 'Unknown'}</td>
                                            <td>Rp {product.harga?.toLocaleString() || '0'}</td>
                                            <td>{product.stok}</td>
                                            <td>
                                                <div className="btn-group" role="group">
                                                    <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => navigate(`/edit/${product.id}`)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => setConfirmDelete(product.id)}
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
                                    <p>Are you sure you want to delete this product? This action cannot be undone.</p>
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

export default Data;
