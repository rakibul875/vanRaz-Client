export interface IProduct {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images: string[];
  category?: string;
}

export interface IMessage {
  id: string;
  sender: "user" | "bot";
  reply: string;
  type: "TEXT" | "PRODUCT_LIST" | "ORDER_STATUS";
  data?: IProduct[] | { orderId: string; status: string };
  createdAt: Date;
}
