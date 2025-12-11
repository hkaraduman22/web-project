import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto'; // Artık ismi bulabilecek

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}