'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useToast } from '@/hooks';
import { PasswordResetRequestSchema } from '@/lib/validators';

type ForgotPasswordFormData = z.infer<typeof PasswordResetRequestSchema>;

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      setIsSuccess(true);
      success('Email de réinitialisation envoyé !');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setError('root', { message });
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <Mail className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </CardHeader>

        <CardBody>
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email envoyé !
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nous vous avons envoyé un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              <Link href="/login">
                <Button variant="outline" className="mt-4">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errors.root && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                  {errors.root.message}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="vous@exemple.com"
                    className="pl-10"
                    error={errors.email?.message}
                    {...register('email')}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le lien'
                )}
              </Button>
            </form>
          )}
        </CardBody>

        <CardFooter className="justify-center border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/login"
            className="flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}