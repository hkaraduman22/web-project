import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProfileType } from './profile-type.entity';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  photo: string;

  @Column() 
  profileTypeId: number;

  @ManyToOne(() => ProfileType, (profileType) => profileType.profiles)
  @JoinColumn({ name: 'profileTypeId' })
  profileType: ProfileType;
}