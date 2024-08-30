export class Response {
  static success(message: string, data: any) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(code: string, message: string, error?: any) {
    return {
      success: false,
      code,
      message,
      error,
    };
  }
}
