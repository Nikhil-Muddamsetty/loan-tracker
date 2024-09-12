export interface Response {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  code?: string;
}

export class Res {
  static success(message: string, data: any): Response {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(code: string, message: string, error?: any): Response {
    return {
      success: false,
      code,
      message,
      error,
      data: {},
    };
  }
}
