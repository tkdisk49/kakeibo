"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { theme } from "@/lib/theme";

// TanStack QueryのProvider。QueryClientをuseStateで生成することで、
// サーバー側のリクエスト間でインスタンスが共有されないようにしている。
// AppRouterCacheProviderはEmotion(MUIのCSS-in-JSエンジン)のスタイルを
// App RouterのSSR/ストリーミングと正しく連携させるためのラッパー
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
