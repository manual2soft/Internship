import React, { use, useEffect, useState } from "react";
import avatar from "../assets/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { deleteUser, fetchAllUsers } from "../store/slices/adminSlice";
const Users = () => {
  const [page, setPage] = useState(1);
  const { loading, users, totalUsers } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [maxPage, setMaxPage] = useState(null);

  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalUsers !== undefined) {
      const newMax = Math.ceil(totalUsers / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalUsers]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

  // const handleDeleteUser = (id) => {
  //   // if (totalUsers === 11) {
  //   //   setMaxPage(1);
  //   // }
  //   dispatch(deleteUser(id, page));
  // };

  const handleDeleteUser = async (id) => {
    try {
      setDeletingUserId(id);

      await dispatch(deleteUser(id, page));
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* Header */}
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-gray-600 mb-6">
            Manage your website users.
          </p>
          <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div
              className={`overflow-x-auto rounded-lg ${loading ? "p-10 shadow-none" : `${users && users.length > 0 && "shadow-lg"}`}`}
            >
              {loading ? (
                <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : users && users.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left ">Avatar</th>
                      <th className="px-6 py-3 text-left ">Name</th>
                      <th className="px-6 py-3 text-left ">Email</th>
                      <th className="px-6 py-3 text-left ">Registered On</th>
                      <th className="px-6 py-3 text-left ">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user, index) => {
                      return (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <img
                              src={user?.avatar?.url || avatar}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={deletingUserId === user.id}
                              className="bg-red-gradient text-white px-3 py-1 rounded-md cursor-pointer font-semibold hover:bg-red-600 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px]"
                            >
                              {deletingUserId === user.id ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <h3 className="text-xl p-6 font-bold">No Users found.</h3>
              )}
            </div>

            {/* Pagination */}
            {!loading && users.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-gray-700">
                  Page {page} of {maxPage}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, maxPage))}
                  disabled={page === maxPage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Users;
