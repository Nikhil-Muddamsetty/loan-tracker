import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoansModule } from './loans/loans.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RepaymentsModule } from './repayments/repayments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production', '.env'],
    }),
    LoansModule,
    PrismaModule,
    RepaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
