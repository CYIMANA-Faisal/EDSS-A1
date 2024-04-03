import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Get a greeting message.
   * @returns A greeting message.
   */
  getHello(): string {
    return 'Hello A1 assignment';
  }
}
