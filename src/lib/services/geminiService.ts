import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateHashtags(content: string, platform: string): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Analyze this social media content and generate relevant hashtags for ${platform} platform.
        
        Content: "${content}"
        
        Requirements:
        - Generate 10-15 relevant hashtags
        - Mix popular and niche hashtags
        - Consider platform-specific trends
        - Include industry-specific tags
        - Make them engaging and discoverable
        
        Return only the hashtags separated by commas, no explanations.
        Example: #marketing #socialmedia #business #entrepreneur #growth
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract hashtags from response
      const hashtags = text
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#'))
        .slice(0, 15);

      return hashtags;
    } catch (error) {
      console.error("Error generating hashtags with Gemini:", error);
      return this.getFallbackHashtags(content, platform);
    }
  }

  async optimizeContent(content: string, platform: string): Promise<{
    optimizedContent: string;
    improvements: string[];
    engagementScore: number;
    reachScore: number;
    conversionScore: number;
  }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Optimize this social media content for ${platform} platform to maximize engagement, reach, and conversion.
        
        Original Content: "${content}"
        
        Please provide:
        1. Optimized version of the content
        2. List of specific improvements made
        3. Engagement score (0-100)
        4. Reach score (0-100) 
        5. Conversion score (0-100)
        
        Consider:
        - Platform-specific best practices
        - Emotional triggers and call-to-actions
        - Optimal length and format
        - Trending topics and keywords
        - Audience engagement patterns
        
        Format your response as JSON:
        {
          "optimizedContent": "optimized text here",
          "improvements": ["improvement 1", "improvement 2"],
          "engagementScore": 85,
          "reachScore": 78,
          "conversionScore": 72
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            optimizedContent: parsed.optimizedContent || content,
            improvements: parsed.improvements || [],
            engagementScore: parsed.engagementScore || 50,
            reachScore: parsed.reachScore || 50,
            conversionScore: parsed.conversionScore || 50
          };
        }
      } catch (parseError) {
        console.error("Error parsing Gemini JSON response:", parseError);
      }

      // Fallback if JSON parsing fails
      return {
        optimizedContent: content,
        improvements: ["Content analysis completed"],
        engagementScore: 75,
        reachScore: 70,
        conversionScore: 65
      };
    } catch (error) {
      console.error("Error optimizing content with Gemini:", error);
      return {
        optimizedContent: content,
        improvements: ["AI optimization temporarily unavailable"],
        engagementScore: 50,
        reachScore: 50,
        conversionScore: 50
      };
    }
  }

  async analyzeEngagement(accountData: any, posts: any[]): Promise<{
    insights: string[];
    recommendations: string[];
    trends: string[];
    audienceAnalysis: string;
  }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Analyze this social media account data and provide insights and recommendations.
        
        Account Data:
        - Platform: ${accountData.platform}
        - Followers: ${accountData.followersCount}
        - Posts: ${accountData.postsCount}
        - Username: ${accountData.username}
        
        Recent Posts Performance:
        ${posts.slice(0, 10).map(post => `
          - Content: "${post.content.substring(0, 100)}..."
          - Likes: ${post.likes}
          - Comments: ${post.comments}
          - Shares: ${post.shares}
          - Views: ${post.views}
          - Type: ${post.type}
        `).join('\n')}
        
        Provide analysis in JSON format:
        {
          "insights": ["insight 1", "insight 2", "insight 3"],
          "recommendations": ["recommendation 1", "recommendation 2"],
          "trends": ["trend 1", "trend 2"],
          "audienceAnalysis": "detailed audience analysis here"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing Gemini analysis response:", parseError);
      }

      return {
        insights: ["AI analysis completed"],
        recommendations: ["Continue creating engaging content"],
        trends: ["Monitor performance patterns"],
        audienceAnalysis: "Audience analysis completed"
      };
    } catch (error) {
      console.error("Error analyzing engagement with Gemini:", error);
      return {
        insights: ["Analysis temporarily unavailable"],
        recommendations: ["Keep posting consistently"],
        trends: ["Monitor your metrics"],
        audienceAnalysis: "Analysis in progress"
      };
    }
  }

  async generateContentIdeas(topic: string, platform: string, count: number = 5): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Generate ${count} creative content ideas for ${platform} about "${topic}".
        
        Requirements:
        - Make them engaging and shareable
        - Consider ${platform} best practices
        - Include different content types (educational, entertaining, promotional)
        - Make them specific and actionable
        - Consider trending angles
        
        Return as a simple list, one idea per line.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text
        .split('\n')
        .map(idea => idea.trim())
        .filter(idea => idea.length > 0)
        .slice(0, count);
    } catch (error) {
      console.error("Error generating content ideas with Gemini:", error);
      return [
        `Create a post about ${topic}`,
        `Share insights on ${topic}`,
        `Ask your audience about ${topic}`,
        `Create a tutorial on ${topic}`,
        `Share a success story about ${topic}`
      ];
    }
  }

  async predictOptimalPostTime(accountData: any, platform: string): Promise<{
    bestTimes: string[];
    reasoning: string;
    timezone: string;
  }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Analyze this social media account and predict optimal posting times for ${platform}.
        
        Account Data:
        - Platform: ${platform}
        - Followers: ${accountData.followersCount}
        - Username: ${accountData.username}
        - Account Type: ${accountData.type || 'personal'}
        
        Provide optimal posting times considering:
        - Platform-specific peak hours
        - Audience demographics
        - Industry best practices
        - Timezone considerations
        
        Return in JSON format:
        {
          "bestTimes": ["6:00 PM", "12:00 PM", "9:00 AM"],
          "reasoning": "explanation of why these times are optimal",
          "timezone": "suggested timezone"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing Gemini timing response:", parseError);
      }

      return {
        bestTimes: ["6:00 PM", "12:00 PM", "9:00 AM"],
        reasoning: "Based on general social media best practices",
        timezone: "UTC"
      };
    } catch (error) {
      console.error("Error predicting optimal post time with Gemini:", error);
      return {
        bestTimes: ["6:00 PM", "12:00 PM"],
        reasoning: "Default optimal times",
        timezone: "UTC"
      };
    }
  }

  async analyzeTrends(platform: string, industry?: string): Promise<{
    trendingTopics: string[];
    hashtags: string[];
    contentTypes: string[];
    predictions: string[];
  }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        Analyze current trends for ${platform} social media platform${industry ? ` in the ${industry} industry` : ''}.
        
        Provide:
        1. Top 5 trending topics
        2. Popular hashtags
        3. Trending content types
        4. Future trend predictions
        
        Return in JSON format:
        {
          "trendingTopics": ["topic 1", "topic 2"],
          "hashtags": ["#hashtag1", "#hashtag2"],
          "contentTypes": ["video", "carousel", "story"],
          "predictions": ["prediction 1", "prediction 2"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Error parsing Gemini trends response:", parseError);
      }

      return {
        trendingTopics: ["AI", "Sustainability", "Remote Work"],
        hashtags: ["#trending", "#viral", "#popular"],
        contentTypes: ["video", "carousel", "story"],
        predictions: ["Video content will dominate", "AI integration will increase"]
      };
    } catch (error) {
      console.error("Error analyzing trends with Gemini:", error);
      return {
        trendingTopics: ["Technology", "Lifestyle", "Business"],
        hashtags: ["#content", "#socialmedia", "#marketing"],
        contentTypes: ["post", "story", "reel"],
        predictions: ["Content will become more interactive"]
      };
    }
  }

  private getFallbackHashtags(content: string, platform: string): string[] {
    const baseHashtags = ["#content", "#socialmedia", "#marketing"];
    const platformHashtags = {
      instagram: ["#instagram", "#instagood", "#photooftheday"],
      facebook: ["#facebook", "#social", "#community"],
      youtube: ["#youtube", "#video", "#subscribe"],
      twitter: ["#twitter", "#tweet", "#trending"]
    };
    
    return [...baseHashtags, ...(platformHashtags[platform as keyof typeof platformHashtags] || [])];
  }
}

