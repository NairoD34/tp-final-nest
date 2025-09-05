import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateFollowDto } from './dto/create-follow.dto';

@UseGuards(AuthGuard)
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async followUnfollow(@Body() createFollowDto: CreateFollowDto, @Req() req) {
     const dtoWithFollower = { ...createFollowDto, follower_id: req.user.id };
     
    return await this.followService.followUnfollow(dtoWithFollower);
  }

  @Get("my-followers")
  async myFollowers(@Req()req) {
    return await this.followService.myFollowers(req.user.id);
  }

  @Get("my-follows")
  async myFollowings(@Req()req) {
    return await this.followService.myFollowings(req.user.id);
  }
   

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followService.update(+id, updateFollowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followService.remove(+id);
  }
}
