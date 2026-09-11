'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, Clock, MessageCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardBody } from '@/components/ui/Card';
import { useToast } from '@/hooks';
import { ContactSchema } from '@/lib/validators';

type ContactFormData = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      success('Message envoyé avec succès !');
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      showError('Erreur d\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@shopsense-ai.com',
      link: 'mailto:contact@shopsense-ai.com',
      description: 'Nous répondons sous 24h',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+221 77 000 00 00',
      link: 'tel:+221770000000',
      description: 'Lun-Ven, 8h-18h',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: 'Dakar, Sénégal',
      link: 'https://maps.google.com',
      description: 'Venez nous rencontrer',
    },
  ];

  const faqItems = [
    { q: 'Quels sont vos horaires ?', a: 'Nous sommes disponibles du lundi au vendredi de 8h à 18h.' },
    { q: 'Comment suivre ma commande ?', a: 'Connectez-vous à votre compte et rendez-vous dans la section "Mes commandes".' },
    { q: 'Puis-je modifier ma commande ?', a: 'Oui, tant que votre commande n\'est pas encore en cours de traitement.' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contactez-nous
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Nous sommes là pour vous aider. N'hésitez pas à nous contacter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Contact */}
        <div className="lg:col-span-1 space-y-4">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index}>
                <CardBody className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.title}
                      </p>
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                      >
                        {item.value}
                      </a>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}

          <Card>
            <CardBody className="p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Horaires d'ouverture
              </p>
              <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span>Lundi - Vendredi</span>
                  <span>8h - 18h</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span>Samedi</span>
                  <span>9h - 13h</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Dimanche</span>
                  <span className="text-red-500">Fermé</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4 text-primary-600" />
                <span>Une question ? Consultez notre</span>
                <a href="/faq" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  FAQ
                </a>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Message envoyé !
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <Button className="mt-4" onClick={() => setIsSuccess(false)}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Jean Dupont"
                        error={errors.name?.message}
                        {...register('name')}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="jean@exemple.com"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sujet <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Sujet de votre message"
                      error={errors.subject?.message}
                      {...register('subject')}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Décrivez votre demande..."
                      rows={5}
                      error={errors.message?.message}
                      {...register('message')}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-4 h-4" />
                    <span>Notre équipe vous répondra dans les 24h.</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>

          {/* FAQ rapide */}
          <div className="mt-4">
            <Card>
              <CardBody className="p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Questions fréquentes
                </p>
                <div className="space-y-2">
                  {faqItems.map((item, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-900 dark:text-white font-medium">{item.q}</p>
                      <p className="text-gray-500 dark:text-gray-400">{item.a}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}