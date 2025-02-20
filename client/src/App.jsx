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
import UpdateProductPage from "./pages/product/UpdateProductPage";
import DeleteProductPage from "./pages/product/DeleteProductPage";
import CourtPage from "./pages/court/CourtPage";
import CreateCourtPage from "./pages/court/CreateCourtPage";
import UpdateCourtPage from "./pages/court/UpdateCourtPage";
import DeleteCourtPage from "./pages/court/DeleteCourtPage";
import AccountPage from "./pages/account/AccountPage";
import CreateAccountPage from "./pages/account/CreateAccountPage";
import UpdateAccountPage from "./pages/account/UpdateAccountPage";
import DeleteAccountPage from "./pages/account/DeleteAccountPage";
import CourtBookingStatusPage from "./pages/courtBookingStatus/CourtBookingStatusPage";
import TimeSlotPage from "./pages/timeSlot/TimeSlotPage";
import CreateTimeSlotPage from "./pages/timeSlot/CreateTimeSlotPage";
import UpdateTimeSlotPage from "./pages/timeSlot/UpdateTimeSlotPage";
import DeleteTimeSlotPage from "./pages/timeSlot/DeleteTimeSlotPage";
import InvoicePage from "./pages/invoice/InvoicePage";

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
              path="/admin/court"
              element={
                <ProtectedRoute>
                  <CourtPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/court/create"
              element={
                <ProtectedRoute>
                  <CreateCourtPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/court/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateCourtPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/court/delete/:id"
              element={
                <ProtectedRoute>
                  <DeleteCourtPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/time-slot"
              element={
                <ProtectedRoute>
                  <TimeSlotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/time-slot/create"
              element={
                <ProtectedRoute>
                  <CreateTimeSlotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/time-slot/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateTimeSlotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/time-slot/delete/:id"
              element={
                <ProtectedRoute>
                  <DeleteTimeSlotPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/court-booking-status"
              element={
                <ProtectedRoute>
                  <CourtBookingStatusPage />
                </ProtectedRoute>
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
            <Route
              path="/admin/product/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product/delete/:id"
              element={
                <ProtectedRoute>
                  <DeleteProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/account/create"
              element={
                <ProtectedRoute>
                  <CreateAccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/account/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateAccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/account/delete/:id"
              element={
                <ProtectedRoute>
                  <DeleteAccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoice"
              element={
                <ProtectedRoute>
                  <InvoicePage />
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
