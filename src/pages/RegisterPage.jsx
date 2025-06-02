import { AuthLayout } from '../components/auth/AuthLayout.jsx';
import { Register } from '../components/auth/Register.jsx';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
};