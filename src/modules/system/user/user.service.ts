import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { isEmpty, isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DataSource, Like, Repository } from 'typeorm';

import { CreateUserDto, ListUserDto } from "./dto/user.dto";
import { SysUser } from './entries/sys-user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { PasswordUtils } from '@utils/security/password.utils';
import { SysUserRole } from './entries/sys-user-role.entity';
import { SysUserPost } from './entries/sys-user-post.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>
  ) { }
  /**
  * 用户列表
  * @param user 用户信息
  * @returns 用户列表
  */
  async list(user: ListUserDto): Promise<any> {
    return paginate<SysUser>(
      this.userRepository,
      {
        page: user.page,
        limit: user.limit,
      },
      {
        where: {
          status: user.status,
          deptId: user.deptId,
          userName: isNotEmpty(user.userName) ? Like(`%${user.userName}%`) : undefined,
          nickName: isNotEmpty(user.nickName) ? Like(`%${user.nickName}%`) : undefined,
        },
      }
    )
  }

  /**
   * 校验用户名称是否唯一
   * @param user 用户信息
   * @returns true 唯一 / false 不唯一
   */
  async checkUserNameUnique(user: Partial<SysUser>): Promise<boolean> {
    const { userId, userName } = user

    const info = await this.userRepository.findOneBy({ userName })
    console.log(info, 'userNameuserNameuserName')
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
   * 校验用户邮箱是否唯一
   * @param user 用户信息
   * @returns true 唯一 / false 不唯一
   */
  async checkUserEmailUnique(user: Partial<SysUser>): Promise<boolean> {
    const { userId, email } = user
    if (!email) return true

    const info = await this.userRepository.findOneBy({ email })
    console.log(info, 'emailemailemailemail')
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
  * 校验用户手机号是否唯一
  * @param user 用户信息
  * @returns true 唯一 / false 不唯一
  */
  async checkUserPhoneUnique(user: Partial<SysUser>): Promise<boolean> {
    const { userId, phonenumber } = user
    if (!phonenumber) return true

    const info = await this.userRepository.findOneBy({ phonenumber })
    console.log(info, 'phonenumberphonenumberphonenumberphonenumber')
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
 * 根据用户名查询用户信息
 * @param userName 用户名称
 * @returns 用户信息
 */
  async selectUserByUserName(userName: string): Promise<SysUser> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where({
        userName,
      })
      .getOne()
  }

  /**
* 添加用户
* @param user 用户信息
*/
  async add(user: CreateUserDto): Promise<void> {
    const { roleIds, postIds, ...userInfo } = user

    await this.dataSource.transaction(async (manager) => {
      // 新增用户信息
      userInfo.password = await PasswordUtils.create(user.password)
      const result = await manager.insert(SysUser, userInfo)
      const userId = result.identifiers[0].userId
      console.log('我开启事务了~~~~')
      // 新增用户与角色关联
      // if (!isEmpty(roleIds)) {
      //   await manager.insert(
      //     SysUserRole,
      //     roleIds.map((roleId) => ({ userId, roleId }))
      //   )
      // }

      // // 新增用户与岗位关联
      // if (!isEmpty(postIds)) {
      //   await manager.insert(
      //     SysUserPost,
      //     postIds.map((postId) => ({ userId, postId }))
      //   )
      // }
    })
  }


}