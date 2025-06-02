import { AuthLayout } from '../components/auth/AuthLayout.jsx';
import { Login } from '../components/auth/Login.jsx';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};