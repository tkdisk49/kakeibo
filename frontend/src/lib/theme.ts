import { jaJP } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

// アプリ全体で使うMUIテーマ。ライトモード固定（ダークモード自動切替はしない方針）
// jaJPを適用し、TablePagination等のMUI組み込みラベルを日本語化する
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2E7D6B",
    },
    secondary: {
      main: "#EF6C00",
    },
    background: {
      default: "#F5F5F4",
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
}, jaJP);
