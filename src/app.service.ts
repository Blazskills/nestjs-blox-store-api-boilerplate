import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 1. Import it

@Injectable()
export class AppService {
  // 2. Inject it in the constructor
  constructor(private configService: ConfigService) {}

  getHello(): string {
    // 3. Use .get() instead of process.env
    const appName = this.configService.get('APP_NAME');
    const nodeEnv = this.configService.get('NODE_ENV');

    return `Hello World ${appName}! Environment: ${nodeEnv}`;
  }
}
