import React from "react";

type GetAllBedsParams = {
  pageParam: number;
};
type GetAllOrderssParams = {
  pageParam: number;
  id:string;
};

interface ProductType {
  name?: string;
  image?: string;
  basePrice?: string;
  price?:string;
}

interface AccessoriesTypes {
  color?: ProductType[];
  storage?: ProductType[];
  feet?: ProductType[];
  headboard?: ProductType[];
  mattress?: ProductType[];
  gaslift?: ProductType[];
}

interface AccessoriesOrderTypes {
  color?: ProductType;
  storage?: ProductType;
  feet?: ProductType;
  headboard?: ProductType;
  mattress?: ProductType;
  gaslift?: ProductType;
  size?: ProductType;
}
interface DeliveryTypes{
  name?:string;
  price:number;
}
interface VariantsTypes {
  _id?: string;
  image: string | null;
  price: {
    basePrice: number;
    salePrice: number;
  };
  size?: string | number;
  accessories?: AccessoriesTypes;
  createdAt?: string;
  updatedAt?: string;
  isDraft?: boolean;
}

type Bed = {
  image: string;
  _id: string;
  name: string;
  description: string;
  variants: VariantsTypes[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
  slug: string;
  images: string[];
  metaTitle: string;
  metaDescription: string;
  __v: number;
};

interface BedRequestPayload {
  name: string;
  description: string;
  slug: string;
  categories: string[];
  images: string[];
  isDraft: boolean;
  metaTitle: string;
  metaDescription: string;
}

interface BlogRequestPayload {
  name: string;
  slug: string;
  content: string;
  images: string[];
  categories: string[];
  metaTitle: string;
  metaDescription: string;
  keyWord: string[];
}

type BedResponse = {
  data: Bed[];
  totalPages: number;
  nextPage: number;
};
type OrderResponse = {
  data: Order[];
  totalPages: number;
  nextPage: number;
};

type CreateBedVariantResponse = {
  message: string;
  data: VariantsTypes;
};

type UploadBedImage = {
  success: boolean;
  message: string;
  url: string;
};

type BedWithImage = {
  size?: string;
  _id?: string;
  name?: string;
  description?: string;
  isDraft?: boolean;

  categories?: string[];
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  price?: {
    basePrice: number;
    salePrice: number;
  };
  accessories?: AccessoriesTypes;
  // __v: number;
};

type BedWithSize = {
  _id: string;
  name: string;
  description: string;
  categories: string[];
  variants: VariantsTypes[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  availabeSizes: string[];
};

type ColorIcon = {
  label: string;
  value: string;
  image: File;
  type: string;
  size: string;
};
type UpdateColorIcon = {
  id: string;
  label: string;
  value: string;
  image: File;
  type: string;
  size: string;
};

interface Accessories {
  _id: string;
  label: string;
  value: string;
  type: string;
  image: string;
  size: string;
}

export interface OrderItems {
  [x: string]: Key | null | undefined;
  name: string;
  size: string;
  quantity: number;
  accessories: AccessoriesOrderTypes;
  price: number;
  image: string;
}
interface Order {
  stripeSession: {
    orderId: string;
    amount_total: number;
    partial_amount: number;
    payment_intent: string;
    reason: string;
    refunded_amount: number;
  };
  discount:{
code:string;
percent:number;
price:number;
  };
  history?: {
    status: string;
    billing: string;
    refund: string;
    createdAt: Date;
  }[];
  lastModifiedBy: any;
  billingAddress: any;
  notes: any;
  staffnotes:any;
  adminImage: any;
  extraDelivery:{
    name:string;
    price:number;
  };
  isDeleted: boolean;
  orderId: Number;
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  orderItems: OrderItems[];
  shippingAddress?:
    | {
        address?: string | undefined;
        townCity?: string | undefined;
        postalCode?: string | undefined;
        country?: string | undefined;
        companyName?: string | undefined;
      }
    | undefined;
  totalPrice: number;

  payment?:
    | {
        paymentMethod: string;
        status: string;
        paymentResult?:
          | {
              id?: string | undefined;
              status?: string | undefined;
              update_time?: string | undefined;
              email_address?: string | undefined;
            }
          | undefined;
      }
    | undefined;

  orderNotes?: string | undefined;

  isDelivered?: boolean | undefined;
  deliveredAt?: string | undefined;

  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  __v: number;
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface IUserRequest {
  name: string;
  email: string;
  role: string;
  password?: string;
}

interface IUserResponse {
  users: IUser[];
  totalPages: number;
  totalUsers: number;
}

interface CouponPayload {
  label: string;
  percent: number;
  max: number;
  description: string;
}

interface Coupon extends CouponPayload {}

interface CreateBlogTypes {
  message?: string;
  name: string;
  slug: string;
  content: string;
  images: string[];
  categories: string[];
  metaTitle: string;
  metaDescription: string;
  keyWord: string[];
}

interface Blogs extends CreateBlogTypes {}

type StripeRefundTypes = {
  payment_intent: string;
  amount_total: number;
};
