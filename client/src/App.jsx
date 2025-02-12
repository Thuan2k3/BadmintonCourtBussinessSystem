import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import ProductCategoryPage from "./pages/productCategory/ProductCategoryPage";
import CreateProductCategoryPage from "./pages/productCategory/CreateProductCategoryPage";
import UpdateProductCategoryPage from "./pages/productCategory/UpdateProductCategoryPage";
import DeleteProductCategoryPage from "./pages/productCategory/DeleteProductCategoryPage";
import ProductPage from "./pages/product/ProductPage";
import CreateProductPage from "./pages/product/CreateProductPage";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/admin/product-category"
              element={
                <ProtectedRoute>
                  <ProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product-category/create"
              element={
                <ProtectedRoute>
                  <CreateProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product-category/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product-category/delete/:id"
              element={
                <ProtectedRoute>
                  <DeleteProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product"
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product/create"
              element={
                <ProtectedRoute>
                  <CreateProductPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
