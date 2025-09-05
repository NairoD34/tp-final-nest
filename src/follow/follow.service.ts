import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}
  async followUnfollow(
    createFollowDto: CreateFollowDto,
  ): Promise<{ message: string }> {
    const { follower_id, following_id } = createFollowDto;
    const follow = await this.prisma.follow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id,
          following_id,
        },
      },
    });
    const following = await this.prisma.user.findUnique({
      where: {
        id: following_id,
      },
    });
    if (!following) {
      throw new Error(
        'The person that you are trying to follow does not exist',
      );
    }
    if (follow) {
      const deletedFollow = await this.prisma.follow.delete({
        where: {
          follower_id_following_id: {
            follower_id,
            following_id,
          },
        },
      });
      if (deletedFollow) {
        return { message: 'Unfollowed successfully' };
      }
    }

    const createdFollow = await this.prisma.follow.create({
      data: {
        follower_id,
        following_id,
      },
    });
    if (createdFollow) {
      return { message: 'Followed successfully' };
    }
    throw new Error('Follow/Unfollow action failed');
  }

  async myFollowers(userId: number) {
    return await this.prisma.follow.findMany({
      where: {
        following_id: userId,
      },
    });
  }

  async myFollowings(userId: number): Promise<any[] | { message: string }> {
    const follows = await this.prisma.follow.findMany({
      where: { follower_id: userId }, 
      include: {
        follower: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (follows.length === 0) {
      return { message: "You don't follow anyone yet" }
    }
    const following = follows.map((f) => f.follower);
    return following;
  }

  async update(id: number, updateFollowDto: UpdateFollowDto) {
    return await this.prisma.follow.update({
      where: { id },
      data: updateFollowDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.follow.delete({
      where: { id },
    });
  }
}
