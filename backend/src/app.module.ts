import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from './profiles/profile.entity';
import { ProfileType } from './profiles/profile-type.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Profile, ProfileType],
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