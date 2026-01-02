from sqlalchemy import Column, String, Text, DateTime, ForeignKey, func
from database.database import Base

class Categories(Base):
    __tablename__ = 'categories'

    id = Column(String(128), primary_key=True, index=True, nullable=False)
    name = Column(String(50), unique=True, nullable=False)

class Tags(Base):
    __tablename__ = 'tags'

    id = Column(String(128), primary_key=True, index=True, nullable=False)
    name = Column(String(50), unique=True, nullable=False)

class Article(Base):
    __tablename__ = 'articles'

    id = Column(String(128), primary_key=True, index=True, nullable=False)
    title = Column(String(150), index=True, nullable=False)
    author = Column(String(50), index=True, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(String(500), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=True, onupdate=func.now())

class Post(Base):
    __tablename__ = 'posts'

    id = Column(String(128), primary_key=True, index=True, nullable=False)
    title = Column(String(150), index=True, nullable=False)
    author = Column(String(50), index=True, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=True, onupdate=func.now())

class PostImages(Base):
    __tablename__ = 'post_images'

    id = Column(String(128), primary_key=True, index=True, nullable=False)
    post_id = Column(String(128), ForeignKey('posts.id', ondelete=None, onupdate=None), nullable=False, index=True)
    image_url = Column(String(200), index=True, nullable=False)

class PostVideos(Base):
    __tablename__ = 'post_videos'

    id = Column(String(128), primary_key=True, index=True, nullable=False)
    post_id = Column(String(128), ForeignKey('posts.id', ondelete=None, onupdate=None), nullable=False, index=True)
    video_url = Column(String(200), index=True, nullable=False)

class PostCategories(Base):
    __tablename__ = 'post_categories'

    post_id = Column(String(128), ForeignKey('posts.id', ondelete=None, onupdate=None), nullable=False, index=True)
    categories_id = Column(String(128), ForeignKey('categories.id', ondelete=None, onupdate=None), nullable=False, index=True)

class PostTags(Base):
    __tablename__ = 'post_tags'

    post_id = Column(String(128), ForeignKey('posts.id', ondelete=None, onupdate=None), nullable=False, index=True)
    tags_id = Column(String(128), ForeignKey('tags.id', ondelete=None, onupdate=None), nullable=False, index=True)

class ArticleCategories(Base):
    __tablename__ = 'article_categories'

    article_id = Column(String(128), ForeignKey('articles.id', ondelete=None, onupdate=None), nullable=False, index=True)
    categories_id = Column(String(128), ForeignKey('categories.id', ondelete=None, onupdate=None), nullable=False, index=True)

class ArticleTags(Base):
    __tablename__ = 'article_tags'

    article_id = Column(String(128), ForeignKey('articles.id', ondelete=None, onupdate=None), nullable=False, index=True)
    tags_id = Column(String(128), ForeignKey('tags.id', ondelete=None, onupdate=None), nullable=False, index=True)