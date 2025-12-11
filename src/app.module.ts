import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfilesModule } from './profiles/profiles.module'; // Modül yolu
import { Profile } from './profiles/profile.entity'; // Entity yolu

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Profile], // Sadece Profile kaldı
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ProfilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}