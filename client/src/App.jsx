import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import ProductCategoryPage from "./pages/employee/productCategory/ProductCategoryPage";
import CreateProductCategoryPage from "./pages/employee/productCategory/CreateProductCategoryPage";
import UpdateProductCategoryPage from "./pages/employee/productCategory/UpdateProductCategoryPage";
import DeleteProductCategoryPage from "./pages/employee/productCategory/DeleteProductCategoryPage";
import ProductPage from "./pages/employee/product/ProductPage";
import CreateProductPage from "./pages/employee/product/CreateProductPage";
import UpdateProductPage from "./pages/employee/product/UpdateProductPage";
import DeleteProductPage from "./pages/employee/product/DeleteProductPage";
import CourtPage from "./pages/employee/court/CourtPage";
import CreateCourtPage from "./pages/employee/court/CreateCourtPage";
import UpdateCourtPage from "./pages/employee/court/UpdateCourtPage";
import DeleteCourtPage from "./pages/employee/court/DeleteCourtPage";
import AccountPage from "./pages/admin/account/AccountPage";
import CreateAccountPage from "./pages/admin/account/CreateAccountPage";
import UpdateAccountPage from "./pages/admin/account/UpdateAccountPage";
import DeleteAccountPage from "./pages/admin/account/DeleteAccountPage";
import CourtBookingStatusPage from "./pages/customer/courtBookingStatus/CourtBookingStatusPage";
import TimeSlotPage from "./pages/admin/timeSlot/TimeSlotPage";
import CreateTimeSlotPage from "./pages/admin/timeSlot/CreateTimeSlotPage";
import UpdateTimeSlotPage from "./pages/admin/timeSlot/UpdateTimeSlotPage";
import DeleteTimeSlotPage from "./pages/admin/timeSlot/DeleteTimeSlotPage";
import InvoicePage from "./pages/employee/invoice/InvoicePage";
import RevenueStatisticPage from "./pages/admin/revenueStatistic/RevenueStatisticPage";
import InvoiceHistoryPage from "./pages/employee/invoice/InvoiceHistoryPage";
import InvoiceDetailPage from "./pages/employee/invoice/InvoiceDetailPage";
import ViewProductPage from "./pages/customer/product/ViewProductPage";
import GuestHomePage from "./pages/guest/GuestHomePage";
import GuestViewProductPage from "./pages/guest/GuestViewProductPage";
import GuestCourtBookingStatusPage from "./pages/guest/GuestCourtBookingStatusPage";
import RevenuePredictionPage from "./pages/admin/revenuePrediction/RevenuePredictionPage";
import EmployeeCourtBookingStatusPage from "./pages/employee/courtBookingStatus/EmployeeCourtBookingStatusPage";
import ReputationPage from "./pages/admin/reputation/ReputationPage";
import UpdateReputationPage from "./pages/admin/reputation/UpdateReputationPage";

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
              path="/employee/court"
              element={
                <ProtectedRoute>
                  <CourtPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/court/create"
              element={
                <ProtectedRoute>
                  <CreateCourtPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/court/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateCourtPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/court/delete/:id"
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
              path="/customer/court-booking-status"
              element={
                <ProtectedRoute>
                  <CourtBookingStatusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/court-booking-status"
              element={
                <ProtectedRoute>
                  <EmployeeCourtBookingStatusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product-category"
              element={
                <ProtectedRoute>
                  <ProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product-category/create"
              element={
                <ProtectedRoute>
                  <CreateProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product-category/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product-category/delete/:id"
              element={
                <ProtectedRoute>
                  <DeleteProductCategoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product"
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product/create"
              element={
                <ProtectedRoute>
                  <CreateProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/product/delete/:id"
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
              path="/admin/reputation"
              element={
                <ProtectedRoute>
                  <ReputationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reputation/update/:id"
              element={
                <ProtectedRoute>
                  <UpdateReputationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/invoice"
              element={
                <ProtectedRoute>
                  <InvoicePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/invoice/history"
              element={
                <ProtectedRoute>
                  <InvoiceHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/invoice/detail/:id"
              element={
                <ProtectedRoute>
                  <InvoiceDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/invoice/print/:id"
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
            <Route
              path="/admin/revenue-prediction"
              element={
                <ProtectedRoute>
                  <RevenuePredictionPage />
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
