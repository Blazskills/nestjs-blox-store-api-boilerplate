import { Module, Global } from '@nestjs/common'; // Add Global
import { PrismaService } from './prisma.service';

@Global() // This makes it available everywhere without importing PrismaModule
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // This is the key!
})
export class PrismaModule {}
