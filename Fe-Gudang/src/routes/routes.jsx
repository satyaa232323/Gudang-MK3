import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import PrivateRoute from './privateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/dashboard';
import Create from '../pages/create';
import Data from '../pages/data';
import Categories from '../pages/categories';
import DataTransactions from '../pages/DataTransactions';
import CreateTransactions from '../pages/CreateTransactions';
// Lazy loading for future route components
// Example:
// const Products = React.lazy(() => import('../pages/products'));
// Usage: element={<React.Suspense fallback={<div>Loading...</div>}><Products /></React.Suspense>}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >          <Route index element={<Dashboard />} />
          <Route path='create' element={<Create />} />
          <Route path='data' element={<Data />} />
          <Route path='edit/:id' element={<Create />} />
          <Route path='categories' element={<Categories />} />
          <Route path='data' element={<Data />} />
          <Route path='transactions' element={<DataTransactions />} />
          <Route path='createTransaction' element={<CreateTransactions />} />

        </Route>

        {/* Catch all route - redirect to home or 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
