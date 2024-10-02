//global.d.ts

declare global {
  interface window {
    ChannelIO: any;
    gtag_report_conversion?: (url?: string) => void;
    gtag?: (key: string, event: string, config: any) => void;
  }
}

interface Window {
  gtag_report_conversion?: (url?: string) => void;
  gtag?: (key: string, event: string, config: any) => void;
}

export {};
