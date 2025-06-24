"use client";

import React from "react";
import { ImageKitProvider } from "imagekitio-next";
import axios from "axios";

const authenticator = async () => {
  try {
    const response = await axios.get("/api/imagekit-auth");
    return response.data;
  } catch (error) {
    console.error("Error fetching ImageKit authentication:", error);
    throw error;
  }
};

export const ImageKitProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ImageKitProvider
      authenticator={authenticator}
      publicKey={process.env.IMAGEKIT_PUBLIC_KEY || ""}
      urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT || ""}
    >
      {children}
    </ImageKitProvider>
  );
};
