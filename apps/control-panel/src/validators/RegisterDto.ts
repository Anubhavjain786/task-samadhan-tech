import { ArgsType, Field } from '@nestjs/graphql';
import { Max, Min, IsEmail, IsString, Length } from 'class-validator';

@ArgsType()
export class RegisterDto {
  @Field()
  @IsString()
  @Length(2)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @Length(8)
  password: string;
}
