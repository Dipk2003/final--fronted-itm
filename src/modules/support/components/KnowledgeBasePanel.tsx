'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  author: {
    name: string;
  };
}

const KnowledgeBasePanel: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchKnowledgeBaseData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      params.append('published', 'true');

      const [articlesResponse, featuredResponse, categoriesResponse] = await Promise.all([
        api.get(`/api/support-dashboard/knowledge-base/articles?${params.toString()}`),
        api.get('/api/support-dashboard/knowledge-base/featured'),
        api.get('/api/support-dashboard/knowledge-base/categories')
      ]);

      setArticles(articlesResponse.data.content || []);
      setFeaturedArticles(featuredResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching knowledge base data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchKnowledgeBaseData();
  }, [selectedCategory, searchTerm, fetchKnowledgeBaseData]);

  const handleArticleFeedback = useCallback(async (articleId: number, helpful: boolean) => {
    try {
      await api.post(`/api/support-dashboard/knowledge-base/articles/${articleId}/feedback`, {
        helpful
      });
      // Refresh articles to update feedback counts
      fetchKnowledgeBaseData();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  }, [fetchKnowledgeBaseData]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Article
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredArticles.map((article) => (
              <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <span className="text-xs text-yellow-600">⭐ Featured</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>👁️ {article.viewCount} views</span>
                  <span>👍 {article.helpfulCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Articles</h3>
        
        {articles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No articles found. Create your first article to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {article.category}
                      </span>
                      {article.isFeatured && (
                        <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">
                      {article.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {article.content.substring(0, 200)}...
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>By {article.author?.name}</span>
                      <span>👁️ {article.viewCount} views</span>
                      <span>👍 {article.helpfulCount}</span>
                      <span>👎 {article.notHelpfulCount}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleArticleFeedback(article.id, true)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      👍 Helpful
                    </button>
                    <button
                      onClick={() => handleArticleFeedback(article.id, false)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      👎 Not Helpful
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Article Modal (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Article</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Article Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Article Content"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePanel;
