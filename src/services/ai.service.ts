import axios from "axios";

interface IGenerateAIDescriptionPayload {
  title: string;
  category?: string;
  keywords?: string[];
  language: "en" | "bn";
}

export const generateAIDescription = async (
  payload: IGenerateAIDescriptionPayload,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/ai/generate-description`,
    payload,
  );
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/ai/generate-description`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "application-json": "contant-type",
  //       },
  //       body: JSON.stringify(payload),
  //     },
  //   );
  return response.data;
};
