import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likeUnlike(
    postId: number,
    userId: number,
  ): Promise<{ message: string } > {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) {
      return { message: 'Post not found' };
    }
    const existingLike = await this.prisma.like.findUnique({
      where: {
        user_id_post_id: {
          user_id: Number(userId),
          post_id: Number(postId),
        },
      },
    });
    if (existingLike?.user_id !== userId) {
      return {message: "You cannot like your own post"};
    }

    if (existingLike) {
      const unlike = await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
        
      });
      if (unlike) {
        return { message: 'Post unliked successfully' };
      }
    } else {
      const like = await this.prisma.like.create({
        data: {
          post: { connect: { id: Number(postId) } },
          user: { connect: { id: Number(userId) } },
        },
      });
      if (like) {
        return { message: 'Post liked successfully' };
      }
    }
    throw new Error('Like/Unlike action failed');
  }

  async findAllByPost(postId: number) {
    return await this.prisma.like.findMany({
      where: { post_id: postId },
    });
  }
  async findOne(id: number) {
    return await this.prisma.like.findUnique({
      where: { id: id },
    });
  }
  async findAll() {
    return await this.prisma.like.findMany();
  }
}
