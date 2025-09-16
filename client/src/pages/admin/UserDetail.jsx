import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchUserById,
  resetAdminUsersState,
} from "../../features/users/adminUserSlice";

export default function UserDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedUser: user, loading, error } = useSelector(
    (state) => state.adminUsers
  );

  useEffect(() => {
    dispatch(fetchUserById(id));

    return () => {
      dispatch(resetAdminUsersState());
    };
  }, [dispatch, id]);

  if (loading) return <p className="p-6">Loading user details...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!user) return <p className="p-6 text-gray-600">User not found.</p>;

  return (
    <div className="p-6">
      <Link
        to="/admin/users"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        &larr; Back to Users
      </Link>

      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>

      <div className="bg-white shadow rounded p-4 space-y-3">
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span>{" "}
          {user.role === "customer" && user.vendor?.shopName
            ? "Vendor"
            : user.role}
        </p>

        {user.phone && (
          <p>
            <span className="font-semibold">Phone:</span> {user.phone}
          </p>
        )}

        {user.address?.street && (
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {`${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.postalCode}, ${user.address.country}`}
          </p>
        )}

        {/* Vendor info */}
        {user.vendor && (
          <div className="mt-2 p-2 border rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Vendor Info</h2>
            <p>
              <span className="font-semibold">Shop Name:</span>{" "}
              {user.vendor.shopName || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Shop Description:</span>{" "}
              {user.vendor.shopDescription || "N/A"}
            </p>
            <p>
              <span className="font-semibold">GST Number:</span>{" "}
              {user.vendor.gstNumber || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Verified:</span>{" "}
              {user.vendor.isVerified ? "Yes" : "No"}
            </p>
          </div>
        )}

        <p>
          <span className="font-semibold">Active:</span>{" "}
          {user.isActive ? "Yes" : "No"}
        </p>

        <p>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Updated At:</span>{" "}
          {new Date(user.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
