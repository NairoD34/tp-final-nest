import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        author_name: user.name,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({ orderBy: { date_publication: 'desc' } });
  }
  async getFeed(userId: number): Promise<any[] | { message: string }> {
    const following = await this.prisma.follow.findMany({
      where: { follower_id: userId },
      select: { following_id: true },
    });
    const followingIds = following.map((f) => f.following_id);

    const posts = await this.prisma.post.findMany({
      where: {
        user_id: { in: followingIds },
      },
      orderBy: { date_publication: 'desc' },
    });
    if (posts.length === 0) {
      return { message: "You don't follow anyone yet go follow some people to have a good feed !" };
    }
    return posts;
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
    });
    if (!post) {
      return { message: "Post not found" }
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
    });
    if (!post) {
      return { message: "Post not found" };
    }
    if (post.user_id !== userId) {
      return { message: "You are not the author of this post" };
    }
    return this.prisma.post.update({
      where: { id: id },
      data: { ...updatePostDto },
    });
  }

  async remove(postId: number, userId: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
      });
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('User not found');
      }
      if (!post) {
        throw new Error('Post not found');
      }
      if (post.author_name !== user.name) {
        throw new Error('You are not the author of this post');
      }
      const deletedPost = await this.prisma.post.delete({
        where: { id: postId },
      });
      if (deletedPost) {
        return { message: "Post deleted successfully" };
      }
    } catch (error) {
      return { success: false, message: 'Error deleting post' };
    }
  }

  async getLikes(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      return { message: "Post not found" };
    }
    const likeCount = await this.prisma.like.count({
      where: { post_id: postId },
    });
    if (likeCount === 0) {
      return { message: "No likes found for this post" };
    }
    return { likeCount };
  }
}
