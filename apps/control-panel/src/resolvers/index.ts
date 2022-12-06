import { CurrentUser } from '@libs/boat/validator';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'libs/auth/src';
import { User } from 'libs/users/src';
import { FbLoginDto, LoginDto, RegisterDto } from '../validators';
import { ControlPanelAPIService } from '../services';
import { JwtGuard } from '../guards';

@Resolver()
export class ControlPanelResolver {
  constructor(private service: ControlPanelAPIService) {}

  @UseGuards(JwtGuard)
  @Query((returns) => User)
  async user(@CurrentUser() user: Record<string, any>) {
    return this.service.getUserById(user);
  }

  @Mutation((returns) => Auth)
  async register(@Args() registerArgs: RegisterDto) {
    const token = this.service.registerUser(registerArgs);
    return { message: 'success', token };
  }

  @Mutation((returns) => Auth)
  async login(@Args() loginArgs: LoginDto) {
    const token = this.service.loginUser(loginArgs);
    return { message: 'success', token };
  }

  @Mutation((returns) => Auth)
  async fbLogin(@Args() loginArgs: FbLoginDto) {
    const token = this.service.fbLoginUser(loginArgs);
    return { message: 'success', token };
  }
}
