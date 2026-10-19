export const normalFetch = async (apiUrl: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${apiUrl}`);
  return res
};

