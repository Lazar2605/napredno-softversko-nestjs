interface BaseEmailData {
    from?: string;
    to: string;
    subject: string;
  }
  
  interface HtmlEmailData extends BaseEmailData {
    html: string;
  }
  
  interface TextEmailData extends BaseEmailData {
    text: string;
  }
  
  export type EmailData = HtmlEmailData | TextEmailData;