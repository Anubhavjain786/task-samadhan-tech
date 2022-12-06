import { Dispatch, Hash, Helpers } from '@libs/boat';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'libs/common/src';

@Injectable()
export class ControlPanelAPIService {
  private users: IUser[] = [];

  constructor(private jwt: JwtService) {}

  async registerUser(user: IUser) {
    if (this.users.filter((u) => user.email === u.email).length > 0) {
      throw new NotFoundException('User Already Exists');
    }

    const hashedPassword = await Hash.make(user.password);
    user = { ...user, password: hashedPassword, id: Helpers.uuid() };
    this.users.push(user);

    Dispatch({
      job: 'SEND_SIGNUP_MAIL',
      data: {
        name: user.name,
        email: user.email,
        subject: 'We are happy to have you',
      },
    });

    const token = this.jwt.sign({ id: user.id });
    return token;
  }

  loginUser({ email, password }: IUser) {
    const [user] = this.users.filter((user) => user.email === email);
    if (!user) {
      throw new NotFoundException('User Already Exists');
    }

    if (!Hash.compare(password, user.password)) {
      throw new NotFoundException('Incorrect password');
    }

    const token = this.jwt.sign({ id: user.id });
    return token;
  }

  fbLoginUser({ email, name }: IUser) {
    let [user] = this.users.filter((user) => user.email === email);

    if (!user) {
      user = { name, email, id: Helpers.uuid() };
      this.users.push(user);
      Dispatch({
        job: 'SEND_SIGNUP_MAIL',
        data: {
          name: user.name,
          email: user.email,
          subject: 'We are happy to have you',
        },
      });
    }

    const token = this.jwt.sign({ id: user.id });
    return token;
  }

  getUserById(user: IUser) {
    user = this.users.filter((u) => user.id === u.id)[0];
    return { ...user, password: undefined };
  }
}
