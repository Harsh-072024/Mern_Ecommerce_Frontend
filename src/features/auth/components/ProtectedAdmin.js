import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectLoggedInUser } from '../authSlice';
import { selectUserInfo, selectUserInfoStatus } from '../../user/userSlice';
import { Grid } from 'react-loader-spinner';

function ProtectedAdmin({ children }) {
  const user = useSelector(selectLoggedInUser);
  const userInfo = useSelector(selectUserInfo);
  const status = useSelector(selectUserInfoStatus);


  if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }

  if (status === 'loading' || !userInfo) {
    return <div className="flex items-center justify-center h-96">
              <Grid
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                visible={true}
              />
            </div>
  }
  if (user && userInfo.role !== 'admin') {
    return <Navigate to="/" replace={true}></Navigate>;
  }

  return children;
}

export default ProtectedAdmin;

