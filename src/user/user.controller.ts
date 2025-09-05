import {  Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMyProfile(@Req() req) {
    console.log(req.user);
    
    return this.userService.findMe(req.user.id);
  }
  @Get('/:name')
  async getUserByName(@Param('name') name: string) {
    return this.userService.findOne(name);
  }
  @Put("update")
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

}
