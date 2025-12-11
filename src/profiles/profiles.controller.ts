import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  listAll() {
    return this.profilesService.listAll();
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.getOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads', // Ana dizinde uploads klasörü olmalı
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  create(@Body() createProfileDto: CreateProfileDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Photo is required');
    const photoUrl = `http://localhost:3000/uploads/${file.filename}`;
    return this.profilesService.create(createProfileDto, photoUrl);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProfileDto: UpdateProfileDto, @UploadedFile() file: Express.Multer.File) {
    const photoUrl = file ? `http://localhost:3000/uploads/${file.filename}` : undefined;
    return this.profilesService.update(id, updateProfileDto, photoUrl);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.delete(id);
  }
}