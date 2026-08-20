import Box from "@mui/material/Box";
import { AppHeader } from "@/components/ui/AppHeader";

// ログイン後の画面共通レイアウト（ヘッダーを各ページで書かずに済むよう共通化）
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppHeader />
      {children}
    </Box>
  );
}
