import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return new Date(Date.now()).toLocaleString();
  }
}
