"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function SonnerProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme === "dark" ? "dark" : "light"}
      position="top-right"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        className: "font-semibold rounded-xl",
      }}
    />
  );
}
