import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(
    user: CreateUserDto,
  ): Promise<{ success: boolean; message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
    return { success: true, message: 'User registered successfully' };
  }

  async findOne(name: string): Promise<any | null> {
    const user = await this.prisma.user.findFirst({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {   name: user.name, email: user.email, date_inscription: user.date_inscription };
      }

    async findByEmail(email: string): Promise<any | null> {
      return await this.prisma.user.findUnique({
        where: { email: email },
      });
      
    }

  async findMe(id: number): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {   name: user.name, email: user.email, date_inscription: user.date_inscription };
  }
  async update(id: number, updateUserDto: any): Promise<any> {
    return await this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserDto },
    });
  }
}
