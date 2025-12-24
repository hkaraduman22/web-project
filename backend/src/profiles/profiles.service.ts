import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { ProfileType } from './profile-type.entity';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import * as fs from 'fs';

@Injectable()
export class ProfilesService implements OnModuleInit {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
    @InjectRepository(ProfileType) private profileTypesRepository: Repository<ProfileType>,
  ) {}

  async onModuleInit() {
    // Veritabanı silindiği için başlangıçta tipleri tekrar oluşturacak
    const count = await this.profileTypesRepository.count();
    if (count === 0) {
      await this.profileTypesRepository.save([
        { name: 'Yönetici' },
        { name: 'Öğrenci' },
        { name: 'Öğretmen' },
      ]);
    }
  }

  async listProfileTypes() {
    return this.profileTypesRepository.find();
  }

  async listAll() {
    // relations: ['profileType'] ile veriyi çekiyoruz
    return this.profilesRepository.find({ relations: ['profileType'] });
  }

  async getOne(id: number) {
    const profile = await this.profilesRepository.findOne({ 
        where: { id },
        relations: ['profileType']
    });
    if (!profile) throw new NotFoundException();
    return profile;
  }

  async create(createProfileDto: CreateProfileDto, photoUrl: string) {
    if (createProfileDto.password !== createProfileDto.confirmPassword) {
      if(photoUrl) {
          const filePath = photoUrl.replace('http://localhost:3000/uploads/', './uploads/');
          try { fs.unlinkSync(filePath); } catch(e) {}
      }
      throw new BadRequestException('Passwords do not match');
    }

    const typeExists = await this.profileTypesRepository.findOneBy({ id: createProfileDto.profileTypeId });
    if (!typeExists) throw new BadRequestException('Invalid Profile Type ID');

    // DTO'dan gelen ID'yi alıp TypeORM formatına çeviriyoruz
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profileTypeId, ...rest } = createProfileDto;

    const newProfile = this.profilesRepository.create({
      ...rest,
      profileType: { id: profileTypeId } as ProfileType, // Kritik Nokta: İlişkiyi ID ile kuruyoruz
      photo: photoUrl,
    });
    
    return this.profilesRepository.save(newProfile);
  }

  async update(id: number, updateProfileDto: UpdateProfileDto, photoUrl?: string) {
    const profile = await this.getOne(id);
    
    if (updateProfileDto.password && updateProfileDto.confirmPassword) {
         if (updateProfileDto.password !== updateProfileDto.confirmPassword) {
             throw new BadRequestException('Passwords do not match');
         }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profileTypeId, ...rest } = updateProfileDto;

    Object.assign(profile, rest);
    
    if (profileTypeId) {
        profile.profileType = { id: profileTypeId } as ProfileType;
    }

    if (photoUrl) profile.photo = photoUrl;
    return this.profilesRepository.save(profile);
  }

  async delete(id: number) {
    return this.profilesRepository.delete(id);
  }
}