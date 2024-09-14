import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { IsUniqueConstraint } from '@/common/validators/is-unique-constraint';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '123qwe',
      database: 'nestjsbase',
      entities: [User],
      synchronize: true,
      logging: ['query', 'error'],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
