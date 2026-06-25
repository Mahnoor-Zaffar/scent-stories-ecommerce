"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { CartLineItem, Product, Variant } from "@/types/catalog";
import type { GeoRegion } from "@/lib/geo-ip";
import { calculateOrderTotals, convertPrice } from "@/lib/geo-ip";

interface CartState {
  items: CartLineItem[];
  region: GeoRegion;
  checkoutStep: "cart" | "shipping" | "payment" | "confirmation";
  customerEmail: string;
  customerPhone: string;
  orderNumber: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; variant: Variant; quantity?: number }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "UPDATE_QUANTITY"; variantId: string; quantity: number }
  | { type: "SET_REGION"; region: GeoRegion }
  | { type: "SET_CHECKOUT_STEP"; step: CartState["checkoutStep"] }
  | { type: "SET_CUSTOMER"; email: string; phone: string }
  | { type: "SET_ORDER_NUMBER"; orderNumber: string }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.variant.id === action.variant.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.variant.id === action.variant.id
              ? {
                  ...item,
                  quantity: item.quantity + (action.quantity ?? 1),
                }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            variant: action.variant,
            quantity: action.quantity ?? 1,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.variant.id !== action.variantId),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.variant.id !== action.variantId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.variant.id === action.variantId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case "SET_REGION":
      return { ...state, region: action.region };
    case "SET_CHECKOUT_STEP":
      return { ...state, checkoutStep: action.step };
    case "SET_CUSTOMER":
      return {
        ...state,
        customerEmail: action.email,
        customerPhone: action.phone,
      };
    case "SET_ORDER_NUMBER":
      return { ...state, orderNumber: action.orderNumber };
    case "CLEAR_CART":
      return { ...state, items: [], checkoutStep: "cart", orderNumber: null };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  setRegion: (region: GeoRegion) => void;
  setCheckoutStep: (step: CartState["checkoutStep"]) => void;
  setCustomer: (email: string, phone: string) => void;
  setOrderNumber: (orderNumber: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalUsd: number;
  totals: ReturnType<typeof calculateOrderTotals>;
}

const CartContext = createContext<CartContextValue | null>(null);

const defaultRegion: GeoRegion = {
  code: "US",
  currency: "USD",
  currencySymbol: "$",
  locale: "en-US",
  dutyRate: 0,
  shippingRate: 12,
  shippingLabel: "Express Domestic (2-3 days)",
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    region: defaultRegion,
    checkoutStep: "cart",
    customerEmail: "",
    customerPhone: "",
    orderNumber: null,
  });

  const addItem = useCallback(
    (product: Product, variant: Variant, quantity = 1) => {
      dispatch({ type: "ADD_ITEM", product, variant, quantity });
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    dispatch({ type: "REMOVE_ITEM", variantId });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", variantId, quantity });
  }, []);

  const setRegion = useCallback((region: GeoRegion) => {
    dispatch({ type: "SET_REGION", region });
  }, []);

  const setCheckoutStep = useCallback((step: CartState["checkoutStep"]) => {
    dispatch({ type: "SET_CHECKOUT_STEP", step });
  }, []);

  const setCustomer = useCallback((email: string, phone: string) => {
    dispatch({ type: "SET_CUSTOMER", email, phone });
  }, []);

  const setOrderNumber = useCallback((orderNumber: string) => {
    dispatch({ type: "SET_ORDER_NUMBER", orderNumber });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUsd = state.items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );
  const totals = calculateOrderTotals(subtotalUsd, state.region);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        setRegion,
        setCheckoutStep,
        setCustomer,
        setOrderNumber,
        clearCart,
        itemCount,
        subtotalUsd,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useLocalizedPrice(usdPrice: number): string {
  const { state } = useCart();
  const converted = convertPrice(usdPrice, state.region);
  return new Intl.NumberFormat(state.region.locale, {
    style: "currency",
    currency: state.region.currency,
    minimumFractionDigits: state.region.code === "JP" ? 0 : 2,
  }).format(converted);
}
