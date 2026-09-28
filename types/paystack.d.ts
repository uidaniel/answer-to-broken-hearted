declare module "@paystack/inline-js" {
  interface PaystackTransaction {
    reference: string;
    status?: string;
    message?: string;
    trans?: string;
  }
  interface NewTransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
    onError?: (error: { message: string }) => void;
    onLoad?: (response: unknown) => void;
  }
  export default class PaystackPop {
    newTransaction(options: NewTransactionOptions): void;
  }
}
