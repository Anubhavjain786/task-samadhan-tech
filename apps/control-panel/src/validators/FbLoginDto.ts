import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@ArgsType()
export class FbLoginDto {
  @Field()
  @IsString()
  @Length(2)
  name: string;

  @Field()
  @IsEmail()
  email: string;
}
