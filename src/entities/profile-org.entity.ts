import { SharedEntity } from 'src/common/model/sharedEntity';
import { Profile } from './profile.entity';
import { Organisation } from './organisation.entity';
import { OrgRole } from 'src/organisation/orgRole.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ProfileOrg extends SharedEntity {
  @ManyToOne(() => Organisation, (organisation) => organisation.id)
  organisation: string;

  @ManyToOne(() => Profile, (profile) => profile.id)
  profile: string;

  @Column({
    type: 'enum',
    enum: OrgRole,
    default: OrgRole.Developer,
  })
  format: OrgRole;
}