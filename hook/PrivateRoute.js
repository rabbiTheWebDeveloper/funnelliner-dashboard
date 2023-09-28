import Cookies from 'js-cookie';
import moment from 'moment';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { nextDueDate } from '../pages/api';

const withAuth = (Component = null, options = {}) => {
  const WithAuthComponent = (props) => {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(true);
    const redirectIfNotAuthenticated = options.redirectIfNotAuthenticated || "/login";
    const redirectIfAuthenticated = options.redirectIfAuthenticated || "/";
    const today = moment(new Date()).format('YYYY-MM-DD');
    const tomorrow = moment(today).add(1, 'day').format('YYYY-MM-DD')
    // const dueDate = new Date(nextDueDate);
    const dueDate = new Date('2023-09-12');
    const originalDueDate = new Date(dueDate);

  // Calculate the date 7 days from the original due date
  const extendedDueDate = new Date(originalDueDate);
  extendedDueDate.setDate(originalDueDate.getDate() + 7);

  // Get today's date
  const today1 = new Date();

    useEffect(() => {
      const token = Cookies.get('token');
      const userCookie = Cookies.get('user');
      const nextDuData = Cookies.get('next_due_date');
      const user = userCookie ? JSON.parse(userCookie) : null;
      console.log("extendedDueDate > today1" ,extendedDueDate > today1)

      // Route is protected but not authenticated. Redirect to login page
      if (options.isProtectedRoute && !token) {
        router.replace(redirectIfNotAuthenticated);
        return;
      }

      // Route is not protected but authenticated. Redirect to Dashboard or provided URL
      if (!options.isProtectedRoute && token) {
        router.replace(redirectIfAuthenticated);
        return;
      }

      if (!options.show && user?.status === 'expired' && user?.payment_status === 'unpaid' && nextDueDate === null && token) {
        router.replace('/billing');
        return;
      }
      if (!options.show && user?.status === 'expired' && user?.payment_status === 'unpaid' && token) {
        router.replace('/billing');
        return;
      }

      if (!options.show && nextDueDate === null && token) {
        router.replace('/billing');
        return;
      }
      if (!options.show && !(extendedDueDate > today1) && token  && user?.payment_status === 'unpaid') {


        router.replace('/billing');
        return
      }
      // if (!options.show && nextDueDate === null && token) {
      //   router.replace('/billing');
      //   return;
      // }

      setPageLoading(false);
    }, []);

    if (pageLoading) {
      return null;
    }

    return <Component {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
