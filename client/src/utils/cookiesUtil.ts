import { NextApiResponse } from "next";

export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    path?: string;
    maxAge?: number;
  } = {}
) => {
  const stringValue = typeof value === "object" ? "j:" + JSON.stringify(value) : String(value);

  // maxAge is already set in options

  res.setHeader("Set-Cookie", [
    `${name}=${stringValue}; ${Object.entries(options)
      .map(([key, val]) => `${key}=${val}`)
      .join("; ")}`,
  ]);
};

export const clearCookie = (res: NextApiResponse, name: string) => {
  res.setHeader("Set-Cookie", [
    `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
  ]);
};
