import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';

import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import GroupListPage from './components/GroupListPage';
import GroupDetailsPage from './components/GroupDetailsPage';
import EventListPage from './components/EventListPage';
import EventDetailsPage from './components/EventDetailsPage';
import CreateGroupFormPage from './components/CreateGroupFormPage';
import CreateEventFormPage from './components/CreateEventFormPage';
import EditGroupFormPage from './components/EditGroupFormPage';
import GroupEventNavigations from './components/GroupEventNavigation/GroupEventNavigations';

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
        element: <GroupEventNavigations />,
        children: [
          {
            path: 'groups',
            element: <GroupListPage />
          },
          {
            path: 'events',
            element: <EventListPage />
          }
        ]
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
        path: 'groups/:groupId/events',
        element: <CreateEventFormPage />
      },
      {
        path: 'groups/:groupId/edit',
        element: <EditGroupFormPage />
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