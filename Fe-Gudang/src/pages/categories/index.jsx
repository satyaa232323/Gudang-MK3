import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../utils/apiClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        nama_kategori: '',
        description: ''
    });

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getCategories();

            if (response && response.data) {
                setCategories(response.data);
            } else {
                setCategories(response);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError(err.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const categoryData = {
                nama_kategori: formData.nama_kategori,
                description: formData.description
            };

            if (formMode === 'add') {
                await createCategory(categoryData);
            } else if (currentCategory?.id) {
                await updateCategory(currentCategory.id, categoryData);
            } else {
                throw new Error('Invalid category ID for update');
            }

            // Reset form
            setFormData({ nama_kategori: '', description: '' });
            setFormMode('add');
            setCurrentCategory(null);

            // Show success message
            toast.success(formMode === 'add' ? 'kategori Berhasil Ditambahkan' : 'Kategori Berhasil Diupdate!');

            // Refresh categories
            await fetchCategories();

        } catch (err) {
            console.error("Error saving category:", err);
            setError(err.message || 'Failed to save category');
            toast.error(err.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };
    const startEdit = (category) => {
        setFormMode('edit');
        setCurrentCategory(category);
        setFormData({
            nama_kategori: category.nama_kategori,
            description: category.description || ''
        });
    };
    const cancelEdit = () => {
        setFormMode('add');
        setCurrentCategory(null);
        setFormData({ nama_kategori: '', description: '' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            setLoading(true);
            setError('');
            await deleteCategory(id);

            // Show success message
            toast.success('Category deleted successfully!');

            // Refresh categories
            await fetchCategories();
        } catch (err) {
            console.error("Error deleting category:", err);
            setError(err.message || "Failed to delete category");
            toast.error(err.message || "Failed to delete category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ToastContainer position="top-right" />
            <div className="container-fluid">
                {/* Page Heading */}
                <h1 className="h3 mb-2 text-gray-800">Category Management</h1>
                <p className="mb-4">Create and manage categories for your products</p>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                            type="button"
                            className="close"
                            onClick={() => setError('')}
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}

                <div className="row">
                    {/* Category Form */}
                    <div className="col-xl-4 col-lg-5">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">
                                    {formMode === 'add' ? 'Add New Category' : 'Edit Category'}
                                </h6>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="nama_kategori">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nama_kategori"
                                            placeholder="Category Name"
                                            value={formData.nama_kategori}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            rows="3"
                                            placeholder="Category Description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="form-group text-right">
                                        {formMode === 'edit' && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary mr-2"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : formMode === 'add' ? 'Add Category' : 'Update Category'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Categories List */}
                    <div className="col-xl-8 col-lg-7">
                        <div className="card shadow mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">Categories List</h6>
                            </div>
                            <div className="card-body">
                                {loading && categories.length === 0 ? (
                                    <div className="text-center my-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : categories.length === 0 ? (
                                    <div className="text-center my-5">
                                        <p className="text-muted">No categories found</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-bordered" width="100%" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map(category => (
                                                    <tr key={category.id}>
                                                        <td>{category.nama_kategori}</td>
                                                        <td>{category.description || '-'}</td>
                                                        <td>
                                                            <div className="btn-group" role="group">
                                                                <button
                                                                    className="btn btn-info btn-sm"
                                                                    onClick={() => startEdit(category)}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDelete(category.id)}
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
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright © Gudang 2025</span>
                    </div>
                </div>
            </footer>

            <ToastContainer />
        </div>
    );
};

export default Categories;
