import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllUsers,
  deleteUser,
  updateUserRole,
  resetAdminUsersState,
} from "../../features/users/adminUserSlice";

export default function Users() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.adminUsers);

  const [filter, setFilter] = useState("all"); // all, customer, vendor, admin

  useEffect(() => {
    dispatch(fetchAllUsers());

    return () => {
      dispatch(resetAdminUsersState());
    };
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleRoleChange = (id, role) => {
    dispatch(updateUserRole({ id, role }));
  };

  // Filter users based on selected role
  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <p className="text-gray-600 mb-4">
        View all registered users and manage their roles.
      </p>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "customer", "vendor", "admin"].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-3 py-1 rounded ${
              filter === role
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {filteredUsers.length === 0 && !loading ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">
                    <Link
                      to={`/admin/user-detail/${user._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {user.role !== "admin" && (
                      <>
                        {user.role === "customer" &&
                          user.vendor?.shopName &&
                          user.vendor?.shopDescription && (
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              onClick={() =>
                                handleRoleChange(user._id, "vendor")
                              }
                            >
                              Make Vendor
                            </button>
                          )}

                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
