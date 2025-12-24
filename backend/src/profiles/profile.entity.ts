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

  @Column({ nullable: true })
  photo: string;

  // DİKKAT: '@Column() profileTypeId: number;' satırı BURADAN SİLİNDİ.
  // Çökme sebebi o satırdı. Sadece alttaki ilişki kalmalı:

  @ManyToOne(() => ProfileType, (profileType) => profileType.profiles, { eager: true })
  @JoinColumn({ name: 'profileTypeId' })
  profileType: ProfileType;
}