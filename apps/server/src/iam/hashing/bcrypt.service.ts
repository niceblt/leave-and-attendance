import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { HashingService } from './hashing.service';
@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string): Promise<string> {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  }
  async compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
