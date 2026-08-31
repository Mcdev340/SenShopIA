import { apiClient } from '@/lib/api-client';
import {
  PaymentIntent,
  PaymentMethod,
  PaymentResult,
  MobileMoneyPayment,
  MobileMoneyPaymentResult,
  BankTransferPayment,
  BankTransferDetails,
  CardPayment,
  Subscription,
  SubscriptionPlan,
  PromotionCode,
  PaymentTransaction,
  Wallet,
  WalletTransaction,
  PaymentWebhook,
} from '@/types/payment';

class PaymentsService {
  private static instance: PaymentsService;

  private constructor() {}

  public static getInstance(): PaymentsService {
    if (!PaymentsService.instance) {
      PaymentsService.instance = new PaymentsService();
    }
    return PaymentsService.instance;
  }

  // ============ PAYMENT INTENTS ============

  async createPaymentIntent(amount: number, currency = 'XOF', metadata?: Record<string, string>): Promise<PaymentIntent> {
    return apiClient.post<PaymentIntent>('/payments/create-intent/', {
      amount,
      currency,
      metadata,
    });
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResult> {
    return apiClient.post<PaymentResult>('/payments/confirm/', {
      payment_intent_id: paymentIntentId,
      payment_method_id: paymentMethodId,
    });
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    return apiClient.post<PaymentIntent>(`/payments/${paymentIntentId}/cancel/`);
  }

  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    return apiClient.get<PaymentIntent>(`/payments/${paymentIntentId}/`);
  }

  async getPaymentStatus(paymentIntentId: string): Promise<{ status: string; message: string }> {
    return apiClient.get(`/payments/${paymentIntentId}/status/`);
  }

