import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  async likeUnlike(@Param('postId') postId: number, @Req() req) {
    const userId = req.user.id;
    return await this.likeService.likeUnlike(postId, userId);
  }

  @Get(':postId')
  async findAllByPost(@Param('postId') postId: number) {
    return await this.likeService.findAllByPost(postId);
  }

  @Get()
  async findAll() {
    return await this.likeService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.likeService.findOne(id);
  }
}
