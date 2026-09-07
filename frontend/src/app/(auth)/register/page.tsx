import { Metadata } from 'next';
import RegisterForm  from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export const metadata: Metadata = {
  title: 'Inscription | ShopSense AI',
  description: 'Créez votre compte ShopSense AI et commencez à acheter en toute simplicité.',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez ShopSense AI et simplifiez vos achats internationaux"
    >
      <RegisterForm redirectTo="/" />
    </AuthLayout>
  );
}