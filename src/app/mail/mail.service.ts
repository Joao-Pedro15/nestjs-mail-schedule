import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MailEntity } from './mail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveMailDto } from './dto/save-mail.dto';
import { FindAllMailDto } from './dto/find-all-mail.dto';
import fs from 'fs'
import { MailStatusEnum } from './enum/mail-status.enum';

@Injectable()
export class MailService {

  constructor(
    @InjectRepository(MailEntity)
    private readonly mailRepository: Repository<MailEntity>
  ) { }

  async findAll(params?: Partial<FindAllMailDto>) {
    const query = this.mailRepository.createQueryBuilder('mail')

    if (params?.dueDateLte) {
      query.andWhere('mail.dueDate <= :dueDateLte', { dueDateLte: params.dueDateLte })
    }

    if (params?.status) {
      query.andWhere('mail.status = :status', { status: params.status })
    }

    return query.getMany()
  }

  async save(data: SaveMailDto): Promise<MailEntity> {

    return this.mailRepository.save(this.mailRepository.create(data))
  }

  async updateStatus(id: string, status: MailStatusEnum): Promise<void> {
    const mail = await this.mailRepository.findOneOrFail({ where: { id } })
    this.mailRepository.merge(mail, { status })
    await this.mailRepository.save(mail)
  }

}