  // ============ PAYMENT METHODS ============

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return apiClient.get<PaymentMethod[]>('/payments/methods/');
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    return apiClient.get<PaymentMethod>(`/payments/methods/${id}/`);
  }

  async addCardPayment(cardData: CardPayment): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>('/payments/methods/card/', cardData);
  }

  async addMobileMoney(phone: string, provider: string): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>('/payments/methods/mobile-money/', {
      phone,
      provider,
    });
  }

  async addBankTransfer(accountData: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode?: string;
    iban?: string;
  }): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>('/payments/methods/bank-transfer/', accountData);
  }

  async removePaymentMethod(id: string): Promise<void> {
    return apiClient.delete(`/payments/methods/${id}/`);
  }

  async setDefaultPaymentMethod(id: string): Promise<void> {
    return apiClient.post(`/payments/methods/${id}/set-default/`);
  }

  async verifyPaymentMethod(id: string, code: string): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>(`/payments/methods/${id}/verify/`, { code });
  }

  // ============ MOBILE MONEY ============

  async initiateMobileMoneyPayment(data: MobileMoneyPayment): Promise<MobileMoneyPaymentResult> {
    return apiClient.post<MobileMoneyPaymentResult>('/payments/mobile-money/initiate/', data);
  }

  async confirmMobileMoneyPayment(transactionId: string, code: string): Promise<PaymentResult> {
    return apiClient.post<PaymentResult>('/payments/mobile-money/confirm/', {
      transaction_id: transactionId,
      code,
    });
  }

  async getMobileMoneyStatus(transactionId: string): Promise<MobileMoneyPaymentResult> {
    return apiClient.get<MobileMoneyPaymentResult>(`/payments/mobile-money/${transactionId}/status/`);
  }

  // ============ BANK TRANSFER ============

  async initiateBankTransfer(data: BankTransferPayment): Promise<{
    reference: string;
    bankDetails: BankTransferDetails;
  }> {
    return apiClient.post('/payments/bank-transfer/initiate/', data);
  }

  async confirmBankTransfer(reference: string): Promise<PaymentResult> {
    return apiClient.post<PaymentResult>('/payments/bank-transfer/confirm/', { reference });
  }

  async getBankTransferDetails(reference: string): Promise<BankTransferDetails> {
    return apiClient.get<BankTransferDetails>(`/payments/bank-transfer/${reference}/`);
  }

  // ============ SIMULATE PAYMENT ============

  async simulatePayment(amount: number, method: string): Promise<PaymentResult> {
    return apiClient.post<PaymentResult>('/payments/simulate/', {
      amount,
      method,
      simulate: true,
    });
  }

  // ============ TRANSACTIONS ============

  async getPaymentHistory(params?: { page?: number; limit?: number; status?: string }): Promise<{
    transactions: PaymentTransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/payments/transactions/?${queryParams.toString()}`);
  }

  async getTransaction(id: string): Promise<PaymentTransaction> {
    return apiClient.get<PaymentTransaction>(`/payments/transactions/${id}/`);
  }

  // ============ REFUNDS ============

  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<PaymentResult> {
    return apiClient.post<PaymentResult>(`/payments/${paymentId}/refund/`, {
      amount,
      reason,
    });
  }

  async getRefundStatus(refundId: string): Promise<{ status: string; message: string }> {
    return apiClient.get(`/payments/refunds/${refundId}/status/`);
  }

  // ============ WALLET ============

  async getWallet(): Promise<Wallet> {
    return apiClient.get<Wallet>('/payments/wallet/');
  }

  async getWalletTransactions(params?: { page?: number; limit?: number; type?: string }): Promise<{
    transactions: WalletTransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get(`/payments/wallet/transactions/?${queryParams.toString()}`);
  }

  async depositToWallet(amount: number, method: string): Promise<WalletTransaction> {
    return apiClient.post<WalletTransaction>('/payments/wallet/deposit/', {
      amount,
      method,
    });
  }

  async withdrawFromWallet(amount: number, method: string, accountDetails: any): Promise<WalletTransaction> {
    return apiClient.post<WalletTransaction>('/payments/wallet/withdraw/', {
      amount,
      method,
      account_details: accountDetails,
    });
  }

  // ============ SUBSCRIPTIONS ============

  async getSubscriptions(): Promise<Subscription[]> {
    return apiClient.get<Subscription[]>('/payments/subscriptions/');
  }

  async getSubscription(id: string): Promise<Subscription> {
    return apiClient.get<Subscription>(`/payments/subscriptions/${id}/`);
  }

  async createSubscription(planId: string, paymentMethodId: string): Promise<Subscription> {
    return apiClient.post<Subscription>('/payments/subscriptions/', {
      plan_id: planId,
      payment_method_id: paymentMethodId,
    });
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return apiClient.post<Subscription>(`/payments/subscriptions/${id}/cancel/`);
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return apiClient.get<SubscriptionPlan[]>('/payments/subscriptions/plans/');
  }

  // ============ PROMOTIONS ============

  async validatePromotionCode(code: string, orderTotal?: number): Promise<PromotionCode> {
    const params = new URLSearchParams({ code });
    if (orderTotal) {
      params.append('order_total', String(orderTotal));
    }
    return apiClient.get<PromotionCode>(`/payments/promotions/validate/?${params.toString()}`);
  }

  async getAvailablePromotions(): Promise<PromotionCode[]> {
    return apiClient.get<PromotionCode[]>('/payments/promotions/available/');
  }

  // ============ WEBHOOKS ============

  async processWebhook(payload: any, signature: string): Promise<PaymentWebhook> {
    return apiClient.post<PaymentWebhook>('/payments/webhook/', payload, {
      headers: {
        'X-Stripe-Signature': signature,
      },
    });
  }

  // ============ PAYMENT METHODS FOR ORDER ============

  async getPaymentMethodsForOrder(orderId: string): Promise<PaymentMethod[]> {
    return apiClient.get<PaymentMethod[]>(`/payments/order/${orderId}/methods/`);
  }

  // ============ UTILITY ============

  async getSupportedPaymentMethods(): Promise<{
    types: string[];
    providers: {
      mobile_money: string[];
      banks: string[];
    };
  }> {
    return apiClient.get('/payments/supported-methods/');
  }
}

export const paymentsService = PaymentsService.getInstance();