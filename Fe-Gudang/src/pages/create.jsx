import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, getCategories, getProduct, updateProduct } from '../utils/apiClient'
import { toast } from 'react-toastify';

const Create = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL if editing
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]); const [formData, setFormData] = useState({
    nama_barang: '',
    stok: '',
    harga: '',
    category_id: '',
  });  // Fetch categories and product data (if editing) when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await getCategories();
        console.log('Categories response:', categoriesResponse);

        // Process categories data to ensure it's an array
        let categoriesData = [];

        // Handle different response formats from Laravel
        if (categoriesResponse && Array.isArray(categoriesResponse.data)) {
          // Response has {data: [...]}
          categoriesData = categoriesResponse.data;
        } else if (categoriesResponse && categoriesResponse.status === 'success' && Array.isArray(categoriesResponse.data)) {
          // Response has {status: 'success', data: [...]}
          categoriesData = categoriesResponse.data;
        } else if (Array.isArray(categoriesResponse)) {
          // Response is directly an array
          categoriesData = categoriesResponse;
        } else if (categoriesResponse && typeof categoriesResponse === 'object') {
          // Try to extract data from response object
          if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
            categoriesData = categoriesResponse.data;
          }
        }

        console.log('Processed categories data:', categoriesData);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // If editing, fetch product data
        if (isEditing) {
          const productData = await getProduct(id);

          // Update form data with product info
          setFormData({
            nama_barang: productData.nama_barang || '',
            stok: productData.stok || '',
            harga: productData.harga || '',
            category_id: productData.category_id || '',
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(isEditing
          ? "Failed to load product data. " + err.message
          : "Failed to load categories. " + err.message);
      }
    };

    fetchData();
  }, [id, isEditing]);
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;

    // For numeric fields, ensure we have proper numbers
    let processedValue = value;
    if ((id === 'stok' || id === 'harga') && value !== '') {
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
    setError(''); try {
      // Verify token existence before submission
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // For debugging - log the raw form data
      console.log('Raw form data:', formData);

      // Create FormData object for file upload
      const productData = new FormData();

      // Append all form fields to the FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          productData.append(key, formData[key]);
        }
      });

      // Verify that required fields are present
      const requiredFields = ['nama_barang', 'stok', 'harga', 'category_id'];
      const missingFields = requiredFields.filter(field =>
        !productData.has(field) || !productData.get(field)
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('Submitting product data:', {
        nama_barang: productData.get('nama_barang'),
        stok: productData.get('stok'),
        harga: productData.get('harga'),
        category_id: productData.get('category_id')
      });

      // If editing, add a _method field for Laravel to handle PUT/PATCH request
      if (isEditing) {
        if (formData.image instanceof File) {
          productData.append('_method', 'PUT'); // Laravel recognizes this for form data
        }

        // Update existing product
        const response = await updateProduct(id, productData);
        toast.success("Product updated successfully!");
        console.log('Update response:', response);
      } else {
        // Create new product
        const response = await createProduct(productData);
        toast.success("Product created successfully!");
        console.log('Create response:', response);
      }

      // Navigate to data page
      navigate('/data');
    } catch (err) {
      console.error(isEditing ? "Error updating product:" : "Error creating product:", err);

      // More descriptive error for the user
      if (err.message.includes('Unauthenticated') || err.message.includes('Unauthorized')) {
        setError('Authentication error. Please log in again.');
        setTimeout(() => {
          localStorage.removeItem('token');
          navigate('/login');
        }, 2000);
      } else {
        setError(err.message || 'An error occurred while saving the product.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>       {/* Begin Page Content */}
      <div className="container-fluid">
        {/* Page Heading */}
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">
            {isEditing ? 'Edit Product' : 'Add New Product'}
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
                <h6 className="m-0 font-weight-bold text-primary">Tambah Barang</h6>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <div className="col-sm mb-3 mb-sm-0">
                      <label htmlFor="nama_barang">Nama barang</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nama_barang"
                        placeholder="Item Name"
                        value={formData.nama_barang}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <label htmlFor="category_id">Category</label>
                      <select
                        className="form-control"
                        id="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        required
                      >                        <option value="">Select Category</option>
                        {Array.isArray(categories) ? (
                          categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.nama_kategori || category.name || 'Unnamed category'}
                            </option>
                          ))
                        ) : (
                          <option disabled>Error loading categories</option>
                        )}
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="stok">Stok</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Stok barang"
                        id="stok"
                        value={formData.stok}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <div className="col-sm mb-3 mb-sm-0">
                      <label htmlFor="harga">Harga</label>
                      <input
                        type="number"
                        className="form-control"
                        id="harga"
                        placeholder="Harga barang"
                        value={formData.harga}
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
                        onClick={() => navigate('/data')}
                      >
                        Cancel
                      </button>                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : isEditing ? 'Update Item' : 'Save Item'}
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
                <p>When adding new inventory items:</p>
                <ul>
                  <li>Double-check the quantity and price</li>
                  <li>Select the appropriate category</li>
                  <li>Verify supplier information is correct</li>
                  <li>Include detailed description for easier identification</li>
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

export default Create
