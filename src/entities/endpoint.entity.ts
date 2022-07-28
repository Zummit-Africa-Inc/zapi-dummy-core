import { SharedEntity } from '../common/model/sharedEntity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { HttpMethod } from '../common/enums/httpMethods.enum';
import { ReqBody } from '../endpoints/interface/endpoint.interface';
const urlEncoode = require('urlencode')

@Entity()
export class Endpoint extends SharedEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: HttpMethod,
    default: HttpMethod.GET,
    nullable: true,
  })
  method: HttpMethod;

  @Column()
  route: string;

  @Column()
  apiId: string;

  @Column()
  description: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  headers: object[];

  @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
  requestBody: ReqBody[];
  
  @BeforeInsert()
  public encodeUrl(){
    let encodedRoute = urlEncoode(this.route)
    this.route = encodedRoute
    return this.route
  }

}
