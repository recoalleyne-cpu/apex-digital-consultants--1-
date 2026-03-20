import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyAdminSession } from '../../utils/adminApi';

type AdminRouteGuardProps = {
  children: React.ReactElement;
};

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const isValid = await verifyAdminSession();
      if (isMounted) {
        setIsAllowed(isValid);
        setIsChecking(false);
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-apple-gray-50 px-5 py-16 sm:px-6 md:px-8">
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-apple-gray-100 bg-white p-7 text-center sm:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-apple-gray-500 sm:text-3xl">
            Loading Admin
          </h1>
          <p className="mt-3 text-sm leading-7 text-apple-gray-300 sm:text-base">
            Validating your admin session.
          </p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return children;
};
