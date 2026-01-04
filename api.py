from fastapi import FastAPI, HTTPException, Depends, status
from uuid import uuid4
from main import app, db_dependency
import models.models as model
from schemas.schemas import (
    GetCategorySchema,
    GetCategorysSchema,
    CreateCategorySchema,
    CreateArticleSchema,
    GetArticleSchema,
    GetArticlesSchema,
)

@app.post("/category", status_code=status.HTTP_201_CREATED)
async def create_category(category: CreateCategorySchema, db: db_dependency):
    db_category = model.Categories(**category.category.model_dump())
    db.add(db_category)
    db.commit()

@app.get("/category/{category_id}", status_code=status.HTTP_200_OK)
async def read_category(category_id: str, db: db_dependency):
    category = db.query(model.Categories).filter(model.Categories.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return {"category": category}

@app.get("/category", status_code=status.HTTP_200_OK)
async def read_all_category(db: db_dependency):
    categories = db.query(model.Categories).all()
    if categories is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return {"categories": categories}

@app.post("/article", status_code=status.HTTP_201_CREATED)
async def create_article(article: CreateArticleSchema, db: db_dependency):
    db_article = model.Article(**article.article.model_dump())
    db.add(db_article)
    db.commit()

@app.get("/article/{article_id}", status_code=status.HTTP_200_OK, response_model=GetArticleSchema)
async def get_article(article_id: str, db: db_dependency):
    article = db.query(model.Article).filter(model.Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    return {"article": article}

@app.get("/articles", status_code=status.HTTP_200_OK, response_model=GetArticlesSchema)
async def get_all_articles(db: db_dependency):
    articles = db.query(model.Article).all()
    if articles is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Articles found")
    return {"articles": articles}