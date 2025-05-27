import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from 'src/modules/users/dto/users.type';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => UserType)
  user: UserType;
}
