import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';

import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import GroupListPage from './components/GroupListPage';
import GroupDetailsPage from './components/GroupDetailsPage';
import EventListPage from './components/EventListPage';
import EventDetailsPage from './components/EventDetailsPage/EventDetailsPage';
import CreateGroupFormPage from './components/CreateGroupFormPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    }); 
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: 'groups',
        element: <GroupListPage />
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetailsPage />
      },
      {
        path: 'groups/new',
        element: <CreateGroupFormPage />
      },
      {
        path: 'events',
        element: <EventListPage />
      },
      {
        path: 'events/:eventId',
        element: <EventDetailsPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;