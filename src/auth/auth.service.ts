import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

    async signin(
      email: string,
      pwd: string,
    ): Promise<{  token: string }> {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isMatch = await bcrypt.compare(pwd, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { id: user.id, email: user.email };
      const token = await this.jwtService.signAsync(payload);
      return { token: token };
    }
  async register(user: CreateUserDto): Promise<{ success: boolean; message: string }> {
    return this.userService.register(user);
  }

 
}
