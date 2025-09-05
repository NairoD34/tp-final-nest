import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
  ) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return await this.postService.create(createPostDto, req.user.id);
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('feed')
  async getFeed(@Req() req) {
    return await this.postService.getFeed(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') postId: string, @Req() req) {

    return await this.postService.remove(Number(postId), req.user.id);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto, @Req() req) {
    return await this.postService.update(+id, updatePostDto, req.user.id);
  }
  @Get(':id/likes')
  async getLikes(@Param('id') id: string) {
    return await this.postService.getLikes(+id);
  }
}