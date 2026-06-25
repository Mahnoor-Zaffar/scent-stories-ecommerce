export interface WebhookPayload {
  event: "order.created" | "order.fulfilled" | "order.shipped" | "sms.alert";
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookResult {
  success: boolean;
  webhookId: string;
  payload: WebhookPayload;
  smsSent: boolean;
  emailTriggered: boolean;
}

function generateWebhookId(): string {
  return `wh_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function emitOrderCreatedWebhook(order: {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  total: number;
  currency: string;
  items: { sku: string; quantity: number; title: string }[];
}): Promise<WebhookResult> {
  const payload: WebhookPayload = {
    event: "order.created",
    timestamp: new Date().toISOString(),
    data: {
      order_id: order.orderId,
      order_number: order.orderNumber,
      customer_email: order.customerEmail,
      total: order.total,
      currency: order.currency,
      line_items: order.items,
      fulfillment_status: "pending",
    },
  };

  await simulateNetworkDelay();

  return {
    success: true,
    webhookId: generateWebhookId(),
    payload,
    smsSent: false,
    emailTriggered: true,
  };
}

export async function emitFulfillmentWebhook(order: {
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
}): Promise<WebhookResult> {
  const payload: WebhookPayload = {
    event: "order.fulfilled",
    timestamp: new Date().toISOString(),
    data: {
      order_id: order.orderId,
      order_number: order.orderNumber,
      tracking_number: order.trackingNumber,
      carrier: order.carrier,
      fulfillment_status: "fulfilled",
    },
  };

  await simulateNetworkDelay();

  return {
    success: true,
    webhookId: generateWebhookId(),
    payload,
    smsSent: true,
    emailTriggered: true,
  };
}

export async function emitSmsAlertWebhook(order: {
  orderId: string;
  phoneNumber: string;
  message: string;
}): Promise<WebhookResult> {
  const payload: WebhookPayload = {
    event: "sms.alert",
    timestamp: new Date().toISOString(),
    data: {
      order_id: order.orderId,
      phone_number: order.phoneNumber,
      message: order.message,
      delivery_status: "sent",
    },
  };

  await simulateNetworkDelay();

  return {
    success: true,
    webhookId: generateWebhookId(),
    payload,
    smsSent: true,
    emailTriggered: false,
  };
}

export async function processPostPurchasePipeline(order: {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  phoneNumber: string;
  total: number;
  currency: string;
  items: { sku: string; quantity: number; title: string }[];
}): Promise<WebhookResult[]> {
  const results: WebhookResult[] = [];

  const created = await emitOrderCreatedWebhook(order);
  results.push(created);

  const trackingNumber = `SS${Date.now().toString().slice(-8)}`;
  const fulfilled = await emitFulfillmentWebhook({
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    trackingNumber,
    carrier: "Scent & Stories Premium Logistics",
  });
  results.push(fulfilled);

  const sms = await emitSmsAlertWebhook({
    orderId: order.orderId,
    phoneNumber: order.phoneNumber,
    message: `Your Scent & Stories order ${order.orderNumber} has shipped. Track: ${trackingNumber}`,
  });
  results.push(sms);

  return results;
}

function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 400));
}
