export class ApiResponse<T> {
  success: boolean;
  data: T | null;

  constructor(success: boolean, data: T | null = null) {
    this.success = success;
    this.data = data;
  }
}
