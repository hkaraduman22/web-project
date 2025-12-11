import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto'; // Bunu oluşturduğunu varsayıyorum

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  async listAll() {
    return this.profilesRepository.find();
  }

  async getOne(id: number) {
    const profile = await this.profilesRepository.findOneBy({ id });
    if (!profile) throw new NotFoundException();
    return profile;
  }

  // create metodunu güncelledik (resim url ve şifre kontrolü)
  async create(createProfileDto: CreateProfileDto, photoUrl: string) {
    if (createProfileDto.password !== createProfileDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const newProfile = this.profilesRepository.create({
      ...createProfileDto,
      photo: photoUrl, // Dosya yolunu ekliyoruz
    });
    
    // confirmPassword veritabanına kaydedilmemeli, entity'de yok zaten.
    return this.profilesRepository.save(newProfile);
  }

  async update(id: number, updateProfileDto: UpdateProfileDto, photoUrl?: string) {
    const profile = await this.getOne(id);
    
    if (updateProfileDto.password && updateProfileDto.confirmPassword) {
         if (updateProfileDto.password !== updateProfileDto.confirmPassword) {
             throw new BadRequestException('Passwords do not match');
         }
    }

    Object.assign(profile, updateProfileDto);
    if (photoUrl) profile.photo = photoUrl; // Yeni resim varsa güncelle

    return this.profilesRepository.save(profile);
  }

  async delete(id: number) {
    return this.profilesRepository.delete(id);
  }
}