import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    if(!id) return null;
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  getAll() {
    return this.repo.find();
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) throw new BadRequestException(`User not found`);

    Object.assign(user, attr);
    return this.repo.save(user);

    // https://stackoverflow.com/a/77285118 - save vs update
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException(`User not found`);

    return this.repo.remove(user);
  }
}
