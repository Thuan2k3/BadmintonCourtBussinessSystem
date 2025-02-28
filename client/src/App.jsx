import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import ProductCategoryPage from "./pages/admin/productCategory/ProductCategoryPage";
import CreateProductCategoryPage from "./pages/admin/productCategory/CreateProductCategoryPage";
import UpdateProductCategoryPage from "./pages/admin/productCategory/UpdateProductCategoryPage";
import DeleteProductCategoryPage from "./pages/admin/productCategory/DeleteProductCategoryPage";
import ProductPage from "./pages/admin/product/ProductPage";
import CreateProductPage from "./pages/admin/product/CreateProductPage";
import UpdateProductPage from "./pages/admin/product/UpdateProductPage";
import DeleteProductPage from "./pages/admin/product/DeleteProductPage";
import CourtPage from "./pages/admin/court/CourtPage";
import CreateCourtPage from "./pages/admin/court/CreateCourtPage";
import UpdateCourtPage from "./pages/admin/court/UpdateCourtPage";
import DeleteCourtPage from "./pages/admin/court/DeleteCourtPage";
import AccountPage from "./pages/admin/account/AccountPage";
import CreateAccountPage from "./pages/admin/account/CreateAccountPage";
import UpdateAccountPage from "./pages/admin/account/UpdateAccountPage";
import DeleteAccountPage from "./pages/admin/account/DeleteAccountPage";
import CourtBookingStatusPage from "./pages/admin/courtBookingStatus/CourtBookingStatusPage";
import TimeSlotPage from "./pages/admin/timeSlot/TimeSlotPage";
import CreateTimeSlotPage from "./pages/admin/timeSlot/CreateTimeSlotPage";
import UpdateTimeSlotPage from "./pages/admin/timeSlot/UpdateTimeSlotPage";
import DeleteTimeSlotPage from "./pages/admin/timeSlot/DeleteTimeSlotPage";
import InvoicePage from "./pages/admin/invoice/InvoicePage";
import RevenueStatisticPage from "./pages/admin/revenueStatistic/RevenueStatisticPage";
import InvoiceHistoryPage from "./pages/admin/invoice/InvoiceHistoryPage";
import InvoiceDetailPage from "./pages/admin/invoice/InvoiceDetailPage";
import ViewProductPage from "./pages/admin/product/ViewProductPage";
import GuestHomePage from "./pages/guest/GuestHomePage";
import GuestViewProductPage from "./pages/guest/ViewProductPage";
import GuestCourtBookingStatusPage from "./pages/guest/GuestCourtBookingStatusPage";

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
              path="/home"
              element={
                <PublicRoute>
                  <GuestHomePage />
                </PublicRoute>
              }
            />
            <Route
              path="/product"
              element={
                <PublicRoute>
                  <GuestViewProductPage />
                </PublicRoute>
              }
            />
            <Route
              path="/court-booking-status"
              element={
                <PublicRoute>
                  <GuestCourtBookingStatusPage />
                </PublicRoute>
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
              path="/customer/product/view"
              element={
                <ProtectedRoute>
                  <ViewProductPage />
                </ProtectedRoute>
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
            <Route
              path="/admin/invoice/history"
              element={
                <ProtectedRoute>
                  <InvoiceHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoice/detail/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoice/print/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/revenue"
              element={
                <ProtectedRoute>
                  <RevenueStatisticPage />
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
