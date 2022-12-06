import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'users ' })
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  password: string;

  @Field()
  email: string;

  @Field()
  token: string;
}
