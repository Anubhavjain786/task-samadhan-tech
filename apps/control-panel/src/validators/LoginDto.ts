import { ArgsType, Field } from '@nestjs/graphql';
import { Max, Min, IsEmail, IsString, Length } from 'class-validator';

@ArgsType()
export class LoginDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @Length(8)
  password: string;
}
