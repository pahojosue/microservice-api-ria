from typing import Annotated, Optional, List
from uuid import uuid4
from pydantic import BaseModel, field_validator

class CategoryItemSchema(BaseModel):
    name: str

    @field_validator("name")
    def name_not_none(cls, value):
        assert value is not None, "The name cannot be empty"
        return value

class CreateCategorySchema(BaseModel):
    category: CategoryItemSchema

class GetCategorySchema(BaseModel):
    category: CategoryItemSchema

class GetCategorysSchema(BaseModel):
    categories: List[CategoryItemSchema]

class ArticleItemSchema(BaseModel):
    title: str
    author: str
    description: str
    content: str    

class CreateArticleSchema(BaseModel):
    article: ArticleItemSchema

class GetArticleSchema(BaseModel):
    article: ArticleItemSchema

class GetArticlesSchema(BaseModel):
    articles: List[ArticleItemSchema]