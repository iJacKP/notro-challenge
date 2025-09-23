import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RepositoryType {
  @Field()
  name: string;

  @Field()
  url: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  stars: number;

  @Field(() => Int)
  watchers: number;

  @Field(() => Int)
  issues: number;
}