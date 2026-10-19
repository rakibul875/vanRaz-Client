"use server";

import { getUserToken } from "./session";

export const authHeaders = async () => {
  const token = await getUserToken();
  const header = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  return header;
};

// export const getOrders = async () => {
//   const result = await normalFetch('orders/my-orders')
//   return result
// }
