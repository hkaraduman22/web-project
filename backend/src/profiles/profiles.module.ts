import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profile } from './profile.entity';
import { ProfileType } from './profile-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, ProfileType]), 
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}