import { Entity, Column } from 'typeorm';
import { SharedEntity } from '../common/model/sharedEntity';

@Entity()
export class ContactUs extends SharedEntity {
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  phoneNo: string;
  @Column()
  businessEmail: string;
  @Column()
  countryName: string;
  @Column()
  topicName: string;
  @Column()
  additionalInfo: string;
}
