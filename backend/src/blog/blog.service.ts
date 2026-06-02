import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  findAll() {
    return this.articleRepository.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.articleRepository.findOneBy({ id });
  }

  create(data: Partial<Article>) {
    const article = this.articleRepository.create(data);
    return this.articleRepository.save(article);
  }

  async update(id: number, data: Partial<Article>) {
    await this.articleRepository.update(id, data);
    return this.findOne(id);
  }

  delete(id: number) {
    return this.articleRepository.delete(id);
  }
}
