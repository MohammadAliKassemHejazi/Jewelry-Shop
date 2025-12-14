// Simplified PayPal integration - using basic HTTP requests
import axios from 'axios';
import { CustomError } from '../utils/customError';

export class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private environment: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    this.environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
    this.baseUrl = this.environment === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    if (!this.clientId || !this.clientSecret) {
      throw new Error('PayPal credentials not found in environment variables');
    }
  }

  // Get access token
  private async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/v1/oauth2/token`, 
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
          }
        }
      );
      return response.data.access_token;
    } catch (error: any) {
      throw new CustomError('Failed to get PayPal access token', 'PAYPAL_AUTH_ERROR', 500);
    }
  }

  // Create PayPal order
  async createOrder(orderData: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      sku?: string;
    }>;
    currency: string;
    returnUrl: string;
    cancelUrl: string;
  }): Promise<any> {
    try {
      const { items, currency, returnUrl, cancelUrl } = orderData;
      const accessToken = await this.getAccessToken();

      // Calculate totals
      const itemTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = itemTotal * 0.1; // 10% tax
      const total = itemTotal + tax;

      const orderData_paypal = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: itemTotal.toFixed(2)
              },
              tax_total: {
                currency_code: currency,
                value: tax.toFixed(2)
              }
            }
          },
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: currency,
              value: item.price.toFixed(2)
            },
            sku: item.sku || undefined
          }))
        }],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'Samah Jewelry',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW'
        }
      };

      const response = await axios.post(`${this.baseUrl}/v2/checkout/orders`, orderData_paypal, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      throw new CustomError('Failed to create PayPal order', 'PAYPAL_ORDER_CREATE_ERROR', 500);
    }
  }

  // Capture PayPal order
  async captureOrder(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      throw new CustomError('Failed to capture PayPal order', 'PAYPAL_ORDER_CAPTURE_ERROR', 500);
    }
  }

  // Get order details
  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      throw new CustomError('Failed to get PayPal order details', 'PAYPAL_ORDER_GET_ERROR', 500);
    }
  }

  // Refund order
  async refundOrder(captureId: string, amount?: number, reason?: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const refundRequest = {
        amount: amount ? {
          currency_code: 'USD',
          value: amount.toFixed(2)
        } : undefined,
        note_to_payer: reason || 'Refund request'
      };

      const response = await axios.post(`${this.baseUrl}/v2/payments/captures/${captureId}/refund`, refundRequest, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      throw new CustomError('Failed to refund PayPal order', 'PAYPAL_REFUND_ERROR', 500);
    }
  }

  // Verify webhook signature
  async verifyWebhook(headers: any, body: string, webhookId: string): Promise<boolean> {
    try {
      // Simplified webhook verification - in production, implement proper signature verification
      return true;
    } catch (error: any) {
      throw new CustomError('Failed to verify PayPal webhook', 'PAYPAL_WEBHOOK_VERIFY_ERROR', 400);
    }
  }
}

export const paypalService = new PayPalService();
