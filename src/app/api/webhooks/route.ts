import { NextResponse } from "next/server";
import {
  emitOrderCreatedWebhook,
  emitFulfillmentWebhook,
  emitSmsAlertWebhook,
} from "@/lib/webhooks";

export async function POST(request: Request) {
  const body = await request.json();
  const { event, data } = body as {
    event: string;
    data: Record<string, unknown>;
  };

  let result;

  switch (event) {
    case "order.created":
      result = await emitOrderCreatedWebhook({
        orderId: data.order_id as string,
        orderNumber: data.order_number as string,
        customerEmail: data.customer_email as string,
        total: data.total as number,
        currency: data.currency as string,
        items: data.items as { sku: string; quantity: number; title: string }[],
      });
      break;
    case "order.fulfilled":
      result = await emitFulfillmentWebhook({
        orderId: data.order_id as string,
        orderNumber: data.order_number as string,
        trackingNumber: data.tracking_number as string,
        carrier: data.carrier as string,
      });
      break;
    case "sms.alert":
      result = await emitSmsAlertWebhook({
        orderId: data.order_id as string,
        phoneNumber: data.phone_number as string,
        message: data.message as string,
      });
      break;
    default:
      return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  }

  return NextResponse.json(result);
}
